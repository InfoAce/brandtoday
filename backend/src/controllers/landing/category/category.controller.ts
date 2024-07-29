import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Inject, Injectable, Logger, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { cloneDeep, first, get, isEmpty, omit, shuffle } from 'lodash';
import { sep } from 'path';
@Controller('categories')
export class CategoryController {

    private amrod = {
      categories: [],
      products:   [],
    };

    private readonly file_paths = {
      categories: `${process.cwd()}${sep}public${sep}amrod${sep}categories.json`,
      products:   `${process.cwd()}${sep}public${sep}amrod${sep}products.json`,
    };

    private jsonPlugin      = require('json-reader-writer');

    private logger          = new Logger(CategoryController.name);
    
    /**
     * Class constructor
     * @param amrodService - The instance of AmrodService
     * @param cacheManager - The instance of CacheManager
     */
    constructor(
      private amrodService: AmrodService,
      @Inject(CACHE_MANAGER) private cacheManager: Cache
    ){
      // Try to read JSON files and assign them to the 'amrod' object
      try {
        // Read categories JSON file
        this.amrod.categories = this.jsonPlugin.readJSON(this.file_paths.categories);
        // Read products JSON file
        this.amrod.products   = this.jsonPlugin.readJSON(this.file_paths.products);
      } catch (error) {
        // If any error occurred during reading JSON files, clear 'amrod' object
        this.amrod.categories = [];
        this.amrod.products   = [];
      }
    }

    @Get(':path')
    /**
     * The 'index' method is responsible for retrieving products based on the given category path.
     * It reads the 'amrod.products' JSON file, filters the products based on the category path, and
     * returns the filtered products as a JSON response.
     *
     * @param {string} path - The category path.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>} - A promise that resolves when the response is sent.
     */
    async index(@Param('path') path: string, @Req() req: Request,  @Res() res: Response) {
     
 
      try {

        // Clone the 'amrod.products' array
        let products: any = cloneDeep(this.amrod.products);
        products          = products.filter( product => product.categories.find( category => btoa(category.path) == path ) ).map( ({productName,images,colourImages, description}) => ({productName,images,colourImages, description}));

        // Filter the products based on the category path
        products = products.filter(
          product => product.categories.find(
            category => btoa(category.path) == path
          )
        )
        // Map the filtered products to select only required fields
        .map(
          ({productName, images, colourImages, description}) => ({
            productName,
            images,
            colourImages,
            description
          })
        );

        // Return the filtered products as a JSON response
        return res.status(HttpStatus.OK).json({ products });
      
      } catch(error){

        // Log any errors that occur during the process
        this.logger.error(error);

      }

    }  

    @Put(':category_name/sub_categories')
    /**
     * Get a list of subcategories for a given category.
     *
     * @param {string} categoryPath - The path of the category.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>}
     */
    async show(
      @Param('category_name', new DefaultValuePipe(String()) ) categoryName: string,
      @Req() req: Request,
      @Res() res: Response
    ) {
      try {

        // Count products for this category
        let products_count: number = 0;

        // Find the category based on the provided path
        let category = this.amrod.categories.find( category => btoa(category.categoryName).includes(categoryName));

        // Map the subcategories to include an image from the products
        let sub_categories = category.children.map( child => {

          // List of products
          let products: any = this.amrod.products.filter( value => !isEmpty(value.categories.find( cat => cat.path.includes(child.categoryPath.toLowerCase()) )) );
          
          // Add products count
          products_count += products.length 

          // Get the categories for the child category
          let images: any   = get(first(shuffle(products)),'images');

          // Get the first image from the categories
          let image: any = first(shuffle(images));
         
          return { ...omit(child,['children']), image };
        });


        // Return the subcategories as a JSON response
        return res.status(HttpStatus.OK).json({ products_count, sub_categories });

      } catch (error) {
        // Log any errors that occur during the process
        this.logger.error(error);

        // Return an empty list of subcategories if an error occurs
        res.status(error.status).json({ sub_categories: [] });
      }
    }
    
    @Put('view')
    async view(
      @Query('category',new DefaultValuePipe(String())) queryCategory: string,
      @Query('name',new DefaultValuePipe(String())) queryName: string,
      @Req() req: Request,
      @Res() res: Response
    ){

      try {

        let cached_categories: any = cloneDeep(this.amrod.categories), cached_category = Object(), cached_products: any = cloneDeep(this.amrod.products), sub_categories = Array()

        if( !isEmpty(queryName) ) {
          sub_categories = cached_categories.map( value => value.children).flat(1).filter( value => value.categoryPath.includes(queryName.toLowerCase()) ).map( child => {
            let categories: any = get(cached_products.find( value => !isEmpty(value.categories.find( cat => cat.path.includes(child.categoryPath.toLowerCase()) )) ),'categories');
            let image: any      = get(first(shuffle(categories)),'image');
            return { ...child, image };
          });
        }

        if( !isEmpty(queryCategory) ){
          cached_category = cached_categories.find( val => btoa(val.categoryPath.toLowerCase()) == queryCategory);
          sub_categories = get(cached_category,'children').map( child => {
            let categories: any = get(cached_products.find( value => !isEmpty(value.categories.find( cat => cat.path.includes(child.categoryPath.toLowerCase()) )) ),'categories');
            let image: any      = get(first(shuffle(categories)),'image');
            return { ...child, image };
          });
        }

        return res.status(HttpStatus.OK).json({ sub_categories });

      } catch(error) {

        this.logger.error(error);

        res.status(error.status).json({ sub_categories: [] });
      
      }

    }

}
