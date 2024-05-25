import { Body, Controller, Get, HttpStatus, Inject, Injectable, Logger, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { first, isEmpty, get, omit, shuffle } from 'lodash';
import { CompanyModel } from 'src/models';
import { sep } from 'path';
import { ConfigService } from '@nestjs/config';

@Controller('home')
export class HomeController {

    private amrod = {
      brands:     [],
      categories: [],
      products:   [],
    };

    private readonly file_paths = {
      brands:     `${process.cwd()}${sep}public${sep}amrod${sep}brands.json`,
      categories: `${process.cwd()}${sep}public${sep}amrod${sep}categories.json`,
      products:   `${process.cwd()}${sep}public${sep}amrod${sep}products.json`,
    };

    private logger = new Logger(HomeController.name);

    private jsonPlugin      = require('json-reader-writer');

    constructor(
        private amrodService:  AmrodService,
        private configService: ConfigService,
        private companyModel:  CompanyModel,
    ){
      this.amrod.brands     = this.jsonPlugin.readJSON(this.file_paths.brands) ?? []
      this.amrod.categories = this.jsonPlugin.readJSON(this.file_paths.categories) ?? []
      this.amrod.products   = this.jsonPlugin.readJSON(this.file_paths.products) ?? []
    }


    @Get('')
    async index(
      @Req() req: Request,  
      @Res() res: Response
    ) {

      try {
        
        let categories: any        = shuffle(this.amrod.categories).map( category => {

          let categories: any = get(this.amrod.products.find( value => !isEmpty(value.categories.find( cat => cat.path.includes(category.categoryPath.toLowerCase()) )) ),'categories');
          let image: any      = get(first(shuffle(categories)),'image');
          return { ...omit(category,['children']), image };
        
        });

        let company = await this.companyModel.first();

        return res.status(HttpStatus.OK).json({ brands: this.amrod.brands, categories, banners: company.banners });

      } catch(err) {

        this.logger.error(err);
        
      }

    }   

}
