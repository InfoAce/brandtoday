import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Inject, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/guards';
import { Request, Response } from 'express';
import { FavouriteModel } from 'src/models';
import { get, set } from 'lodash';
import { WishlistValidation } from 'src/validation';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { paginate } from "src/helpers";

@Controller('favourites')
export class FavouriteController {

    constructor(
        private readonly favouriteModel: FavouriteModel,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

            let user: any       = get(req,'user');
            let products: any   = await this.cacheManager.get('amrod_products');
            let favourites: any = paginate(
                (await user.favourites).map( val => ({ product: products.find( product => product.fullCode == val.content.code ), ...val }) ),
                { page: page, perPage: limit }
            );

            return res.status(HttpStatus.OK).json({ favourites });

        } catch(err){
            
            if( err.constructor.name == "EntityNotFoundError" ){
                throw new NotFoundException();
            }
            
            throw new InternalServerErrorException();
        }
    }

    @UseGuards(AuthGuard)
    @Post('')
    async store(
        @Body() body: WishlistValidation,
        @Req()  req: Request,  
        @Res()  res: Response
    ){

        try {
            let user      = get(req,'user');
            let favourite = await this.favouriteModel.save(set(body,'user_id',user.id));

            return res.status(HttpStatus.OK).json({ favourite });
        
        } catch (err) {

        }

    }
}
