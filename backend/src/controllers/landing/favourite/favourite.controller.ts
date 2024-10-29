import { Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Inject, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientGuard } from 'src/guards';
import { Request, Response } from 'express';
import { FavouriteModel } from 'src/models';
import { cloneDeep, get, set } from 'lodash';
import { WishlistValidation } from 'src/validation';
import { paginate } from "src/helpers";
import { sep } from 'path';
import { Config } from 'winston/lib/winston/config';
import { ConfigService } from '@nestjs/config';

@Controller('favourites')
export class FavouriteController {

    private colors = Object();

    constructor(
        private configService: ConfigService,
        private readonly favouriteModel: FavouriteModel,
    ){
        this.colors = this.configService.get<any>('colors');
    }

    /**
     * Get the paginated list of favourite products for the authenticated user.
     * 
     * @param page The page number of the results to retrieve. Defaults to 1.
     * @param limit The maximum number of results to retrieve per page. Defaults to 10.
     * @param req The request object.
     * @param res The response object to send the result to.
     * @returns A JSON response containing the paginated list of favourite products.
     * @throws NotFoundException If the authenticated user is not found.
     * @throws InternalServerErrorException If an error occurs while retrieving the favourite products.
     */
    @UseGuards(ClientGuard)
    @Get('')
    async get(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) queryPage: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) queryPerPage: number = 10,
        @Req() req: Request,  
        @Res() res: Response
    ) {
        try {
            // Get the authenticated user from the request
            let user: any = get(req,'user');

            // Get the list of favourite items for the authenticated user
            let favourites    = await this.favouriteModel.find({ where: { user_id: user.id }, skip: (queryPage - 1) * (queryPerPage + 1), take: queryPerPage,  });

            favourites = await Promise.all(
                cloneDeep(favourites).map( async favourite => {
                    favourite.product.colour_images = favourite.product.colour_images.map(
                        (color) => ({
                            ...color,
                            hex: this.colors[color.code].colour,
                        })
                    );
                    await favourite.product.variants;
                    return favourite;
                })
            );

            // Send the paginated list of favourite products as a JSON response
            return res.status(HttpStatus.OK).json({ favourites });

        } catch(error){
                
            // If the authenticated user is not found, throw a NotFoundException
            if( error.constructor.name == "EntityNotFoundError" ){
                throw new NotFoundException();
            }
            
            // If any other error occurs, throw an InternalServerErrorException
            throw new InternalServerErrorException();
        }
    }

    /**
     * Stores a new favourite item for the authenticated user.
     *
     * @param {WishlistValidation} body - The wishlist validation object.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>} Promise that resolves with a JSON response containing the stored favourite item.
     */
    @UseGuards(ClientGuard)
    @Put(':full_code')    
    async store(
        @Param('full_code',new DefaultValuePipe(String())) full_code: string,
        @Req()  req: Request,  // The Express request object
        @Res()  res: Response // The Express response object
    ){

        try {
            // Get the authenticated user
            let user = get(req,'user');

            // Save the new favourite item with the user ID set
            let favourite = await this.favouriteModel.save({user_id: user.id, full_code});

            // Return the newly created favourite item as a JSON response with a 200 status code
            return res.status(HttpStatus.OK).json({ favourite });
        
        } catch (error) {
          
            if( error.constructor.name == "ModelException" ){
                throw new HttpException(error.message, error.status);
            }
            
        }

    }
}
