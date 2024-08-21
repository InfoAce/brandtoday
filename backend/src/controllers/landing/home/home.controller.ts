import { Body, Controller, Get, HttpStatus, Inject, Injectable, Logger, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { first, isEmpty, get, omit, shuffle, toPlainObject } from 'lodash';
import { BrandModel, CategoryModel, CompanyModel, ProductCategoryModel } from 'src/models';
import { sep } from 'path';
import { ConfigService } from '@nestjs/config';

@Controller('home')
export class HomeController {

    private logger = new Logger(HomeController.name);

    constructor(
      private brandModel:    BrandModel,
      private categoryModel: CategoryModel,
      private companyModel:  CompanyModel,
      private productCategoryModel:  ProductCategoryModel,
    ){}


    @Get('')
    async index(
      @Req() req: Request,  
      @Res() res: Response
    ) {

      try {

        let brands: any      = await this.brandModel.find();
        let categories: any  = await this.categoryModel.find();

        categories = await (
          await Promise.all( 
            (await categories).map( async (category) => {
              let product_categories = await this.productCategoryModel.find({ take: 1, where: { category_id: category.id } });
              let product            = get(first(shuffle(product_categories)),'product');
              // Get the categories for the child category
              let images: any        = get(product,'images');          
              return await { ...toPlainObject(( await category)), image: first(first(shuffle(images)).urls).url };
            })
          )
        );

        let company = await this.companyModel.first();

        return res.status(HttpStatus.OK).json({ brands, categories, banners: company.banners });

      } catch(err) {

        this.logger.error(err);
        
      }

    }   

}
