import { Body, Controller, Get, HttpStatus, Inject, Injectable, Param, Post, Put, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, OptionalGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { isEmpty, first, has, get, omit, shuffle } from 'lodash';
import { paginate } from "src/helpers";
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { FavouriteModel } from 'src/models';

@Controller('products')
export class ProductsController {

    constructor(
      private amrodService: AmrodService,
      private favouriteModel: FavouriteModel,
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){}

    @Get('')
    async index(
      @Query('category') queryCategory: string,
      @Query('sub_category') querySubCategory: string,
      @Query('sub_child_category') querySubChildCategory: string,
      @Req() req: Request,  
      @Res() res: Response
    ) {
      try {  
        let cached_products: any = await this.cacheManager.store.get('amrod_products');
        let cached_prices:   any = await this.cacheManager.store.get('amrod_prices');
        let category:        any = Object();

        if( isEmpty(cached_products) ){
          let products    = await this.amrodService.getProducts();
          cached_products = await this.cacheManager.store.set('amrod_products',products);
        }

        if( !isEmpty(queryCategory) ){
          let categories: any  = await this.cacheManager.store.get('amrod_categories');

          category        = categories.find( category => category.categoryPath == atob(queryCategory) );
          cached_products = cached_products.filter( product => product.categories.find( category => category.path.includes(atob(queryCategory))) );
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
         
      } catch(err){
        console.log(err);
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
        let cached_products: any = await this.cacheManager.store.get('amrod_products');
        let cached_prices: any   = await this.cacheManager.store.get('amrod_prices');
        let product: any         = cached_products.find( product => product.fullCode == code );
        let data_price           = cached_prices.find( val => product.simpleCode.includes(val.simplecode) );
        let favourite: any       = {};

        if( user ){
          favourite = (await user.favourites).find( val => val.content.code == product.fullCode );
        }

        if( data_price != undefined ){ product.price = data_price.price; }
  
        res.status(HttpStatus.OK).json({ product, favourite });

      } catch(err){
        console.log(err);
      }
    }

    @Put('stock/:code')
    async fetchSize(@Param('code') code: any, @Req() req: Request,  @Res() res: Response) {
      try {
        
        let cached_stocks: any = await this.cacheManager.store.get('amrod_stock');
        let stock: any         = cached_stocks.find( val => val.fullCode == code );

        res.status(HttpStatus.OK).json({ stock });

      } catch(err){

      }
    }
}
