import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Inject, Injectable, Logger, Param, Post, Put, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, ClientGuard, OptionalGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { cloneDeep, flatMap, intersectionBy, isEmpty, isNull, first, has, get, omit, shuffle, set, sortBy, take, toPlainObject, uniqBy, uniq } from 'lodash';
import { paginate } from "src/helpers";
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { BrandModel, CategoryModel, FavouriteModel, PriceModel, ProductCategoryModel, ProductModel, SubCategoryModel } from 'src/models';
import { sep } from 'path';
import { ILike } from 'typeorm';
import { ConfigService } from '@nestjs/config';

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
      @Query('page',new DefaultValuePipe(1)) queryPage: string,
      @Query('perPage',new DefaultValuePipe(10)) queryPerPage: string,
      @Query('sort_pricing',new DefaultValuePipe(String('descending'))) querySortPricing: string,
      @Req() req: Request,  
      @Res() res: Response
    ) {
      try {  

        // Find the category based on the provided category id
        category          = await this.categoryModel.findOne({ where: { id: category } });

        // Find the sub category based on the provided sub category id
        sub_category      = await this.subCategoryModel.findOne({ where: { id: sub_category } });

        // Define the where clause for filtering products based on category, sub category, and name (if provided)
        let where: object = { category_id: category.id,  sub_category_id: sub_category.id }

        // If sub child category is provided, add it to the where clause
        if (!isEmpty(queryName)) {
          where = { ...where, product: { name: ILike(`%${queryName}%`) } };
        }

        // Fetch products categories based on the where clause
        let [products_categories, count]: any = await this.productCategoryModel.findCount({ skip: (parseInt(queryPage) - 1) * (parseInt(queryPerPage)), take: parseInt(queryPerPage), where });
    
        // List products fetched
        let products: any = await Promise.all(
          products_categories.map( async product_category => product_category.product )
                             .map(async (product) => {
            // If the product has colour images, add the hex code to each colour image
            product = await product;

            if (!isNull(product.colour_images)) {
              product.colour_images = product.colour_images.map((color) => ({
                ...color,
                hex: this.colors[color.code].colour,
              }));
            }
            
            return product;
          })
        );

        // Send the products, category, and sub categories as a JSON response
        res.status(HttpStatus.OK).json({category, sub_category, products, products_count: count });
        
      } catch(error){

        // If any error occurred, send the error as a JSON response
        if( has(error,'applicationRef') ){
          // Send the error as a JSON response
          let { response: { status, data} } = error;
          // Send the error as a JSON response
          res.status(status).json(data);
        }

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
        let brands = await this.brandModel.find();

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

        // Send the product and favourite as a JSON response with a status code of 200 (OK)
        res.status(HttpStatus.OK).json({ colours });

      } catch(error){

        // Log any errors that occur
        this.logger.error(error);

      }
    }

    @UseGuards(OptionalGuard)
    @Put(':product_id')
    /**
     * Show a product by its code.
     *
     * @param {string} code - The code of the product.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>}
     */
    async show(
      @Param('product_id') product_id: string, // The code of the product
      @Req() req: Request,  // The request object
      @Res() res: Response // The response object
    ) {
      try {

        // Get the user from the request object
        let user: any   = get(req,'user');
        
        // Find the product with the given code
        let product: any = await this.productModel.findOne({ where: { id: product_id }});

        if (!isNull(product.colour_images)) {
          product.colour_images = product.colour_images.map((color) => ({
            ...color,
            hex: this.colors[color.code].colour,
          }));
        }

        // let related_products: any = product.categories.map( 
        //                                                 category => cached_products.find( 
        //                                                   item => item.categories.find( val => {
        //                                                     let subject = category.path.split('/');

        //                                                     if( subject.lenght == 1 || subject.length == 2 ){
        //                                                       return val.path.includes(subject[0]);
        //                                                     }

        //                                                     subject.splice(subject.length - 1)
        //                                                     return val.path.includes(subject.join('/'));

        //                                                   }) 
        //                                                 )
        //                                               )
        //                                               .filter( item => item.fullCode != product.fullCode )
        //                                               .map( item => { 
        //                                                 let price = cached_prices.find( price => price.fullCode.includes(item.fullCode) );
        //                                                 return { ...item, price: price.price };
        //                                               });
        
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
