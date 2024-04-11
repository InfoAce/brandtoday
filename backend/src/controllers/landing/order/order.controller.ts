import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards';
import { OrderModel } from 'src/models';
import { CreateOrderValidation } from 'src/validation';
import { get, set } from 'lodash';

@Controller('orders')
export class OrderController {

    constructor(
        private orderModel: OrderModel
    ){}

    @UseGuards(AuthGuard)
    @Get('')
    async index(@Req() req: Request,  @Res() res: Response) {

    } 

    @UseGuards(AuthGuard)
    @Post('')
    async store( 
        @Body() body: CreateOrderValidation,
        @Req()  req: Request,  
        @Res()  res: Response
    ) {   
        try{

            let user  = get(req,'user');
            let order = await this.orderModel.save(set(body,'user_id',user.id));

            console.log(body);
        } catch(err) {

        }
    } 

}
