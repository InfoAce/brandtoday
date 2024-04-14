import { Body, Controller, Get, HttpStatus, Param, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { get, pick, set, sum } from 'lodash';
import * as bcrypt from 'bcrypt';
import { OptionalGuard } from 'src/guards';
import { CompanyModel, OrderModel, RoleModel, UserModel } from 'src/models';
import { CreateOrderValidation } from 'src/validation';
import { MailService } from 'src/services';
import { PesapalService } from 'src/services/pesapal/pesapal.service';

@Controller('orders')
export class OrderController {

  constructor(
    private companyModel:  CompanyModel,
    private configService: ConfigService,
    private roleModel:     RoleModel,
    private mailService:   MailService,
    private orderModel:    OrderModel,
    private pesapalService: PesapalService,
    private userModel:     UserModel
  ){}

  @Get('')
  async index(@Req() req: Request,  @Res() res: Response) {
    return res.status(HttpStatus.OK).json({});
  }   

  @UseGuards(OptionalGuard)
  @Post('')
  async store(
    @Body() form: CreateOrderValidation,
    @Req()  req:  Request, 
    @Res()  res:  Response
  ) {
    
    try{
      let totalAmount = sum(form.items.map( item => item.price * item.quantity ));
      if( form.type == "new"){
        let randomstring      = require("randomstring");
        let { id: companyId } = await this.companyModel.first();
        let { id: roleId }    = await this.roleModel.findOneBy({ name: 'client'});

        form.password      = await bcrypt.hash(form.password, parseInt(this.configService.get('SALT_LENGTH')));
        form['token']      = randomstring.generate(100);
        form['company_id'] = companyId;
        form['role_id']    = roleId;
        delete form.confirm_password;

        let user = await this.userModel.save(pick(form,['first_name','last_name','email','phone_number','password','token','company_id','role_id']));
        await this.mailService.sendUserConfirmation(user);

        let order = await this.orderModel.save(pick(form,[]));

        let pesapal_auth = await this.pesapalService.auth();
        let pesapal_ipn  = await this.pesapalService.registerIPN({
          url: `${this.configService.get<string>('app.APP_URL')}/api/v1/orders/${order.id}/status`,
          ipn_notification_type: 'GET'
        },pesapal_auth.token);
        let pesapal_order = await this.pesapalService.order({
          id:              order.id,
          currency:        form.currency,
          // amount:          totalAmount,
          amount:          1.00,
          description:     `User ${user.email} is paying for ${form.items.length}. The total amount is ${totalAmount}.`,
          callback_url:    `${this.configService.get<string>('app.APP_URL')}/checkout/${order.id}/complete`,
          notification_id: pesapal_ipn.ipn_id,
          billing_address: {
            first_name:   user.first_name,
            last_name:    user.last_name,
            phone_number: user.phone_number,
            email:        user.email
          }
        },pesapal_auth.token);
      }

      if( form.type == "existing"){
        let user         = get(req,'user');
        let order        = await this.orderModel.save(pick(form,['address_id','items']));
        let pesapal_auth = await this.pesapalService.auth();
        let pesapal_ipn  = await this.pesapalService.registerIPN({
          url: `${this.configService.get<string>('app.APP_URL')}/api/v1/orders/${order.id}/status`,
          ipn_notification_type: 'GET'
        },pesapal_auth.token);
        let pesapal_order = await this.pesapalService.order({
          id:              order.id,
          currency:        form.currency,
          // amount:          totalAmount,
          amount:          1.00,
          description:     `User ${user.email} is paying for ${form.items.length}. The total amount is ${totalAmount}.`,
          callback_url:    `${this.configService.get<string>('app.APP_URL')}/checkout/${order.id}/complete`,
          notification_id: pesapal_ipn.ipn_id,
          billing_address: {
            first_name:   user.first_name,
            last_name:    user.last_name,
            phone_number: user.phone_number,
            email:        user.email
          }
        },pesapal_auth.token);
      }
      // let user  = get(req,'user');
      // let order = await this.orderModel.save(set(body,'user_id',user.id));
      return res.status(HttpStatus.OK).json({});
    } catch(err) {

    }

  } 

  @Get(':order/status')
  async status(
    @Param('order') order: string,
    @Req() req: Request, 
    @Res() res: Response
  ) {
    return res.status(HttpStatus.OK).json({});
  }   
}
