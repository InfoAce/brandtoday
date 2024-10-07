import { Body, Controller, Get, HttpStatus, Inject, Injectable, Logger, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { first, isEmpty, isNull, get, has,  omit, shuffle, toPlainObject } from 'lodash';
import { BrandModel, CategoryModel, CompanyModel, ProductCategoryModel, ProductModel } from 'src/models';
import { sep } from 'path';
import { ConfigService } from '@nestjs/config';

@Controller('home')
export class HomeController {

    private logger = new Logger(HomeController.name);
    private colors = Object();

    constructor(
      private brandModel:            BrandModel,
      private categoryModel:         CategoryModel,
      private companyModel:          CompanyModel,
      private configService:         ConfigService,
      private productCategoryModel:  ProductCategoryModel,
      private productModel:          ProductModel,
    ){
      this.colors = this.configService.get<any>('colors');
    }


    @Get('')
    async index(
      @Req() req: Request,  
      @Res() res: Response
    ) {

      try {

        let categories: any  = await this.categoryModel.find();
        let products: any    = await this.productModel.find({ take: 10 });

        categories = await (
          await Promise.all( 
            (await categories).map( async (category) => {
              let product_categories = await this.productCategoryModel.find({ take: 1, where: { category_id: category.id } });
              let product            = get(first(shuffle(product_categories)),'product');
              // Get the categories for the child category
              let images: any        = get(product,'images');   
              return await { ...toPlainObject(( await category)), image: get(first(get(first(shuffle(images)),'urls')),'url') };
            })
          )
        );

        products = await Promise.all(
          products.map( async(product) => {
            if (!isNull(product.colour_images)) {
              product.colour_images = product.colour_images.map((color) => ({ ...color, hex: this.colors[color.code].colour }));
            }
            await product.variants;
            return product;
          })
        )

        let company = await this.companyModel.first();

        return res.status(HttpStatus.OK).json({  brands: company.brands, categories, banners: company.banners, products });

      } catch(error) {

        this.logger.error(error);
        
      }

    }   

}
