import { Body, Controller, Get, HttpStatus, Inject, Injectable, Param, Post, Put, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { isEmpty, has } from 'lodash';
import { paginate } from "src/helpers";
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Controller('products')
export class ProductsController {

    constructor(
      private amrodService: AmrodService,
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){}

    @Get('')
    async index(@Req() req: Request,  @Res() res: Response) {
      try {  
        let cached_products: any = await this.cacheManager.store.get('amrod_products');
        let cached_prices: any   = await this.cacheManager.store.get('amrod_prices');

        if( isEmpty(cached_products) ){
          let products    = await this.amrodService.getProducts();
          cached_products = await this.cacheManager.store.set('amrod_products',products);
        }

        if( !isEmpty(req.query) && has(req.query,'category') ){
          cached_products = cached_products.filter( product => product.categories.find( category => btoa(category.path) == req.query.category ) );
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
          // if( data_price == undefined ){ console.log(product.simpleCode) };
          return product;
        }); 
        

        res.status(HttpStatus.OK).json({ products: cached_products });
         
      } catch(err){
        console.log(err);
      }
    }  

    @Put(':code')
    async show(@Param('code') code: any, @Req() req: Request,  @Res() res: Response) {
      try {
        
        let cached_products: any = await this.cacheManager.store.get('amrod_products');
        let cached_prices: any   = await this.cacheManager.store.get('amrod_prices');
        let product: any         = cached_products.find( product => product.fullCode == code );
        let data_price           = cached_prices.find( val => product.simpleCode.includes(val.simplecode) );
        console.log(data_price);
        if( data_price != undefined ){ product.price = data_price.price; }
  
        res.status(HttpStatus.OK).json({ product });

      } catch(err){

      }
    }
}
