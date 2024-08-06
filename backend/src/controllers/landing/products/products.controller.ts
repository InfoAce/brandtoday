import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Inject, Injectable, Logger, Param, Post, Put, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, OptionalGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { cloneDeep, intersectionBy, isEmpty, isNull, first, has, get, omit, shuffle, sortBy, take, uniqBy } from 'lodash';
import { paginate } from "src/helpers";
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CategoryModel, FavouriteModel, PriceModel, ProductCategoryModel, SubCategoryModel } from 'src/models';
import { sep } from 'path';
import { ILike } from 'typeorm';
import { ConfigService } from '@nestjs/config';

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

    private colors          = Object();

    private jsonPlugin      = require('json-reader-writer');

    private logger          = new Logger(ProductsController.name);

    /**
     * Class constructor
     * @param amrodService - The instance of AmrodService
     * @param favouriteModel - The instance of FavouriteModel
     * @param cacheManager - The instance of CacheManager
     */
    constructor(
      private categoryModel:         CategoryModel,
      private configService:         ConfigService,
      private priceModel:            PriceModel,
      private productCategoryModel:  ProductCategoryModel,
      private subCategoryModel:      SubCategoryModel
    ){

      this.colors = this.configService.get<any>('colors');
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

    @Get(':category/:sub_category')
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
      @Param('category',new DefaultValuePipe(String())) category: any,
      @Param('sub_category',new DefaultValuePipe(String())) sub_category: any,
      @Query('page',new DefaultValuePipe(1)) queryPage: number,
      @Query('perPage',new DefaultValuePipe(10)) queryPerPage: number,
      @Query('sort_pricing',new DefaultValuePipe(String('descending'))) querySortPricing: string,
      @Req() req: Request,  
      @Res() res: Response
    ) {
      try {  

        // Find the category based on the provided category id
        category = await this.categoryModel.findOne({ where: { id: category } });

        // Find the sub category based on the provided sub category id
        sub_category = await this.subCategoryModel.findOne({ where: { id: sub_category } });

        // Define the where clause for filtering products based on category, sub category, and name (if provided)
        let where: object = { category_id: category.id, sub_category_id: sub_category.id };
        if (!isEmpty(queryName)) {
          where = { ...where, name: ILike(`%${queryName}%`) };
        }

        // Fetch products categories based on the where clause
        let [products_categories, count ]: any = await this.productCategoryModel.findCount({ where, take: queryPerPage, skip: queryPage });

        // List products fetched
        let products: any = await Promise.all(
          products_categories.map(async (product_category) => {
            // Fetch the product for each product category
            let product = await product_category.product;

            try {
            } catch(error){
              product.price = { amount: 0 };
            }

            // If the product has colour images, add the hex code to each colour image
            if (!isNull(product.colour_images)) {
              product.colour_images = product.colour_images.map((color) => ({
                ...color,
                hex: this.colors[color.code].colour,
              }));
            }

            product.variants = await Promise.all(product.variants.map( async variant => ({ ...variant, price: await this.priceModel.findOne({ where: { full_code: ILike(`%${variant.fullCode}%`) } }) }) ));

            return product;
          })
        );

        // Send the products, category, and sub categories as a JSON response
        res.status(HttpStatus.OK).json({ products, category, sub_category, products_count: count });
        
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
