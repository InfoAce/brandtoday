import { Body, Controller, Get, HttpStatus, Inject, Injectable, Logger, Param, Post, Put, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, OptionalGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { cloneDeep, intersectionBy, isEmpty, first, has, get, omit, shuffle } from 'lodash';
import { paginate } from "src/helpers";
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { FavouriteModel } from 'src/models';
import { sep } from 'path';

@Controller('products')
export class ProductsController {

    private amrod = {
      categories: [],
      products:   [],
      prices:     [],
      stock:      []
    };

    private readonly file_paths = {
      categories: `${process.cwd()}${sep}public${sep}amrod${sep}categories.json`,
      products:   `${process.cwd()}${sep}public${sep}amrod${sep}products.json`,
      prices:     `${process.cwd()}${sep}public${sep}amrod${sep}prices.json`,
      stock:      `${process.cwd()}${sep}public${sep}amrod${sep}stock.json`,
    };

    private jsonPlugin      = require('json-reader-writer');

    private logger          = new Logger(ProductsController.name);

    /**
     * Class constructor
     * @param amrodService - The instance of AmrodService
     * @param favouriteModel - The instance of FavouriteModel
     * @param cacheManager - The instance of CacheManager
     */
    constructor(
      private amrodService:   AmrodService,
      private favouriteModel: FavouriteModel,
      @Inject(CACHE_MANAGER) 
      private cacheManager: Cache,
    ){
      // Try to read JSON files and assign them to the 'amrod' object
      try {
        // Read categories JSON file
        this.amrod.categories = this.jsonPlugin.readJSON(this.file_paths.categories);
        // Read products JSON file
        this.amrod.products   = this.jsonPlugin.readJSON(this.file_paths.products);
        // Read prices JSON file
        this.amrod.prices     = this.jsonPlugin.readJSON(this.file_paths.prices);
        // Read stock JSON file
        this.amrod.stock      = this.jsonPlugin.readJSON(this.file_paths.stock);
      } catch(error){
        // If any error occurred during reading JSON files, clear 'amrod' object
        this.amrod.categories = [];
        this.amrod.products   = [];
        this.amrod.prices     = [];
        this.amrod.stock      = [];
      }
    }

    @Get('')
    async index(
      @Query('category') queryCategory: string,
      @Query('sub_category') querySubCategory: string,
      @Query('sub_child_category') querySubChildCategory: string,
      @Req() req: Request,  
      @Res() res: Response
    ) {
      try {  
        let cached_products: any = cloneDeep(this.amrod.products);
        let cached_prices:   any = cloneDeep(this.amrod.prices);
        let category:        any = Object();

        if( !isEmpty(queryCategory) ){
          category             = this.amrod.categories.find( category => category.categoryPath == atob(queryCategory) );
          cached_products      = cached_products.filter( product => product.categories.find( category => category.path.includes(atob(queryCategory))) );
        }

        if( !isEmpty(querySubCategory) ){
          cached_products = cached_products.filter( product => product.categories.find( category => category.path.includes(atob(querySubCategory))) );
        }

        if( !isEmpty(querySubChildCategory) ){
          cached_products = cached_products.filter( product => product.categories.find( category => category.path.includes(atob(querySubChildCategory))) );
        }
        
        switch(!isEmpty(req.query) && has(req.query,'page')){
          case true:
            cached_products  = paginate(cached_products,{ page: req.query.page, perPage: req.query.perPage });
          break;
          case false:
            cached_products  = paginate(cached_products);
          break;
        }

        cached_products.data = cached_products.data.map( product => {
          let data_price = cached_prices.find( val => product.simpleCode.includes(val.simplecode) );
          if( data_price != undefined ){ product.price = data_price.price; }
          return product;
        }); 
        
        res.status(HttpStatus.OK).json({ products: cached_products, category });
         
      } catch(error){

        this.logger.error(error);

      }
    }  

    @UseGuards(OptionalGuard)
    @Put(':code')
    /**
     * Show a product by its code.
     *
     * @param {string} code - The code of the product.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>}
     */
    async show(
      @Param('code') code: any, // The code of the product
      @Req() req: Request,  // The request object
      @Res() res: Response // The response object
    ) {
      try {

        // Get the user from the request object
        let user: any = get(req,'user');
        
        // Clone the cached products and prices
        let cached_products: any = cloneDeep(this.amrod.products);
        let cached_prices: any   = cloneDeep(this.amrod.prices);
        
        // Find the product with the given code
        let product: any    = cached_products.find( product => product.fullCode == code );

        // Find the price data for the given code
        let data_price: any = cached_prices.find( price => price.fullCode.includes(code) );

        let related_products: any = product.categories.map( 
                                                        category => cached_products.find( 
                                                          item => item.categories.find( val => {
                                                            let subject = category.path.split('/');

                                                            if( subject.lenght == 1 || subject.length == 2 ){
                                                              return val.path.includes(subject[0]);
                                                            }

                                                            subject.splice(subject.length - 1)
                                                            return val.path.includes(subject.join('/'));

                                                          }) 
                                                        )
                                                      )
                                                      .filter( item => item.fullCode != product.fullCode )
                                                      .map( item => { 
                                                        let price = cached_prices.find( price => price.fullCode.includes(item.fullCode) );
                                                        return { ...item, price: price.price };
                                                      });
        
        // Initialize the favourite object
        let favourite: any = {};

        // If a user is logged in, find their favourite with the given product code
        if( user ) {
          favourite = (await user.favourites).find( val => val.content.code == product.fullCode );
        }

        // If price data is found, set the product price
        if( data_price != undefined ){ product.price = data_price.price; }

        // Send the product and favourite as a JSON response with a status code of 200 (OK)
        res.status(HttpStatus.OK).json({ product, favourite, related_products });

      } catch(error){

        // Log any errors that occur
        this.logger.error(error);

      }
    }

    @Put('stock/:code')
    /**
     * Fetch the stock of a product by its code.
     *
     * @param {string} code - The code of the product.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>}
     */
    async fetchSize(@Param('code') code: any, @Req() req: Request,  @Res() res: Response) {
      try {
        
        // Clone the cached stocks to avoid modifying the original data.
        let cached_stocks: any = cloneDeep(this.amrod.stock);
        
        // Search for the product in the cached stocks.
        let stock: any = cached_stocks.find(val => val.fullCode == code);

        // If the product is not found in the stocks, set the stock to 0.
        if (stock == undefined) {
          stock = { stock: 0 };
        }

        // Send the stock as a JSON response with a status code of 200 (OK).
        res.status(HttpStatus.OK).json({ stock, code });

      } catch (error) {
        // Log any errors that occur.
        this.logger.error(error);
      }
    }
}
