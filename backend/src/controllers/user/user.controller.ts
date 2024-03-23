import { Controller, DefaultValuePipe, Get, HttpStatus, Injectable, ParseIntPipe, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard } from "src/guards";
import { UserModel } from "src/models";
import { has } from 'lodash';

@Injectable()
@Controller('users')
export class UserController {

    constructor(
        private userModel: UserModel
    ){}

    @UseGuards(AuthGuard)
    @Get('')
    async show(
        @Req() req: Request, 
        @Res() res: Response,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @Query('type', new DefaultValuePipe(String())) type: string = String(),
    ) {
        try{
            let clients = await this.userModel.paginate({ page, limit},{ where: { role: { name: type } } });
            return res.status(HttpStatus.OK).json({clients});
        } catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}