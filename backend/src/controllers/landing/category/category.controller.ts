import { Body, Controller, Get, HttpStatus, Inject, Injectable, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Controller('categories')
export class CategoryController {

    constructor(
        private amrodService: AmrodService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ){}

    @Get(':path')
    async index(@Param('path') path: string, @Req() req: Request,  @Res() res: Response) {
 
      try {
          console.log(atob(path));
        // let products = await this.amrodService.getProducts();
        // let stored   = await this.cacheManager.store.set('amrod_products',products);
        let products: any = await this.cacheManager.store.get('amrod_products');
        products          = products.filter( 
                                      product => product.categories.find( category => btoa(category.path) == path ) 
                                    ) 
                                    .map( ({productName,images,colourImages, description}) => ({productName,images,colourImages, description}));

        return res.status(HttpStatus.OK).json({ products });
      
      } catch(err){

      }

    }   

}
