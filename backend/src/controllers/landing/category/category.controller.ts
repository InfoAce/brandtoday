import { Body, Controller, Get, HttpStatus, Inject, Injectable, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { first, get, isEmpty, omit, shuffle } from 'lodash';

@Controller('categories')
export class CategoryController {

    constructor(
        private amrodService: AmrodService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ){}

    @Get(':path')
    async index(@Param('path') path: string, @Req() req: Request,  @Res() res: Response) {
 
      try {

        let products: any = await this.cacheManager.store.get('amrod_products');
        products          = products.filter( 
                                      product => product.categories.find( category => btoa(category.path) == path ) 
                                    ) 
                                    .map( ({productName,images,colourImages, description}) => ({productName,images,colourImages, description}));

        return res.status(HttpStatus.OK).json({ products });
      
      } catch(err){

      }

    }  
    
    @Put('view/:category')
    async view(
      @Param('category') category: string,
      @Req() req: Request,
      @Res() res: Response
    ){

      try {

        let cached_categories: any = await this.cacheManager.store.get('amrod_categories');
        let cached_category:   any = cached_categories.find( val => btoa(val.categoryPath.toLowerCase()) == category);
        let cached_products:   any = await this.cacheManager.store.get('amrod_products');
        let sub_categories:    any = cached_category != undefined ? 
                                      get(cached_category,'children')
                                        .map( child => omit(child,['children']) )
                                        .map( child => {

                                          let categories: any = get(cached_products.find( value => !isEmpty(value.categories.find( cat => cat.path.includes(child.categoryPath.toLowerCase()) )) ),'categories');
                                          let image: any      = get(first(shuffle(categories)),'image');
                                        
                                          return { ...child, image };
                                        
                                        }) : 
                                      [];

        return res.status(HttpStatus.OK).json({ sub_categories });

      } catch(err) {

      }

    }

}
