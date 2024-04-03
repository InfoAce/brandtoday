import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { get, set } from 'lodash';
import { AddressValidation } from 'src/validation';
import { AddressBookModel } from 'src/models';


@Controller('addresses')
export class AddressBookController {

    constructor(
        private addressBookModel: AddressBookModel
    ){}

    @UseGuards(AuthGuard)
    @Get('')
    async index(
      @Req() req: Request,  
      @Res() res: Response
    ) {

      try {
        
        let user      = get(req,'user');
        let addresses = await user.address_book;

        return res.status(HttpStatus.OK).json({ addresses });

      } catch(err) {

      }

    }   
    
    @UseGuards(AuthGuard)
    @Post('')
    async store(
        @Body() body: AddressValidation,
        @Req()  req:  Request,
        @Res()  res:  Response
    ) {

      try {
        
        let user    = get(req,'user');
        let address = await this.addressBookModel.save(set(body,'user_id',user.id));

        return res.status(HttpStatus.OK).json({ address });

      } catch(err) {

      }

    } 
}
