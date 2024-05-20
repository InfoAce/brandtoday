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

@Controller('dashboard/orders')
export class DashboardOrderController {

  private readonly logger = new Logger(DashboardOrderController.name);

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

  @UseGuards(AdminGuard)
  @Get('')
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Req() req: Request,  
    @Res() res: Response
  ) {

    try{

      let orders = await this.orderModel.paginate({ page, limit });

      return res.status(HttpStatus.OK).json({orders});

    } catch (error) {

      this.logger.error(error);
      
      res.status(error.status).json({orders: {} });

    }

  }   


  /**
   * Fetch the order
   * 
   * @param Order
   * @returns {Promise<Order>}
   */
  @UseGuards(AdminGuard)
  @Put(':order/view')
  async show(
    @Param('order') orderId: string,
    @Req()          req: Request,  
    @Res()          res: Response
  ){

    try {

      let order  = await this.orderModel.findOne({ where: { id: orderId }, relations:[ 'user' ] });

      console.log(order.user);

      return res.status(HttpStatus.OK).json({ order });

    } catch(error) {

      this.logger.error(error);
      
      res.status(error.status).json({order: {} });
    }

  }

}
