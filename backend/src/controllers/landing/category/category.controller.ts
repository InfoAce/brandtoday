import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { cloneDeep, first, get, isEmpty, isNull, has, omit, shuffle, toPlainObject } from 'lodash';
import { sep } from 'path';
import { CategoryModel, ChildSubCategoryModel, ProductCategoryModel, ProductModel, SubCategoryModel, SubChildSubCategoryModel } from 'src/models';
import { EntityNotFoundError, Like } from 'typeorm';

@Controller('categories')
export class CategoryController {

    // private amrod = {
    //   categories: [],
    //   products:   [],
    // };

    // private readonly file_paths = {
    //   categories: `${process.cwd()}${sep}public${sep}amrod${sep}categories.json`,
    //   products:   `${process.cwd()}${sep}public${sep}amrod${sep}products.json`,
    // };

    private jsonPlugin      = require('json-reader-writer');

    private logger          = new Logger(CategoryController.name);
    
    /**
     * Class constructor
     * @param amrodService - The instance of AmrodService
     * @param cacheManager - The instance of CacheManager
     */
    constructor(
      private amrodService:         AmrodService,
      private categoryModel:        CategoryModel,
      private subCategoryModel:     SubCategoryModel,
      private childSubCategoryModel:ChildSubCategoryModel,
      private subChildSubCategoryModel:SubChildSubCategoryModel,
      private productModel:         ProductModel,
      private productCategoryModel: ProductCategoryModel,
      @Inject(CACHE_MANAGER) private cacheManager: Cache
    ){
      // // Try to read JSON files and assign them to the 'amrod' object
      // try {
      //   // Read categories JSON file
      //   this.amrod.categories = this.jsonPlugin.readJSON(this.file_paths.categories);
      //   // Read products JSON file
      //   this.amrod.products   = this.jsonPlugin.readJSON(this.file_paths.products);
      // } catch (error) {
      //   // If any error occurred during reading JSON files, clear 'amrod' object
      //   this.amrod.categories = [];
      //   this.amrod.products   = [];
      // }
    }

    /**
     * The 'create' method is responsible for retrieving a sub category based on the given category code and sub category code.
     * It finds the category based on the provided category code, finds the sub category based on the provided sub category code,
     * counts the number of products for the sub category, and finds the child sub categories based on the sub category code.
     * It returns the category, sub category, products count, and child sub categories as a JSON response.
     *
     * @param {string} category_code - The category code.
     * @param {string} sub_category_code - The sub category code.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>} - A promise that resolves when the response is sent.
     */
    @Get(':category_code/:sub_category_code')
    async create(
      @Param('category_code') category_code: string, 
      @Param('sub_category_code') sub_category_code: string, 
      @Req() req: Request, 
      @Res() res: Response
    ) {
      try {
        
        // Find the category based on the provided category code
        let category            = await this.categoryModel.findOne({ where: { code: category_code } });

        // Find the sub category based on the provided sub category code
        let sub_category        = await this.subCategoryModel.findOne({ where: { code: sub_category_code } });

        // Count the number of products for the sub category
        let products_count      = await this.productModel.count({ relations:['categories'], where: { categories: { category_code, sub_category_code } } });
        
        // Find the child sub categories based on the sub category code
        let child_sub_categories = await this.childSubCategoryModel.find({ relations:{ product_categories: { product: true } }, where: { path: Like(`%${category_code}/${sub_category_code}%`) } });

        child_sub_categories     = child_sub_categories.filter( category => get(category,'__product_categories__').length > 0 ).map( child_sub_category => {
          let product = get(first(get(child_sub_category,'__product_categories__').filter( product_category => !isNull(product_category.__product__) )),'__product__');
          return { 
            ...omit(child_sub_category,['__product_categories__']), 
            products_count: get(child_sub_category,'__product_categories__').length, 
            image:          get(first(get(first(shuffle(get(product,'images'))),'urls')),'url')
          }
        });

        // Return the category, sub category, products count, and child sub categories as a JSON response
        return res.status(HttpStatus.OK).json({ category, sub_category, products_count, child_sub_categories });
        
      } catch(error){

        console.log(error);

        // If the error is an EntityNotFoundError, throw a NotFoundException
        if( error instanceof EntityNotFoundError){
          throw new NotFoundException();
        }
        
        // If the error is not an EntityNotFoundError, throw an InternalServerErrorException
        throw new InternalServerErrorException(error);
      
      }
    }

    // @Get(':path')
    // /**
    //  * The 'index' method is responsible for retrieving products based on the given category path.
    //  * It reads the 'amrod.products' JSON file, filters the products based on the category path, and
    //  * returns the filtered products as a JSON response.
    //  *
    //  * @param {string} path - The category path.
    //  * @param {Request} req - The request object.
    //  * @param {Response} res - The response object.
    //  * @return {Promise<void>} - A promise that resolves when the response is sent.
    //  */
    // async index(@Param('path') path: string, @Req() req: Request,  @Res() res: Response) {
     
 
    //   try {

    //     // Clone the 'amrod.products' array
    //     let products: any = cloneDeep(this.amrod.products);
    //     products          = products.filter( product => product.categories.find( category => btoa(category.path) == path ) ).map( ({productName,images,colourImages, description}) => ({productName,images,colourImages, description}));

    //     // Filter the products based on the category path
    //     products = products.filter(
    //       product => product.categories.find(
    //         category => btoa(category.path) == path
    //       )
    //     )
    //     // Map the filtered products to select only required fields
    //     .map(
    //       ({productName, images, colourImages, description}) => ({
    //         productName,
    //         images,
    //         colourImages,
    //         description
    //       })
    //     );

    //     // Return the filtered products as a JSON response
    //     return res.status(HttpStatus.OK).json({ products });
      
    //   } catch(error){

    //     // Log any errors that occur during the process
    //     this.logger.error(error);

    //   }

    // }  

    @Put(':code/sub_categories')
    /**
     * Get a list of subcategories for a given category.
     *
     * @param {string} categoryPath - The path of the category.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>}
     */
    async show(
      @Param('code', new DefaultValuePipe(String()) ) categoryCode: string,
      @Req() req: Request,
      @Res() res: Response
    ) {
      try {

        // Count products for this category
        let products_count: number = 0;

        // Find the category based on the provided path
        let category            = await this.categoryModel.findOne({ where: { code: categoryCode } });
        
        let sub_categories: any = await this.subCategoryModel.find({ where: { category_code: categoryCode } });

        // Map the subcategories to include an image from the products
        sub_categories = await (
          await Promise.all( 
            sub_categories.map( async (sub_category) => {
              let [ product_categories, count] = await this.productCategoryModel.findAndCount({ where: { sub_category_code: sub_category.code } });

              products_count += count;
              
              let product = await (get(first(shuffle(product_categories)),'product'));
              
              // Get the categories for the child category
              let images: any   = get(product,'images');
    
              // Get the first image from the categories
              let image: any = first(shuffle(images));
            
              return await { ...toPlainObject(( await sub_category)), image, products_count: count };
              // return await sub_category;
            })
          )
        );

        // Return the subcategories as a JSON response
        return res.status(HttpStatus.OK).json({ products_count, category, sub_categories});

      } catch (error) {
        // Log any errors that occur during the process
        this.logger.error(error);

        // Return an empty list of subcategories if an error occurs
        res.status(error.status).json({ sub_categories: [] });
      }
    }
    
    // @Put('view')
    // async view(
    //   @Query('category',new DefaultValuePipe(String())) queryCategory: string,
    //   @Query('name',new DefaultValuePipe(String())) queryName: string,
    //   @Req() req: Request,
    //   @Res() res: Response
    // ){

    //   try {

    //     let cached_categories: any = cloneDeep(this.amrod.categories), cached_category = Object(), cached_products: any = cloneDeep(this.amrod.products), sub_categories = Array()

    //     if( !isEmpty(queryName) ) {
    //       sub_categories = cached_categories.map( value => value.children).flat(1).filter( value => value.categoryPath.includes(queryName.toLowerCase()) ).map( child => {
    //         let categories: any = get(cached_products.find( value => !isEmpty(value.categories.find( cat => cat.path.includes(child.categoryPath.toLowerCase()) )) ),'categories');
    //         let image: any      = get(first(shuffle(categories)),'image');
    //         return { ...child, image };
    //       });
    //     }

    //     if( !isEmpty(queryCategory) ){
    //       cached_category = cached_categories.find( val => btoa(val.categoryPath.toLowerCase()) == queryCategory);
    //       sub_categories = get(cached_category,'children').map( child => {
    //         let categories: any = get(cached_products.find( value => !isEmpty(value.categories.find( cat => cat.path.includes(child.categoryPath.toLowerCase()) )) ),'categories');
    //         let image: any      = get(first(shuffle(categories)),'image');
    //         return { ...child, image };
    //       });
    //     }

    //     return res.status(HttpStatus.OK).json({ sub_categories });

    //   } catch(error) {

    //     this.logger.error(error);

    //     res.status(error.status).json({ sub_categories: [] });
      
    //   }

    // }

}
