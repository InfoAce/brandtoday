import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards';

@Controller('orders')
export class OrderController {

    @UseGuards(AuthGuard)
    @Get('')
    async index(@Req() req: Request,  @Res() res: Response) {

    } 

    @UseGuards(AuthGuard)
    @Post('')
    async store( 
        @Body() body: any,
        @Req() req: Request,  
        @Res() res: Response
    ) {   

    } 

}
