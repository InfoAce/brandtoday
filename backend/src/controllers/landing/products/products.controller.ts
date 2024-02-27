import { Body, Controller, Get, HttpStatus, Inject, Injectable, Param, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { isEmpty, get, has } from 'lodash';
import { paginate } from "src/helpers";

@Controller('products')
export class ProductsController {

    constructor(
        private amrodService: AmrodService,
    ){}

    @Get('')
    async index(@Req() req: Request,  @Res() res: Response) {
      try {
        let categories = await this.amrodService.getCategories(), 
        products       = await this.amrodService.getProducts(), 
        data           = { categories, products };

        if( !isEmpty(req.query) && has(req.query,'category') ){
          products  = data.products.filter( products=> products.categories.find( category => btoa(category.path) == req.query.category ) );
        }

        data.products = paginate({data:products,response:res});
        console.log(data.products.links);
        res.render('pages/products',data);

      } catch(err){

      }
    }  
    
    @Get(':category')
    async indexCategory(@Param('category') category: string, @Req() req: Request,  @Res() res: Response) {
      try {
        let categories = await this.amrodService.getCategories(),
        products       = await this.amrodService.getProducts();
        
        products       = products.filter( product => products.categories.find( category => btoa(category.path) == category ) );
        console.log(products);
        res.render(
          'pages/products',
          {
            categories,
            products
          }
        );
      } catch(err){

      }
    } 

}
