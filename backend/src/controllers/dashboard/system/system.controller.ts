import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AuthService, MailService } from 'src/services';
import { RegisterValidation } from 'src/validation';
import { CompanyModel, RoleModel, UserModel } from 'src/models';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { isEmpty, isNull } from 'lodash';
import { sep } from 'path';

@Controller('dashboard/system')
export class SystemController {

    private readonly file_path = `${process.cwd()}${sep}configurations.json`;

    private jsonPlugin = require('json-reader-writer');

    constructor(

    ){}

    @UseGuards(AdminGuard)
    @Get('')
    getConfigurations(@Req() req: Request,  @Res() res: Response) {
        try{
            return res.status(HttpStatus.OK).json({ configurations: this.jsonPlugin.readJSON(this.file_path) });
        } catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @UseGuards(AdminGuard)
    @Post('configurations')
    updateConfigurations(@Body() body: any, @Req() req: Request,  @Res() res: Response) {
        try{
            const fs = require('fs');
            fs.writeFileSync(this.file_path,JSON.stringify(body));
            return res.status(HttpStatus.OK).json({ configurations: this.jsonPlugin.readJSON(this.file_path) });
        } catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(AdminGuard)
    @Post('logout')
    async logout(@Req() req: Request,  @Res() res: Response) {
        res.status(HttpStatus.OK).json(req);
    }    

}
