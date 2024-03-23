import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Injectable, ParseIntPipe, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard } from "src/guards";
import { RoleModel, UserModel } from "src/models";
import { get, has, set } from 'lodash';
import { StaffValidation } from "src/validation";
import { MailService } from "src/services";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import { QueryFailedError } from "typeorm";

@Injectable()
@Controller('users')
export class UserController {

    constructor(
        private userModel: UserModel,
        private configService: ConfigService,
        private mailService: MailService,
        private roleModel: RoleModel,
    ){}

    @UseGuards(AuthGuard)
    @Get('')
    async show(
        @Res() res: Response,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @Query('type', new DefaultValuePipe(String())) type: string = String(),
    ) {
        try{
            let users = await this.userModel.paginate({ page, limit},{ where: { role: { name: type } } });
            return res.status(HttpStatus.OK).json({users});
        } catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(AuthGuard)
    @Post('')
    async store(
        @Req() req: Request,
        @Body() staffUser: StaffValidation,
        @Res()  res: Response,
    ){
        try{

            let randomstring  = require("randomstring"),
            { id: roleId }    = await this.roleModel.findOneBy({ name: 'staff'}),
            { company: { id: companyId } } = get(req,'user'),
            genPassword       = await bcrypt.hash(randomstring.generate(10), parseInt(this.configService.get('SALT_LENGTH')));

            set(staffUser,'company_id',companyId);
            set(staffUser,'role_id',roleId);
            set(staffUser,'password',genPassword);
            set(staffUser,'token',randomstring.generate(100));

            let user = await this.userModel.save(staffUser);

            await this.mailService.sendStaffConfirmation(user);
            
            return res.status(HttpStatus.OK).json({});
            
        } catch(err) {

            if( has(err,'applicationRef') ){
                switch(err.applicationRef.constructor){
                    case QueryFailedError:
                        console.log(err);
                    break;
                }

            }

        }
    }

}