import { Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, Param, Post, Put, Query, Render, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard, ClientGuard, OptionalGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { cloneDeep, flatMap, intersectionBy, isEmpty, isNull, first, has, get, omit, shuffle, set, sortBy, take, toPlainObject, uniqBy, uniq } from 'lodash';
import { paginate } from "src/helpers";
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { BrandModel, CategoryModel, ColourModel, FavouriteModel, PriceModel, ProductCategoryModel, ProductModel, SubCategoryModel } from 'src/models';
import { sep } from 'path';
import { Any, Between, EntityNotFoundError, Equal, ILike, In, Like, Not, Or } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { PriceEntity, ProductEntity, ProductVariantEntity } from 'src/entities';
import { ModelException } from 'src/exceptions';
import { FetchProductsValidation, FilterBrandValidation } from 'src/validation';
import { filter } from 'rxjs';

@Controller('products')
export class ProductsController {

    private logger          = new Logger(ProductsController.name);

    /**
     * Class constructor
     * @param amrodService - The instance of AmrodService
     * @param favouriteModel - The instance of FavouriteModel
     * @param cacheManager - The instance of CacheManager
     */
    constructor(
      private brandModel:    BrandModel,
      private productModel:  ProductModel,
      private colourModel:   ColourModel,
    ){}

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
      @Query('clearance',new DefaultValuePipe(Boolean())) queryClearance: boolean,
      @Query('colours',new DefaultValuePipe(String())) queryColours: string,
      @Query('name',new DefaultValuePipe(String())) queryName: string,
      @Query('category_code',new DefaultValuePipe(String())) category_code: string,
      @Query('sub_category_code',new DefaultValuePipe(String())) sub_category_code: string,
      @Query('child_sub_category_code',new DefaultValuePipe(String())) child_sub_category_code: string,
      @Query('brand',new DefaultValuePipe(String())) brand: string,
      @Query('page',new DefaultValuePipe(1)) queryPage: string,
      @Query('perPage',new DefaultValuePipe(10)) queryPerPage: string,
      @Query('price_range',new DefaultValuePipe(String())) queryPriceRange: string,
      @Query('sort_pricing',new DefaultValuePipe(String('DESC'))) querySortPricing: string,
      @Body() body: FetchProductsValidation,
      @Req()  req:  Request,  
      @Res()  res:  Response
    ) {
      try {  
        let products       = Array();
        let relations      = Array();
        let products_count = Number();
        let filters        = Object({
          cache:    true,
          order:    { price: querySortPricing.toUpperCase() }, 
          skip:     (parseInt(queryPage) - 1) * (parseInt(queryPerPage)), 
          take:     parseInt(queryPerPage), 
          where:    [],
        });

        // Check if category and sub-category codes are provided
        if (!isEmpty(category_code) && !isEmpty(sub_category_code)) {
          
          // Initialize the 'where' filter
          set(filters, 'where', {});

          // Set category and sub-category codes in the filter
          set(filters.where, 'categories', { category_code, sub_category_code });

          // If child sub-category code is provided, add it to the filter
          if (!isEmpty(child_sub_category_code)) {
            set(filters.where.categories, 'child_sub_category_code', child_sub_category_code);
          }

          // If brand is provided, add it to the filter
          if (!isEmpty(brand)) {
            set(filters.where, 'brand', brand);
          }

          // If clearance is queried, include 'allclearanceitems' in category codes
          if (queryClearance) {
            set(filters.where.categories, 'category_code', In(['allclearanceitems', filters.where.categories.category_code]));
          }

          /**
           * If search name is queried, search for the name in the product name and full code
           */
          if (!isEmpty(queryName)) {
            set(filters.where, 'name', ILike(`%${queryName}%`));
          }          

          if( !isEmpty(queryColours) ){
            relations.push('colour_images')
            set(filters.where, 'colour_images', { code: In(queryColours.split(',')) });
          }

          // Set relation to 'categories'
          relations.push('categories')

          // Set the price range in the filter
          set(filters.where, 'price', Between(body.price[0], body.price[1]));

        }

        /**
         * If category and sub-category codes are not provided, then
         * we need to filter the products based on the query parameters
         * such as name and clearance.
         */
        if (isEmpty(category_code) && isEmpty(sub_category_code)) {

          /**
           * If clearance is queried, include 'allclearanceitems' in category codes
           */
          if (queryClearance) {
            relations.push('categories')
            filters.where.push({ categories: { category_code: In(['allclearanceitems']) } })
          }
          
          /**
           * If search name is queried, search for the name in the product name and full code
           */
          if (!isEmpty(queryName)) {
            filters.where.push({name: ILike(`%${queryName}%`)})
            filters.where.push({full_code: ILike(`%${queryName}%`)})
          }
            
        }

        if( !isEmpty(relations) ){
          set(filters, 'relations', relations);
        }

        let [results, count ] = await this.productModel.findAndCount(filters);

        products_count        = count;
        products              = cloneDeep(results);

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
        throw new HttpException(error.message, error.status);

      }
    }

    @Put('brands')
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
      @Res() res: Response, // The response object
      @Body() body: FilterBrandValidation
    ) {
      try {

        let filter = { cache: true };
        
        if( body.with_products ){
          filter['relations'] = { products:{ categories: true } }
        }

        if( body.categorized ){
          if( !isEmpty(filter['where']) ){
            filter['where'] = { ...filter['where'], products: { categories: { category_code: body.category, sub_category_code: body.sub_category } } }
          }
          if( isEmpty(filter['where']) ){
            filter['where'] = { products: { categories: { category_code: body.category, sub_category_code: body.sub_category } } }
          }
          if( !isEmpty(body.child_sub_category) ){
            filter['where']['products']['categories']['child_sub_category_code'] = body.child_sub_category
          }
        }

        // Fetch brands
        let brands = await this.brandModel.find(filter);

        if( body.with_products ){
          brands = brands.map( (brand: any) => {
            brand.product_count = brand.__products__.length;
            return omit(brand,['__products__']);
          });
        }

        // Send the product and favourite as a JSON response with a status code of 200 (OK)
        res.status(HttpStatus.OK).json({ brands });

      } catch(error){

        // Log any errors that occur
        this.logger.error(error);
        throw new HttpException(error.message, error.status);
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
      @Query('brand',new DefaultValuePipe(String())) brand: string,
      @Query('category_code',new DefaultValuePipe(String())) category_code: string,
      @Query('sub_category_code',new DefaultValuePipe(String())) sub_category_code: string,
      @Query('child_sub_category_code',new DefaultValuePipe(String())) child_sub_category_code: string,
      @Req() req: Request,  // The request object
      @Res() res: Response // The response object
    ) {
      try {

        let filters: any = {};

        if( !isEmpty(brand) ){
          filters = { where: { product_colours: { product: { brand } } } };
        }

        if( !isEmpty(category_code) ){
          if( has(filters,'where') ){
            set(filters['where']['product_colours']['product'], 'categories', { category_code });
          } 
          if( !has(filters,'where') ){
            filters = { where: { product_colours: { product: { categories: { category_code } } } } };        
          }
        }

        if( !isEmpty(sub_category_code) ){
          set(filters.where.product_colours.product.categories, 'sub_category_code', sub_category_code);
        }

        if( !isEmpty(child_sub_category_code) ){
          set(filters.where.product_colours.product.categories, 'child_sub_category_code', child_sub_category_code);
        }
        
        if( has(filters.where,'product_colours') ){
          set(filters,'relations',{ product_colours: true });
        }

        // Fetch brands
        let colours = await this.colourModel.find(filters);

        // Send the product and favourite as a JSON response with a status code of 200 (OK)
        res.status(HttpStatus.OK).json({ colours });

      } catch(error){

        // Log any errors that occur
        this.logger.error(error);
        throw new HttpException(error.message, error.status);
      }
    }

    @UseGuards(OptionalGuard)
    @Put(':slug')
    /**
     * Show a product by its code.
     *
     * @param {string} code - The code of the product.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>}
     */
    async show(
      @Param('slug') slug: string, // The code of the product
      @Req() req: Request,  // The request object
      @Res() res: Response // The response object
    ) {
      try {

        // Get the user from the request object
        let user: any   = get(req,'user');

        // Find the product with the given code
        let product: any = await this.productModel.findOne({ where: { slug }});

        await product.variants;
        await product.stocks;
        await product.branding;

        // Initialize the favourite object
        let favourite: any = {};

        // If a user is logged in, find their favourite with the given product code
        if( !isEmpty(user) ) {
          favourite = (await user.favourites).filter( favourite => !isNull(favourite.product) ).find( val => val.product.full_code == product.full_code );
        }


        // Send the product and favourite as a JSON response with a status code of 200 (OK)
        res.status(HttpStatus.OK).json({ product, favourite });

      } catch(error){

        // Log any errors that occur
        this.logger.error(error);
        throw new HttpException(error.message, error.status);
      }
    }
}
