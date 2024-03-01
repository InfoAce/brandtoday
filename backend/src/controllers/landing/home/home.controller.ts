import { Body, Controller, Get, HttpStatus, Inject, Injectable, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';

@Controller('')
export class HomeController {

    constructor(
        private amrodService: AmrodService,
    ){}


    @Get('')
    async root(@Req() req: Request,  @Res() res: Response) {
      res.render('pages/home');
    }   

}
