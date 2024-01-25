import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards';
import { Request, Response } from 'express';
import { AuthService, MailService } from 'src/services';
import { RegisterValidation } from 'src/validation';
import { CompanyModel, RoleModel, UserModel } from 'src/models';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { isEmpty, isNull } from 'lodash';

@Controller('system')
export class SystemController {

    constructor(

    ){}

    @UseGuards(AuthGuard)
    @Get('')
    getProfile(@Body() body: any, @Req() req: Request,  @Res() res: Response) {
        const {readJSON, writeJson} = require('json-reader-writer');
        console.log(body);
        // writeJson(filePath, obj)
        res.status(HttpStatus.OK).json(req['user']);
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Req() req: Request,  @Res() res: Response) {
        res.status(HttpStatus.OK).json(req);
    }    

}
