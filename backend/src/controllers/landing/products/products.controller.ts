import { Body, Controller, Get, HttpStatus, Inject, Injectable, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';

@Controller('products')
export class ProductsController {

    constructor(
        private amrodService: AmrodService,
    ){}


    @Get('')
    
    @Render('pages/products')
    async index(@Req() req: Request,  @Res() res: Response) {
      // try {
      //   // const categories = await this.amrodService.getCategories();

      //   // return res.status(HttpStatus.OK).json({ categories });
      //   return res.render(
      //     'pages/home',
      //     { 
      //       title: 'Home'
      //     },
      //     (err, html) => {
      //         // Here you have access to the generated HTML
      //         res.send(html)
      //     }
      //   );
      
      // } catch(err){

      // }

    }   

}
