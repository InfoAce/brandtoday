import { Body, Controller, Get, HttpStatus, Inject, Injectable, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { first, isEmpty, get, omit, shuffle } from 'lodash';

@Controller('home')
export class HomeController {

    constructor(
        private amrodService: AmrodService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){}


    @Get('')
    async index(
      @Req() req: Request,  
      @Res() res: Response
    ) {

      try {
        
        let cached_brands: any     = await this.cacheManager.store.get('amrod_brands');
        let cached_categories: any = await this.cacheManager.store.get('amrod_categories');
        let cached_products: any   = await this.cacheManager.store.get('amrod_products');
        let categories: any        = shuffle(cached_categories).map( category => {

          let categories: any = get(cached_products.find( value => !isEmpty(value.categories.find( cat => cat.path.includes(category.categoryPath.toLowerCase()) )) ),'categories');
          let image: any      = get(first(shuffle(categories)),'image');

          return { ...omit(category,['children']), image };
        
        });

        return res.status(HttpStatus.OK).json({ brands: cached_brands, categories });

      } catch(err) {

      }

    }   

}
