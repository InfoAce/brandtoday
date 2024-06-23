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

@Controller('dashboard/overview')
export class OverviewController {

  private readonly logger = new Logger(OverviewController.name);

  constructor(
    private userModel: UserModel
  ){}

  @UseGuards(AdminGuard)
  @Get('')
  async index(
    @Req() req: Request,  
    @Res() res: Response
  ) {

    try{

      let [ clients, clientsCount ] = await this.userModel.findAndCount({ role: { name: 'client' } });
      let [ staff,   staffCount   ] = await this.userModel.findAndCount({ role: { name: '' } });

      return res.status(HttpStatus.OK).json({ 
        summary: { clients: clientsCount, staff: staffCount } 
      });

    } catch (error) {

      this.logger.error(error);
      
      res.status(error.status).json({orders: {} });

    }

  }   

}
