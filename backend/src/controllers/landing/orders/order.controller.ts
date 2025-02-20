import { Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Inject, InternalServerErrorException, Logger, NotFoundException, Param, ParseIntPipe, Post, Put, Query, Render, Req, Res, Sse, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { get, has, isEmpty, pick, set, sum, sumBy} from 'lodash';
import * as bcrypt from 'bcrypt';
import { ClientGuard, OptionalGuard } from 'src/guards';
import { AddressBookModel, CompanyModel, OrderItemModel, OrderModel, OrderTimelineModel, RoleModel, TransactionModel, UserModel } from 'src/models';
import { CreateOrderValidation } from 'src/validation';
import { MailService } from 'src/services';
import { PesapalService } from 'src/services/pesapal/pesapal.service';
import { PesapalServiceException } from 'src/exceptions/pesapal.exception';
import * as moment from 'moment';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { OrderCreatedEvent, OrderPaidEvent } from 'src/events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ControllerException } from 'src/exceptions/controller.exception';
import { interval, map, Observable, startWith, switchMap } from 'rxjs';
import { ViewOrderInterceptor } from 'src/interceptors';
import { sep } from 'path';

const json = require('json-reader-writer');

@Controller('orders')
export class OrderController {

  private logger = new Logger(OrderController.name);

  private readonly home;

  /**
   * The constructor for the OrderController class.
   *
   * @param {Cache} cacheManager - The cache manager instance.
   * @param {AddressBookModel} addressBookModel - The address book model instance.
   * @param {CompanyModel} companyModel - The company model instance.
   * @param {ConfigService} configService - The config service instance.
   * @param {RoleModel} roleModel - The role model instance.
   * @param {MailService} mailService - The mail service instance.
   * @param {OrderModel} orderModel - The order model instance.
   * @param {TransactionModel} transactionModel - The transaction model instance.
   * @param {PesapalService} pesapalService - The pesapal service instance.
   * @param {UserModel} userModel - The user model instance.
   */
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache, // The cache manager instance.
    private addressBookModel: AddressBookModel, // The address book model instance.
    private companyModel: CompanyModel, // The company model instance.
    private configService: ConfigService, // The config service instance.
    private eventEmitter: EventEmitter2, // The event emitter instance.
    private roleModel: RoleModel, // The role model instance.
    private mailService: MailService, // The mail service instance.
    private orderModel: OrderModel, // The order model instance.
    private orderItemModel: OrderItemModel, // The order model instance.
    private orderTimelineModel: OrderTimelineModel, // The order timeline model instance.
    private transactionModel: TransactionModel, // The transaction model instance.
    private pesapalService: PesapalService, // The pesapal service instance.
    private userModel: UserModel // The user model instance.
  ) {
    this.home   = !process.cwd().includes('backend') ? `${process.cwd()}${sep}backend` : process.cwd();
  }

  /**
   * Retrieves paginated list of orders for a logged-in user.
   *
   * @param {number} page - The page number of the results to retrieve. Defaults to 1.
   * @param {number} limit - The maximum number of results to retrieve per page. Defaults to 10.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>} Promise that resolves with a JSON response containing the paginated list of orders.
   */
  @UseGuards(ClientGuard)
  @Get('')
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Req() req: Request,  
    @Res() res: Response
  ) {
    try {
      // Get the logged-in user from the request
      let user = get(req,'user');

      // Fetch orders for the user
      let orders = await this.orderModel.paginate(
        { page,limit },
        { user_id: user.id }
      );

      // Send the paginated list of orders as a JSON response
      return res.status(HttpStatus.OK).json({ orders });

    } catch (err) {
      // If an error occurs, do nothing
    }
  }   

  @UseGuards(OptionalGuard)
  @Post('')
  /**
   * Store a new user order.
   *
   * @param {CreateOrderValidation} form - The form data containing user details and order items.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>} Promise that resolves with a JSON response containing the stored order.
   */
  async store(
    @Body() form: CreateOrderValidation,
    @Req()  req:  Request, 
    @Res()  res:  Response
  ) {
    try {
      // Create an instance of OrderCreatedEvent
      let orderCreatedEvent = new OrderCreatedEvent();

      // Check if the order type is new or existing
      if (form.type == "new") {

        // Generate random string for token and fetch company and role IDs
        let randomstring      = require("randomstring");
        let { id: companyId } = await this.companyModel.first();
        let { id: roleId }    = await this.roleModel.findOneBy({ name: 'client'});

        // Hash password and generate token, set company and role IDs, and remove confirm password field
        form.password      = await bcrypt.hash(form.password, parseInt(this.configService.get('SALT_LENGTH')));
        form['token']      = randomstring.generate(100);
        form['company_id'] = companyId;
        form['role_id']    = roleId;
        delete form.confirm_password;

        // Save user, address, and order
        let user    = await this.userModel.save(pick(form,['first_name','last_name','email','phone_number','password','token','company_id','role_id']));
        let address = await this.addressBookModel.save({ ...pick(form,['address_line_1','address_line_2','county_state','city_town','country','postal_code','category']),'user_id': user.id, category: 'home' });
        let order   = await this.orderModel.save({ ...pick(form,['saved']), user_id: user.id, address_id: address.id, num_id: moment().unix() });
        
        await Promise.all(
          form.items.map( async (item) => {
            if( has(item,'sizes')){
              set(item,'quantity',parseInt(sumBy(item.sizes,'quantity')));
            }
            return await this.orderItemModel.save({ ...item, order_id: order.id });
          })
        )

        
        // Send user confirmation email
        await this.mailService.sendUserConfirmation(user);

        // Send order created event
        order                 = await this.orderModel.findOneBy({ id: order.id });
        orderCreatedEvent.id  = order.id;
        this.eventEmitter.emit('order.created', orderCreatedEvent);

        // Send response with stored order
        return res.status(HttpStatus.OK).json({ order });

      } 

      // Check if the order type is existing
      if (form.type == "existing") {

        // Get the logged-in user and save the order
        let user   = get(req,'user');

        let order  = await this.orderModel.save({ ...pick(form,['address_id','saved']), user_id: user.id, num_id: moment().unix()  });

        await Promise.all(
          form.items.map( async (item) => {
            if( has(item,'sizes')){
              set(item,'quantity',parseInt(sumBy(item.sizes,'quantity')));
            }
            return await this.orderItemModel.save({ ...item, order_id: order.id });
          })
        )
        
        order                 = await this.orderModel.findOneBy({ id: order.id });
        orderCreatedEvent.id  = order.id;
        this.eventEmitter.emit('order.created', orderCreatedEvent);

        // Send response with stored order
        return res.status(HttpStatus.OK).json({ order });
      }

    } catch(error) {

      // If a PesapalServiceException occurs, log the status
      if( error instanceof PesapalServiceException ) {
        this.logger.error(error);
      }

      throw new ControllerException(error);

    }
  } 

  @UseGuards(OptionalGuard)
  @Put(':order/show')
  async show(
    @Param('order') orderId: string,
    @Req()          req: Request,  
    @Res()          res: Response
  ) {

    try{
      let order                = await this.orderModel.findOne({ where:{ id: orderId } });
      // let cached_products: any = await this.cacheManager.store.get('amrod_products');

      // order.items = order.items.map( item => {
      //   let product = cached_products.find( value => value.fullCode == item.code )
      //   item.image  = first(first(product.images).urls).url;
      //   return item;
      // })

      return res.status(HttpStatus.OK).json({ order });

    } catch (err) {
      throw new HttpException(err.message, err.status);
    }

  }  
  /**
   * Fetch an order by its ID and return it as a JSON response.
   *
   * @param orderId The ID of the order to fetch.
   * @param req The request object.
   * @param res The response object.
   * @returns A JSON response containing the fetched order.
   */
  @UseGuards(ClientGuard)
  @UseInterceptors(ViewOrderInterceptor)
  @Put(':order/view')
  async view(
    @Param('order') orderId: string, // The ID of the order to fetch.
    @Req() req: Request, // The request object.
    @Res() res: Response // The response object.
  ) {

    try {

      // Fetch the order with the specified ID, including its associated user.
      let order = await this.orderModel.findOne({ where: { id: orderId }, relations: ['user'] });

      // Return the fetched order as a JSON response with a 200 status code.
      return res.status(HttpStatus.OK).json({ order });

    } catch(error) {

      // Log the error and return a JSON response with the appropriate status code.
      this.logger.error(error);
      
      res.status(error.status).json({order: {} });
    }

  }  

  /**
   * Handles the checkout process. Retrieves the service fees for the company
   * and the shipping addresses for the logged in user (if any).
   *
   * @param req The request object
   * @param res The response object
   * @returns A Promise that resolves to the list of service fees and shipping addresses
   */
  @UseGuards(OptionalGuard)
  @Get('checkout')
  async checkout(
    @Req()          req: Request,  
    @Res()          res: Response
  ) {

    try{

      // Retrieve the user's shipping addresses if logged in
      let addresses = Array();
      if( has(req,'user') ){
        let user     = get(req,'user');
        addresses    = await user.address_book;
      }

      // Retrieve the company's service fees
      let service_fees = Array();
      let company  = await this.companyModel.first();
      service_fees = company.service_fees;

      // Return the shipping addresses and service fees as a JSON response
      return res.status(HttpStatus.OK).json({ addresses, service_fees });

    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }

  }

  @UseGuards(OptionalGuard)
  @Get('cart')
  /**
   * Retrieves the service fees for the company
   * @param req The request object
   * @param res The response object
   * @returns A Promise that resolves to the list of service fees
   */
  async create(
    @Req()          req: Request,  
    @Res()          res: Response
  ) {
    try{

      // Retrieve the company
      let company  = await this.companyModel.first();

      // Return the service fees
      return res.status(HttpStatus.OK).json({ service_fees: company.service_fees });

    } catch (error) {
      // Log any errors that occur
      res.status(error.status).json({ message: 'An error occurred while retrieving the service fees' });
    }
  }

  @UseGuards(OptionalGuard)
  @Put('transaction/:transaction/cancel')
  /**
   * Cancel a transaction with Pesapal
   *
   * @param {string} transactionId - The ID of the transaction.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>} Promise that resolves with a JSON response containing the order.
   */
  async cancel(
    @Param('transaction') transactionId: string,
    @Req()          req: Request,  
    @Res()          res: Response
  ) {
    try{
      // Authenticate with Pesapal to retrieve the transaction status
      let  { token }   = await this.pesapalService.auth();

      // Retrieve the transaction to cancel
      let transaction  = await this.transactionModel.findOne({ where: { id: transactionId } });

      // Cancel the transaction with Pesapal
      await this.pesapalService.cancelTransaction(transaction.tracking_id, token);

      // Delete the transaction from the database
      await this.transactionModel.delete({ id: transactionId });
            
      // Return a JSON response with a 200 status code
      return res.status(HttpStatus.OK).json({});

    } catch (error) {
      // Return a JSON response with the appropriate status code
      res.status(error.status).json({ message: String() });
    }
  }

  /**
   * Send an order to the user's email address.
   *
   * @param {string} orderId - The ID of the order.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>} Promise that resolves with a JSON response containing the order.
   */
  // @UseGuards(ClientGuard)
  @Put(':order/send')  
  async send(
    @Param('order') orderId: string,
    @Req()          req: Request,  
    @Res()          res: Response
  ) {

    try{
      // Find the order
      let order = await this.orderModel.findOneOrFail({ where:{ id: orderId } });
      // Find the user associated with the order
      let user  = await this.userModel.findOne({ where: { id: order.user_id }});

      // Calculate the total for each item in the order
      // order.items = order.items.map( (item,key) => {
      //   item.total = (item.price * item.quantity).toFixed();
      //   item.index = (key + 1);
      //   return item;
      // });

      // Send the order invoice to the user's email address
      await this.mailService.payment(order);

      // Return the order as a JSON response
      return res.status(HttpStatus.OK).json({ order });

    } catch (err) {
      // If an error occurs, log the error and return an HTTP 500 status
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
    }

  }  

  /**
   * Retrieve the status of a transaction for an order.
   *
   * @param {string} orderId - The ID of the order.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>} Promise that resolves with a JSON response containing the transaction status.
   */
  @UseGuards(OptionalGuard)
  @Sse(':order/status')  
  async status(
    @Param('order') orderId: string,
    @Req()          req: Request, 
    @Res()          res: Response
  ): Promise<Observable<any>> {
      // Authenticate with Pesapal to retrieve the transaction status
      let pesapal_auth       = await this.pesapalService.auth();
      let subscription       = interval(2000);
      // Set up the interval for checking the user's profile
      return subscription.pipe(
        startWith(0),
        switchMap( async () => await this.orderModel.findOneBy({ id: orderId })),
        switchMap( async (order) => await order.transaction),
        switchMap( async (transaction) => ({ transaction_status: await this.pesapalService.transactionStatus(transaction.tracking_id,pesapal_auth.token), transaction}) ),
        switchMap( async ({transaction, transaction_status}) => {
          try{
            // If the transaction is paid, update the order status
            if( transaction_status.status_code === 1 ){

              // Update the transaction status in the database
              await this.transactionModel.update(transaction.id,{
                confirmation_code: transaction_status.confirmation_code,
                payment_method:    transaction_status.payment_method,
                status:            transaction_status.status,
                status_code:       transaction_status.status_code,
              });
              await this.orderModel.updateOne(transaction.order_id,{ status: 'paid' }); 

              // Create an instance of OrderPaidEvent
              let orderPaidEvent = new OrderPaidEvent();
              orderPaidEvent.id  = transaction.order_id;

              // Emit the order paid
              this.eventEmitter.emit('order.paid', orderPaidEvent);

            }

            // Retrieve the updated transaction  
            res.write(`data: ${JSON.stringify({ transaction, transaction_status })}\nretry: ${10000}\n\n`);
          } catch(error) {                
            res.write(`data: ${JSON.stringify({})} retry: ${20000}\n\n`);   
          }
        }),
      )
  }  


  /**
   * Process pesapal transaction for an order.
   *
   * @param {string} orderId - The ID of the order.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>} Promise that resolves with a JSON response containing the redirect URL and order ID.
   */
  @UseGuards(OptionalGuard)
  @Put(':order/transaction')
  async transaction(
    @Param('order') orderId: string,
    @Req()          req: Request, 
    @Res()          res: Response
  ) {
    
    try{
      
      let { pesapal:{ live } } = json.readJSON(`${this.home}${sep}config.json`);

      // Find the order
      let order            = await this.orderModel.findOneBy({ id: orderId }); 

      // Get the user associated with the order
      let user             = await order.user; 

      // Order items amount
      let totalAmount: any = order.items.map( item => item.price * item.quantity );

      // Calculate the order total amount
      totalAmount  = sum(
        totalAmount.concat(
          !isEmpty(user.company.service_fees) ? 
            user.company.service_fees.map( fee => fee.type == 'percentage' ? ((fee.amount*sum(totalAmount))/100) : sum(totalAmount.concat(fee.amount))  ) :
              []
        )
      )
      
      // Process pesapal transaction
      let { token } = await this.pesapalService.auth();

      // Register the IPN (Instant Payment Notification) for the order
      let pesapal_ipn  = await this.pesapalService.registerIPN({
        url: `${this.configService.get<string>('app.APP_URL')}/order/${order.id}/complete`,
        ipn_notification_type: 'GET'
      },token);

      // Create the pesapal order
      let pesapal_order = await this.pesapalService.order({
        id:              order.id,
        currency:        user.currency,
        amount:          live ? totalAmount : 1,
        description:     `Customer ${user.first_name} ${user.last_name} is paying for ${order.items.length}. The total amount is ${totalAmount.toFixed(2)}.`,
        callback_url:    `${this.configService.get<string>('app.APP_URL')}/checkout/${order.id}/complete`,
        notification_id: pesapal_ipn.ipn_id,
        billing_address: {
          first_name:   user.first_name,
          last_name:    user.last_name,
          phone_number: user.phone_number,
          email:        user.email
        }
      },token);

      // Create the order transaction
      let transaction = await this.transactionModel.save({
        amount:      totalAmount,
        tracking_id: pesapal_order.order_tracking_id,
        order_id:    order.id
      });

      // Return the redirect URL and order ID in the response
      return res.status(HttpStatus.OK).json({ redirect_url: pesapal_order.redirect_url, order_id: orderId, transaction_id: transaction.id });      

    } catch(error){

      if( error instanceof PesapalServiceException ){
        let applicationRef = get(error,'applicationRef');
        return res.status(applicationRef.status).json({ message: applicationRef.message });
      }
      
      // If an error occurs, log the error and return an HTTP 500 status
      throw new HttpException(error.message,error.status);
    
    }
  }

}
