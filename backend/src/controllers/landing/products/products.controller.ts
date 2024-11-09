import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, Param, Post, Put, Query, Render, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard, ClientGuard, OptionalGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { cloneDeep, flatMap, intersectionBy, isEmpty, isNull, first, has, get, omit, shuffle, set, sortBy, take, toPlainObject, uniqBy, uniq } from 'lodash';
import { paginate } from "src/helpers";
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { BrandModel, CategoryModel, FavouriteModel, PriceModel, ProductCategoryModel, ProductModel, SubCategoryModel } from 'src/models';
import { sep } from 'path';
import { Any, Between, EntityNotFoundError, Equal, ILike, In, Like, Not, Or } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { PriceEntity, ProductEntity, ProductVariantEntity } from 'src/entities';
import { ModelException } from 'src/exceptions';
import { FetchProductsValidation } from 'src/validation';

@Controller('products')
export class ProductsController {

    private colors          = Object();

    private logger          = new Logger(ProductsController.name);

    /**
     * Class constructor
     * @param amrodService - The instance of AmrodService
     * @param favouriteModel - The instance of FavouriteModel
     * @param cacheManager - The instance of CacheManager
     */
    constructor(
      private brandModel:            BrandModel,
      private categoryModel:         CategoryModel,
      private configService:         ConfigService,
      private priceModel:            PriceModel,
      private productModel:          ProductModel,
      private productCategoryModel:  ProductCategoryModel,
      private subCategoryModel:      SubCategoryModel
    ){
      this.colors = this.configService.get<any>('colors');
    }

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
    @Put('')
    @UsePipes(new ValidationPipe({ transform: true }))
    async index(
      @Query('name',new DefaultValuePipe(String())) queryName: string,
      @Query('category_code',new DefaultValuePipe(String())) category_code: any,
      @Query('sub_category_code',new DefaultValuePipe(String())) sub_category_code: any,
      @Query('page',new DefaultValuePipe(1)) queryPage: string,
      @Query('perPage',new DefaultValuePipe(10)) queryPerPage: string,
      @Query('price_range',new DefaultValuePipe(String())) queryPriceRange: string,
      @Query('sort_pricing',new DefaultValuePipe(String('descending'))) querySortPricing: string,
      @Body() { brands, price }: FetchProductsValidation,
      @Req()  req:  Request,  
      @Res()  res:  Response
    ) {
      try {  
        let products       = Array();
        let products_count = Number();
        let filters        = Object();

        if( !isEmpty(category_code) && !isEmpty(sub_category_code) ){

          filters = cloneDeep({
            where: { category_code, sub_category_code, product: { price: Between(price[0],price[1])  } }, 
            order: { product: { price: querySortPricing.toUpperCase() } }, 
            skip:  (parseInt(queryPage) - 1) * (parseInt(queryPerPage)), 
            take:  parseInt(queryPerPage), 
            cache: true
          });

          if( !isEmpty(queryName) ){
            set(filters.where.product,'name',ILike(`%${queryName}%`));
          }

          if( !isEmpty(brands) ){
            set(filters.where.product,'brand',In(brands));
          }

          let [product_categories, count ] = await this.productCategoryModel.findAndCount(filters);

          products_count                   = count;
          products                         = cloneDeep(product_categories).map( (category) => category.product );
        
        }

        // if( !isEmpty(queryName) ){
        //   [products, products_count] = await this.productModel.findAndCount({ where: [ { name: Like(`%${queryName}%` ) }, { full_code: Like(`%${queryName}%` ) } ], skip: (parseInt(queryPage) - 1) * (parseInt(queryPerPage)), take: parseInt(queryPerPage), cache: true  })
        // }

        // Send the products, category, and sub categories as a JSON response
        res.status(HttpStatus.OK).json({products, products_count });
        
      } catch(error){ 


        if( error instanceof EntityNotFoundError){
          throw new NotFoundException();
        }

        throw new ModelException(error);
      }
    } 

    @Get('fetch')
    /**
     * Show a product by its code.
     *
     * @param {string} code - The code of the product.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>}
     */
    async fetch(
      @Req() req: Request,  // The request object
      @Res() res: Response // The response object
    ) {
      try {
        // Fetch brands
        let products = await this.productModel.find({ take: 10});

        // Send the product and favourite as a JSON response with a status code of 200 (OK)
        res.status(HttpStatus.OK).json({ products });

      } catch(error){

        // Log any errors that occur
        this.logger.error(error);

      }
    }

    @Get('brands')
    /**
     * Show a product by its code.
     *
     * @param {string} code - The code of the product.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>}
     */
    async brands(
      @Req() req: Request,  // The request object
      @Res() res: Response // The response object
    ) {
      try {
        // Fetch brands
        let brands = await this.brandModel.find({ cache: true });

        // Send the product and favourite as a JSON response with a status code of 200 (OK)
        res.status(HttpStatus.OK).json({ brands });

      } catch(error){

        // Log any errors that occur
        this.logger.error(error);

      }
    }

    @Get('colours')
    /**
     * Show a product by its code.
     *
     * @param {string} code - The code of the product.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>}
     */
    async colours(
      @Req() req: Request,  // The request object
      @Res() res: Response // The response object
    ) {
      try {
        // Fetch brands
        let colours = this.configService.get<any>('colors');
        colours     = uniq(flatMap(colours,(item) => item.colour ));
        
        // hexs.map( 
        //   (hex) => {
        //     console.log(flatMap(colours,(item,key) => ({ colours: item.colour, code: key}) ).filter( colour => colour.colours.includes(hex) ));
        //   }
        // )

        // Send the product and favourite as a JSON response with a status code of 200 (OK)
        res.status(HttpStatus.OK).json({ colours });

      } catch(error){

        // Log any errors that occur
        this.logger.error(error);

      }
    }

    @UseGuards(OptionalGuard)
    @Put(':full_code')
    /**
     * Show a product by its code.
     *
     * @param {string} code - The code of the product.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>}
     */
    async show(
      @Param('full_code') full_code: string, // The code of the product
      @Req() req: Request,  // The request object
      @Res() res: Response // The response object
    ) {
      try {

        // Get the user from the request object
        let user: any   = get(req,'user');
        
        // Find the product with the given code
        let product: any = await this.productModel.findOne({ where: { full_code: full_code }});

        await product.variants;
        await product.stocks;

        // Initialize the favourite object
        let favourite: any = {};

        // If a user is logged in, find their favourite with the given product code
        if( !isEmpty(user) ) {
          favourite = (await user.favourites).find( val => val.product.id == product.id ) ?? { };
        }


        // Send the product and favourite as a JSON response with a status code of 200 (OK)
        res.status(HttpStatus.OK).json({ product, favourite });

      } catch(error){

        // Log any errors that occur
        this.logger.error(error);

      }
    }
}
