import { Body, Controller, Get, HttpStatus, Inject, Injectable, Logger, Param, Post, Put, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, OptionalGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { cloneDeep, isEmpty, first, has, get, omit, shuffle } from 'lodash';
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
      prices:     `${process.cwd()}${sep}public${sep}amrod${sep}products.json`,
      stock:      `${process.cwd()}${sep}public${sep}amrod${sep}stocks.json`,
    };

    private jsonPlugin      = require('json-reader-writer');

    private logger          = new Logger(ProductsController.name);

    constructor(
      private amrodService:   AmrodService,
      private favouriteModel: FavouriteModel,
      @Inject(CACHE_MANAGER) 
      private cacheManager: Cache,
    ){
      this.amrod.categories = this.jsonPlugin.readJSON(this.file_paths.categories) ?? []
      this.amrod.products   = this.jsonPlugin.readJSON(this.file_paths.products) ?? []
      this.amrod.prices     = this.jsonPlugin.readJSON(this.file_paths.prices) ?? []
      this.amrod.stock      = this.jsonPlugin.readJSON(this.file_paths.stock) ?? []
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
    async show(
      @Param('code') code: any,
      @Req() req: Request,  
      @Res() res: Response
    ) {
      try {

        let user: any            = get(req,'user');
        let cached_products: any = cloneDeep(this.amrod.products);
        let cached_prices: any   = cloneDeep(this.amrod.prices);
        let product: any         = cached_products.find( product => product.fullCode == code );
        let data_price           = cached_prices.find( val => product.simpleCode.includes(val.simplecode) );
        let favourite: any       = {};

        if( user ){
          favourite = (await user.favourites).find( val => val.content.code == product.fullCode );
        }

        if( data_price != undefined ){ product.price = data_price.price; }
  
        res.status(HttpStatus.OK).json({ product, favourite });

      } catch(error){

        this.logger.error(error);

      }
    }

    @Put('stock/:code')
    async fetchSize(@Param('code') code: any, @Req() req: Request,  @Res() res: Response) {
      try {
        
        let cached_stocks: any = cloneDeep(this.amrod.stock);
        let stock: any         = cached_stocks.find( val => val.fullCode == code );

        res.status(HttpStatus.OK).json({ stock });

      } catch(error){

        this.logger.error(error);

      }
    }
}
