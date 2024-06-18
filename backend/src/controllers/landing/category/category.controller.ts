import { Body, Controller, Get, HttpStatus, Inject, Injectable, Logger, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
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
    
    constructor(
      private amrodService: AmrodService,
      @Inject(CACHE_MANAGER) private cacheManager: Cache
    ){
      try {
        this.amrod.categories = this.jsonPlugin.readJSON(this.file_paths.categories);
        this.amrod.products   = this.jsonPlugin.readJSON(this.file_paths.products);
      } catch (error) {
        this.amrod.categories = [];
        this.amrod.products   = [];
      }
    }

    @Get(':path')
    async index(@Param('path') path: string, @Req() req: Request,  @Res() res: Response) {
 
      try {

        let products: any = cloneDeep(this.amrod.products);
        products          = products.filter( 
                                      product => product.categories.find( category => btoa(category.path) == path ) 
                                    ) 
                                    .map( ({productName,images,colourImages, description}) => ({productName,images,colourImages, description}));

        return res.status(HttpStatus.OK).json({ products });
      
      } catch(error){

        this.logger.error(error);

      }

    }  
    
    @Put('view/:category')
    async view(
      @Param('category') category: string,
      @Req() req: Request,
      @Res() res: Response
    ){

      try {

        let cached_categories: any = cloneDeep(this.amrod.categories);
        let cached_category:   any = cached_categories.find( val => btoa(val.categoryPath.toLowerCase()) == category);
        let cached_products:   any = cloneDeep(this.amrod.products);
        let sub_categories:    any = cached_category != undefined ? 
                                      get(cached_category,'children')
                                        .map( child => {

                                          let categories: any = get(cached_products.find( value => !isEmpty(value.categories.find( cat => cat.path.includes(child.categoryPath.toLowerCase()) )) ),'categories');
                                          let image: any      = get(first(shuffle(categories)),'image');
                                        
                                          return { ...child, image };
                                        
                                        }) : 
                                      [];

        return res.status(HttpStatus.OK).json({ sub_categories });

      } catch(error) {

        this.logger.error(error);

        res.status(error.status).json({ sub_categories: [] });
      
      }

    }

}
