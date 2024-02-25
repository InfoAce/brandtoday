import { Body, Controller, Get, HttpStatus, Inject, Injectable, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { Csrf } from "ncsrf";
import { get } from 'lodash';

@Controller('login')
export class LoginController {

    constructor(
        private amrodService: AmrodService,
    ){}


    @Get('')
    @Render('pages/login')
    async index(@Req() req: Request,  @Res() res: Response) {
      console.log(get(req,'csrf-token'))
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
