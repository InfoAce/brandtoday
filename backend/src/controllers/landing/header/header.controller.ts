import { Body, Controller, Get, HttpStatus, Inject, Injectable, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { isEmpty } from 'lodash';
import { CompanyModel } from 'src/models';

@Controller('header')
export class HeaderController {

    constructor(
      private amrodService: AmrodService,
      private companyModel: CompanyModel,
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){}

    @Get('')
    async index(@Req() req: Request,  @Res() res: Response) {
 
      try {
        let cached_categories = await this.cacheManager.store.get('amrod_categories');
        let company           = await this.companyModel.first();

        if( isEmpty(cached_categories) ){
          let categories = await this.amrodService.getCategories();
          cached_categories = await this.cacheManager.store.set('amrod_categories',categories);
        }

        res.status(HttpStatus.OK).json({ categories: cached_categories, company });

      } catch(err){

      }

    }   

}