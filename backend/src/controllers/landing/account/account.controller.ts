import { Body, Controller, Get, HttpStatus, Inject, Injectable, Post, Render, Req, Res, Session, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { get, isNull, pick } from 'lodash';
import { LoggedInGuard } from 'src/guards';


@Controller('account')
export class AccountController {

    @UseGuards(LoggedInGuard)
    @Get('')
    async index(@Req() req: Request,  @Res() res: Response) {
      return res.render(
        'pages/account',
        {
          csrf: get(req,'csrfToken')()
        }
      )
    } 

}
