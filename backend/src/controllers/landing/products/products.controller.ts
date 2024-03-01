import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Controller, Get, Inject, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { intersection, isEmpty } from 'lodash';
import { paginate } from 'src/helpers';

@Controller('products')
export class ProductsController {

    constructor(
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){}

    @Get('')
    async index(@Req() req: Request,  @Res() res: Response) {
      res.render('pages/products');
    }   

    @Get(':code')
    async show(@Param('code') code: string, @Req() req: Request,  @Res() res: Response) {
      
      let products: any         = await this.cacheManager.store.get('amrod_products');
      let product               = products.find( product => product.fullCode == code );
      let related_products: any = products.filter( value => {
        if( !isEmpty(intersection( value.categories.map( category => btoa(category.path) ), product.categories.map( item => btoa(item.path) ) )) ){
          return value; 
        }
      });

      // console.log(product);

      related_products = paginate(related_products);
      
      res.render('pages/product',{ product, related_products });
    
    }  

}
