import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Inject, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientGuard } from 'src/guards';
import { Request, Response } from 'express';
import { FavouriteModel } from 'src/models';
import { cloneDeep, get, set } from 'lodash';
import { WishlistValidation } from 'src/validation';
import { paginate } from "src/helpers";
import { sep } from 'path';

@Controller('favourites')
export class FavouriteController {

    private amrod = {
        products:   [],
    };

    private readonly file_paths = {
        products:   `${process.cwd()}${sep}public${sep}amrod${sep}products.json`,
    };

    private jsonPlugin      = require('json-reader-writer');

    constructor(
        private readonly favouriteModel: FavouriteModel,
    ){
      // Try to read JSON files and assign them to the 'amrod' object
      try {        
            // Read products JSON file
            this.amrod.products   = this.jsonPlugin.readJSON(this.file_paths.products);
        } catch(error){
            // If any error occurred during reading JSON files, clear 'amrod' object
            this.amrod.products   = [];
        }
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
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @Req() req: Request,  
        @Res() res: Response
    ) {
        try {
            // Get the authenticated user from the request
            let user: any = get(req,'user');

            // Get the cached list of products
            let products: any = cloneDeep(this.amrod.products);;

            // Get the list of favourite items for the authenticated user
            let favourites    = await user.favourites;

            // Map the favourite items to include the product details and paginate the results
            favourites = paginate(
                favourites.map( val => ({ 
                    product: products.find( product => product.fullCode == val.content.code ), 
                    ...val 
                }) ),
                { page: page, perPage: limit }
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
    @Post('')    
    async store(
        @Body() body: WishlistValidation, // The wishlist validation object
        @Req()  req: Request,  // The Express request object
        @Res()  res: Response // The Express response object
    ){

        try {
            // Get the authenticated user
            let user = get(req,'user');

            // Save the new favourite item with the user ID set
            let favourite = await this.favouriteModel.save(set(body,'user_id',user.id));

            // Return the newly created favourite item as a JSON response with a 200 status code
            return res.status(HttpStatus.OK).json({ favourite });
        
        } catch (err) {
            // Handle any errors that occur during the operation
        }

    }
}
