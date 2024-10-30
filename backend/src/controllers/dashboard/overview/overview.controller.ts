import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Logger, Param, ParseIntPipe, Post, Put, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { get, groupBy, map, pick, set, sum } from 'lodash';
import * as bcrypt from 'bcrypt';
import { AdminGuard, ClientGuard, OptionalGuard } from 'src/guards';
import { AddressBookModel, CategoryModel, CompanyModel, OrderModel, PriceModel, ProductModel, ProductVariantModel, RoleModel, TransactionModel, UserModel } from 'src/models';
import { Between, IsNull, Not } from 'typeorm';
import * as moment from 'moment';

@Controller('dashboard/overview')
export class OverviewController {

  private readonly logger = new Logger(OverviewController.name);

  constructor(
    private categoryModel:       CategoryModel,
    private orderModel:          OrderModel,
    private productModel:        ProductModel,
    private productVariantModel: ProductVariantModel,
    private priceModel:          PriceModel,
    private transactionModel:    TransactionModel,
    private userModel:           UserModel,
  ){}

  @UseGuards(AdminGuard)
  @Get('')
  async index(
    @Req() req: Request,  
    @Res() res: Response
  ) {

    try{

      let startdate          = moment().add(1,'day');
      let enddate            = moment().subtract(11,'month');
      let clients            = await this.userModel.count({ where: { role: { name: 'client' } } });
      let staff              = await this.userModel.count({ where: { role: { name: 'staff' } } });
      let orders             = await this.orderModel.count();
      let pending_orders     = await this.orderModel.count({ where: { status: 'pending' } });
      let revenue_received   = ( await this.transactionModel.sum('amount', { confirmation_code: Not(IsNull()) }) ) || 0;
      let revenue_pending    = ( await this.transactionModel.sum('amount', { confirmation_code: IsNull() }) ) || 0;
      let order_distribution = await this.orderModel.createQueryBuilder('orders')
                                         .select(`orders.status, orders.created_at, DATE_FORMAT(orders.created_at,'%Y-%m') as date, COUNT(orders.id) as count`)
                                         .where({ created_at: Between(enddate.format('YYYY-MM-DD'), startdate.format('YYYY-MM-DD')) })
                                         .groupBy('YEAR(orders.created_at),MONTH(orders.created_at),orders.status')
                                         .getRawMany()

      let categories         = await this.categoryModel.count();
      let products           = await this.productModel.count();
      let product_variants   = await this.productVariantModel.count();
      let prices             = await this.priceModel.count();
      
      return res.status(HttpStatus.OK).json({ 
        amrod:{
          categories,
          products,
          product_variants,
          prices
        },
        order_distribution,
        summary: { 
          clients, 
          staff, 
          orders, 
          pending_orders, 
          revenue_received,
          revenue_pending 
        }, 
      });

    } catch (error) {

      this.logger.error(error);
      
      res.status(error.status).json({orders: {} });

    }

  }   

}
