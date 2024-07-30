import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Inject, Injectable, Logger, Param, Post, Put, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, OptionalGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { cloneDeep, intersectionBy, isEmpty, isNull, first, has, get, omit, shuffle, sortBy, take, uniqBy } from 'lodash';
import { paginate } from "src/helpers";
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { FavouriteModel } from 'src/models';
import { sep } from 'path';

@Controller('products')
export class ProductsController {

    private amrod = {
      brands:     [],
      categories: [],
      products:   [],
      prices:     [],
      stock:      []
    };

    private readonly file_paths = {
      brands:     `${process.cwd()}${sep}public${sep}amrod${sep}brands.json`,
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
        // Read brands JSON file
        this.amrod.brands      = this.jsonPlugin.readJSON(this.file_paths.brands);
      } catch(error){
        // If any error occurred during reading JSON files, clear 'amrod' object
        this.amrod.brands     = [];
        this.amrod.categories = [];
        this.amrod.products   = [];
        this.amrod.prices     = [];
        this.amrod.stock      = [];
      }
    }

    @Get('')
    /**
     * Index method to get products based on the query parameters.
     *
     * @param {string} queryName - The name of the product.
     * @param {string} queryCategory - The category of the product.
     * @param {string} querySubCategory - The sub category of the product.
     * @param {string} querySubChildCategory - The sub child category of the product.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>}
     */
    async index(
      @Query('name',new DefaultValuePipe(String())) queryName: string,
      @Query('category',new DefaultValuePipe(String())) queryCategory: string,
      @Query('sub_category',new DefaultValuePipe(String())) querySubCategory: string,
      @Query('sub_child_category',new DefaultValuePipe(String())) querySubChildCategory: string,
      @Query('page',new DefaultValuePipe(1)) queryPage: number,
      @Query('perPage',new DefaultValuePipe(10)) queryPerPage: number,
      @Query('sort_pricing',new DefaultValuePipe(String('descending'))) querySortPricing: string,
      @Req() req: Request,  
      @Res() res: Response
    ) {
      try {  
        // Clone the products and prices objects
        let cached_products:  any = cloneDeep(this.amrod.products);
        let cached_prices:    any = cloneDeep(this.amrod.prices);
        let cached_brands:    any = cloneDeep(this.amrod.brands);
        
        // Filter products based on name query
        if( !isEmpty(queryName) ){
          cached_products = cached_products.filter( product => product.productName.includes(queryName));
        }

        // Filter products based on category query
        if( !isEmpty(queryCategory) ){
          cached_products = cached_products.filter( product => product.categories.find( item => item.path.includes(queryCategory.toLowerCase())) );
        }
        
        // Filter products based on sub category query
        if( !isEmpty(querySubCategory) ){
          cached_products  = cached_products.filter( product => product.categories.find( category => category.path.includes(querySubCategory.toLowerCase())) );
        }

        // Filter products based on sub child category query
        if( !isEmpty(querySubChildCategory) ){
          cached_products = cached_products.filter( product => product.categories.find( category => category.path.includes(querySubChildCategory)) );
        }
        
        // Paginate the products based on the query parameters
        cached_products = paginate(cached_products,{ page: queryPage, perPage: queryPerPage });

        // Add price to the products
        cached_products.data = cached_products.data.map( product => {
          let data_price = cached_prices.find( val => product.simpleCode.includes(val.simplecode) );
          if( data_price != undefined ){ product.price = data_price.price; }
          return product;
        }); 

        cached_products.data = querySortPricing == 'descending' ?  cached_products.data.sort((a,b) => a.price - b.price) :  cached_products.data.sort( (a,b) => b.price - a.price );
        
        // Send the products, category, and sub categories as a JSON response
        res.status(HttpStatus.OK).json({ brands: cached_brands, products: cached_products });
        
      } catch(error){

        // Log the error
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
