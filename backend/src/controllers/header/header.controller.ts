import { Body, Controller, Get, HttpStatus, Inject, Injectable, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { isEmpty } from 'lodash';

@Controller('header')
export class HeaderController {

    constructor(
      private amrodService: AmrodService,
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){}

    @Get('')
    async index(@Req() req: Request,  @Res() res: Response) {
 
      try {
        let cached_categories = await this.cacheManager.store.get('amrod_categories');

        if( isEmpty(cached_categories) ){
          let categories = await this.amrodService.getCategories();
          cached_categories = await this.cacheManager.store.set('amrod_categories',categories);
        }

        res.status(HttpStatus.OK).json({ categories: cached_categories });

      } catch(err){

      }

    }   

}
