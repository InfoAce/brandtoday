import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Logger, Param, ParseIntPipe, Post, Put, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { get, pick, set, sum } from 'lodash';
import * as bcrypt from 'bcrypt';
import { AdminGuard, ClientGuard, OptionalGuard } from 'src/guards';
import { AddressBookModel, CompanyModel, OrderModel, RoleModel, TransactionModel, UserModel } from 'src/models';
import { CreateOrderValidation } from 'src/validation';
import { MailService } from 'src/services';
import { PesapalService } from 'src/services/pesapal/pesapal.service';
import { stat } from 'fs';
import { PesapalServiceException } from 'src/exceptions/pesapal.exception';
import { OrderRepository } from 'src/repositories';
import { OrderEntity } from 'src/entities';
import { Between, IsNull, Not } from 'typeorm';
import * as moment from 'moment';

@Controller('dashboard/overview')
export class OverviewController {

  private readonly logger = new Logger(OverviewController.name);

  constructor(
    private orderModel: OrderModel,
    private transactionModel: TransactionModel,
    private userModel: UserModel,
  ){}

  @UseGuards(AdminGuard)
  @Get('')
  async index(
    @Req() req: Request,  
    @Res() res: Response
  ) {

    try{

      let startdate          = moment();
      let enddate            = moment().subtract(1,'year');

      let clients            = await this.userModel.count({ where: { role: { name: 'client' } } });
      let staff              = await this.userModel.count({ where: { role: { name: 'staff' } } });
      let orders             = await this.orderModel.count();
      let pending_orders     = await this.orderModel.count({ where: { status: 'pending' } });
      let revenue_received   = await this.transactionModel.sum('amount', { confirmation_code: Not(IsNull()) });
      let revenue_pending    = await this.transactionModel.sum('amount', { confirmation_code: IsNull() });
      // let order_distribution = await this.orderModel.createQueryBuilder('orders')
      //                                    .select('orders.status, orders.created_at, COUNT(orders.id) as count')
      //                                    .where({ created_at: Between(enddate.format('YYYY-MM'),startdate.format('YYYY-MM')) })
      //                                    .groupBy('orders.status')
      //                                    .getMany()

      // console.log(order_distribution)
      return res.status(HttpStatus.OK).json({ 
        summary: { clients, staff, orders, pending_orders, revenue_received, revenue_pending}, 
      });

    } catch (error) {

      this.logger.error(error);
      
      res.status(error.status).json({orders: {} });

    }

  }   

}
