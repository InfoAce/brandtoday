import { Body, Controller, Get, HttpStatus, Inject, Injectable, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';

@Controller('header')
export class HeaderController {

    constructor(
        private amrodService: AmrodService,
    ){}

    @Get('')
    async index(@Req() req: Request,  @Res() res: Response) {
 
      try {
        const categories = await this.amrodService.getCategories();

        return res.status(HttpStatus.OK).json({ categories });
      
      } catch(err){

      }

    }   

}
