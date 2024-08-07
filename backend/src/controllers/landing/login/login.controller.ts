import { Body, Controller, Get, HttpStatus, Inject, Injectable, Post, Render, Req, Res, Session, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { get, has } from 'lodash';
import { LocalAuthGuard } from 'src/guards';

@Controller('login')
export class LoginController {

    @Get('')
    async index(@Req() req: Request,  @Res() res: Response) {
      return res.render(
        'pages/login',
        {
          csrf: get(req,'csrfToken')()
        }
      )
    } 
    
    @UseGuards(LocalAuthGuard)
    @Post('auth')
    async auth(@Session() session: any, @Body() body: any, @Req() req: Request,  @Res() res: Response) {   
      return req.session;
    } 

}
