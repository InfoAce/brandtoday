import { Body, Controller, Get, HttpStatus, Param, Post, Put, Render, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { get, pick, set, sum } from 'lodash';
import * as bcrypt from 'bcrypt';
import { ClientGuard, OptionalGuard } from 'src/guards';
import { AddressBookModel, CompanyModel, OrderModel, RoleModel, TransactionModel, UserModel } from 'src/models';
import { CreateOrderValidation } from 'src/validation';
import { MailService } from 'src/services';
import { PesapalService } from 'src/services/pesapal/pesapal.service';
import { stat } from 'fs';
import { PesapalServiceException } from 'src/exceptions/pesapal.exception';

@Controller('orders')
export class OrderController {

  constructor(
    private addressBookModel: AddressBookModel,
    private companyModel:     CompanyModel,
    private configService:    ConfigService,
    private roleModel:        RoleModel,
    private mailService:      MailService,
    private orderModel:       OrderModel,
    private transactionModel: TransactionModel,
    private pesapalService:   PesapalService,
    private userModel:        UserModel
  ){}

  @UseGuards(ClientGuard)
  @Get('')
  async index(@Req() req: Request,  @Res() res: Response) {

    try{
      let order 
      return res.status(HttpStatus.OK).json({});

    } catch (err) {

    }

  }   

  @UseGuards(OptionalGuard)
  @Post('')
  async store(
    @Body() form: CreateOrderValidation,
    @Req()  req:  Request, 
    @Res()  res:  Response
  ) {
    
    try{

      if( form.type == "new"){

        let randomstring      = require("randomstring");
        let { id: companyId } = await this.companyModel.first();
        let { id: roleId }    = await this.roleModel.findOneBy({ name: 'client'});

        form.password      = await bcrypt.hash(form.password, parseInt(this.configService.get('SALT_LENGTH')));
        form['token']      = randomstring.generate(100);
        form['company_id'] = companyId;
        form['role_id']    = roleId;
        delete form.confirm_password;

        let user    = await this.userModel.save(pick(form,['first_name','last_name','email','phone_number','password','token','company_id','role_id']));
        let address = await this.addressBookModel.save({ ...pick(form,['address_line_1','address_line_2','county_state','city_town','country','postal_code','category']),'user_id': user.id });
        let order   = await this.orderModel.save({ ...pick(form,['items']), user_id: user.id, address_id: address.id });
       
        await this.mailService.sendUserConfirmation(user);

        return res.status(HttpStatus.OK).json({ order });

      }

      if( form.type == "existing"){

        let user   = get(req,'user');
        let order  = await this.orderModel.save({ ...pick(form,['address_id','items']), user_id: user.id });

        return res.status(HttpStatus.OK).json({ order });
      }

    } catch(err) {

      if( err instanceof PesapalServiceException ){
        console.log(err.getStatus());
        // return res.status(HttpStatus.OK).json({ });
      }

    }

  } 

  @Get(':order/status')
  async status(
    @Param('order') orderId: string,
    @Req()          req: Request, 
    @Res()          res: Response
  ) {
    try {

      let order              = await this.orderModel.findOne({ id: orderId }); // find the order
      let transaction        = await order.transaction; // get the transaction

      // Get transaction status information
      let pesapal_auth       = await this.pesapalService.auth(); // pesapal authentication
      let transaction_status = await this.pesapalService.transactionStatus(transaction.tracking_id,pesapal_auth.token); // retrieve transaction status

      this.transactionModel.updateOne(transaction.id,{
          confirmation_code: transaction_status.confirmation_code,
          payment_method:    transaction_status.payment_method,
          status:            transaction_status.status,
          status_code:       transaction_status.status_code,
        }
      )
      
      if( transaction_status.status_code === 1 ){
        this.orderModel.updateOne(order.id,{ status: 'paid' });
      }
      
      transaction          = await order.transaction; // get the transaction

      return res.status(HttpStatus.OK).json({ transaction });     
    
    } catch(err){

    }
  }  

  @Put(':order/transaction')
  async transaction(
    @Param('order') orderId: string,
    @Req()          req: Request, 
    @Res()          res: Response
  ) {
    
    try{

      let order        = await this.orderModel.findOne({ id: orderId }); // find the order
      let totalAmount  = sum(order.items.map( item => item.price * item.quantity )); // order total amount
      let user         = await order.user; // get user
      
      // Process pesapal transaction
      this.pesapalService
          .auth()
          .then( async ({ token }) =>{

            try {

              let pesapal_ipn  = await this.pesapalService.registerIPN({
                url: `${this.configService.get<string>('app.APP_URL')}/api/v1/orders/${order.id}/status`,
                ipn_notification_type: 'GET'
              },token); // pesapal merchant instant payment notification
              
              let pesapal_order = await this.pesapalService.order({
                id:              order.id,
                currency:        user.currency,
                // amount:          totalAmount,
                amount:          1.00,
                description:     `User ${user.email} is paying for ${order.items.length}. The total amount is ${totalAmount}.`,
                callback_url:    `${this.configService.get<string>('app.APP_URL')}/checkout/${order.id}/complete`,
                notification_id: pesapal_ipn.ipn_id,
                billing_address: {
                  first_name:   user.first_name,
                  last_name:    user.last_name,
                  phone_number: user.phone_number,
                  email:        user.email
                }
              },token); // pesapal create order

              // Create order transaction
              this.transactionModel.save({
                ammount:     totalAmount,
                tracking_id: pesapal_order.order_tracking_id,
                order_id:    order.id
              });
        
              return res.status(HttpStatus.OK).json({ redirect_url: pesapal_order.redirect_url, order_id: orderId }); // http response status

            } catch (error) {

            }

          })

    } catch(err){
      
      console.log(err)
    
    }
  }
}
