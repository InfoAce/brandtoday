import { Body, Controller, DefaultValuePipe, Get, HttpStatus, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/guards';
import { Request, Response } from 'express';
import { CompanyModel, FavouriteModel, UserModel } from 'src/models';
import { get } from 'lodash';
import { EntityNotFoundError } from 'typeorm';

@Controller('api/favourites')
export class FavouriteController {

    constructor(
        private readonly favouriteModel: FavouriteModel
    ){}

    @UseGuards(AuthGuard)
    @Get('')
    async get(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @Req() req: Request,  
        @Res() res: Response
    ) {
        try {

            let user       = get(req,'user');
            let favourites = await this.favouriteModel.find({ user_id: user.id });

            return res.status(HttpStatus.OK).json({ favourites });

        } catch(err){
            
            if( err.constructor.name == "EntityNotFoundError" ){
                throw new NotFoundException();
            }
            
            console.log(err);
            throw new InternalServerErrorException();
        }
    }
}
