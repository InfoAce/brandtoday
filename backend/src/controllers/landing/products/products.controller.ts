import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, Param, Post, Put, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, ClientGuard, OptionalGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { cloneDeep, flatMap, intersectionBy, isEmpty, isNull, first, has, get, omit, shuffle, set, sortBy, take, toPlainObject, uniqBy, uniq } from 'lodash';
import { paginate } from "src/helpers";
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { BrandModel, CategoryModel, FavouriteModel, PriceModel, ProductCategoryModel, ProductModel, SubCategoryModel } from 'src/models';
import { sep } from 'path';
import { Any, EntityNotFoundError, Equal, ILike, In, Like, Not, Or } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { PriceEntity, ProductEntity, ProductVariantEntity } from 'src/entities';
import { ModelException } from 'src/exceptions';

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
      @Query('category',new DefaultValuePipe(String())) category_id: any,
      @Query('sub_category',new DefaultValuePipe(String())) sub_category_id: any,
      @Query('page',new DefaultValuePipe(1)) queryPage: string,
      @Query('perPage',new DefaultValuePipe(10)) queryPerPage: string,
      @Query('price_range',new DefaultValuePipe(String())) queryPriceRange: string,
      @Query('sort_pricing',new DefaultValuePipe(String('descending'))) querySortPricing: string,
      @Req() req: Request,  
      @Res() res: Response
    ) {
      try {  

        let products       = Array();
        let products_count = Number();

        if( !isEmpty(category_id) && !isEmpty(sub_category_id) ){
          let product_categories =  await this.productCategoryModel.find({ where: { category_id, sub_category_id }, skip: (parseInt(queryPage) - 1) * (parseInt(queryPerPage)), take: parseInt(queryPerPage), cache: true});
          products               = cloneDeep(product_categories).map( (category) => category.product );
        }

        if( !isEmpty(queryName) ){
          [products, products_count] = await this.productModel.findAndCount({ where: [ { name: Like(`%${queryName}%` ) }, { full_code: Like(`%${queryName}%` ) } ], skip: (parseInt(queryPage) - 1) * (parseInt(queryPerPage)), take: parseInt(queryPerPage), cache: true  })
        }

        // let query = this.productModel.createQueryBuilder("products")
        //                 .leftJoinAndSelect("products.categories", "categories")
        //                 .leftJoinAndSelect("products.colour_images", "colour_images")

        // // If sub child category is provided, add it to the where clause
        // if (!isEmpty(queryName)) {
        //   query = query.andWhere("products.name LIKE :name", {name: `%${queryName}%`});
        // }
        
        // if (!isEmpty(queryPriceRange)) {
        //   query = query.leftJoinAndSelect("products.variants", "variants").leftJoinAndSelect("variants.price", "variants_prices")
        //   query = query.andWhere("variants_prices.amount >= :min AND variants_prices.amount <= :max", {min: queryPriceRange.split('~')[0], max: queryPriceRange.split('~')[1]})
        //                .orderBy("variants_prices.amount",querySortPricing == 'descending' ? 'DESC' : 'ASC')
        // }

        // let [ products, count ] = await query.andWhere("categories.category_id = :category_id", {category_id})
        //                                      .andWhere("categories.sub_category_id = :sub_category_id", {sub_category_id})
        //                                      .skip((parseInt(queryPage) - 1) * (parseInt(queryPerPage))).take(parseInt(queryPerPage))
        //                                      .setFindOptions({ loadEagerRelations: true})
        //                                      .getManyAndCount();
                                             
        products = await Promise.all(
          products.map( async(product) => {
            if (!isNull(product.colour_images)) {
              product.colour_images = product.colour_images.map((color) =>{
                try {
                  return { ...color, hex: this.colors[color.code].colour };
                } catch(error){
                  this.logger.log(`[COLOUR ERROR]${JSON.stringify(color)}`)
                }
              });
            }
            await product.variants;
            return product;
          })
        )

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

        await product.variants;
        await product.stocks;

        let categories            = await product.categories;
        // let related_products: any = await this.productCategoryModel.find({ where: { category_id: In(categories.map( category => toPlainObject(category).category_id ) ), product_id: Not(product.id) }, take: 15, cache: true});

        // related_products          = await Promise.all(
        //     related_products.map( product_category => product_category.product )
        //                     .map( async product => {
        //                       await product.variants;
        //                       await product.stocks;
        //                       return product;
        //                     })
        //                     .map( async product => { 
        //                         product = await product;
        //                         return{
        //                           ...product, 
        //                           colour_images: product.colour_images.map( (color) => ({
        //                             ...color,
        //                             hex: this.colors[color.code].colour,
        //                           }))
        //                         }
        //                       }
        //                     )
        // );

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
