import { Body, Controller, Get, HttpStatus, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { RegisterValidation } from 'src/validation';
import { BrandModel, CategoryModel, ChildSubCategoryModel, CompanyModel, PriceModel, ProductCategoryModel, ProductModel, RoleModel, SubCategoryModel, UserModel } from 'src/models';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { isEmpty, isNull, take } from 'lodash';
import { sep } from 'path';
import StockModel from 'src/models/stock.model';
import { ILike } from 'typeorm';
import { delay } from 'rxjs';

@Controller('dashboard/system')
export class SystemController {

    private readonly logger = new Logger(SystemController.name);

    private readonly file_path = `${process.cwd()}${sep}configurations.json`;

    private jsonPlugin         = require('json-reader-writer');

    constructor(
        private amrodService:         AmrodService,
        private brandModel:           BrandModel,
        private categoryModel:        CategoryModel,
        private childSubCategory:     ChildSubCategoryModel,
        private configService:        ConfigService,
        private priceModel:           PriceModel,
        private productModel:         ProductModel,
        private productCategoryModel: ProductCategoryModel,
        private stockModel:           StockModel,
        private subCategoryModel:     SubCategoryModel,
    ){}

    @UseGuards(AdminGuard)
    @Get('')
    getConfigurations(@Req() req: Request,  @Res() res: Response) {
        try{
            return res.status(HttpStatus.OK).json({ configurations: this.jsonPlugin.readJSON(this.file_path) });
        } catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @UseGuards(AdminGuard)
    @Post('configurations')
    /**
     * Update configurations
     * 
     * @param {Object} body - The body of the request containing the configurations
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @returns {Promise<Object>} - A promise that resolves to the updated configurations
     */
    async updateConfigurations(@Body() body: any, @Req() req: Request,  @Res() res: Response) {
        try{
            // Get amrod credentials from the configuration service
            let { credentials } = this.configService.get<any>('services.amrod'),
            // Import the file system module
            fs = require('fs');
            
            // Write the configurations to the file
            fs.writeFileSync(this.file_path,JSON.stringify(body));

            // Login to amrod
            await this.amrodService.login(credentials);

            // Fetch amrod product categories
            let categories = await this.amrodService.getCategories();  

            // Fetch amrod prices
            let prices = await this.amrodService.getPrices();   

            // Fetch amrod brands
            let brands = await this.amrodService.getBrands();  
            
            // // Fetch amrod products
            let products = await this.amrodService.getProducts();    

            // Fetch amrod stock
            let stocks = await this.amrodService.getStock();
                        
            brands = await Promise.all(
                brands.map( async ({ code, image, name}, index) => {
                    return new Promise( async resolve => setTimeout(await this.brandModel.save({ code, image, name}), (index * 1000) ));
                })
            );

            this.logger.log(JSON.stringify(brands));

            // await Promise.all([
            //     categories.map( 
            //         async ({ children, categoryName: name, categoryCode: code, categoryPath: path }) => {                
            //             let category = await this.categoryModel.save({ code, name, path});
            //             return await Promise.all([
            //                 children.map( async ({ categoryName, categoryCode, categoryPath, children: sub_children }) => {
            //                     let sub_category = await this.subCategoryModel.save({ code: categoryCode, name: categoryName, path: categoryPath, category_id: category.id });
            //                     return await Promise.all([
            //                         sub_children.map( async ({ categoryName, categoryCode, categoryPath }) => { 
            //                             return await this.childSubCategory.save({ code: categoryCode, name: categoryName, path: categoryPath, sub_category_id: sub_category.id });
            //                         })
            //                     ]);
            //                 })
            //             ])
            //         }
            //     )
            // ]);

            // await Promise.all([
            //     products.map( 
            //         async ({ fullCode: full_code, simpleCode: simple_code, price: amount, gender, images, variants, brandingTemplates: branding_templates, colourImages: colour_images, fullBrandingGuide: full_branding_guide, logo24BrandingGuide: logo_branding_guide, description, productName: name, companionCodes: companion_codes, categories }) => {
            //             let product = await this.productModel.save({ full_code, simple_code, amount, gender, branding_templates, variants, images, colour_images, companion_codes, description, full_branding_guide, logo_branding_guide, name });
            //             await Promise.all( 
            //                 categories.map( async (category) => {
            //                     let path = category.path.split('/');
            //                     if( path.length > 2 ){
            //                         try{
            //                             let stored_child_sub_category = await this.childSubCategory.findOne({ where: { path: ILike(`%${take(path,3).join('/')}%`) }});
            //                             let stored_sub_category       = await this.subCategoryModel.findOne({ id: stored_child_sub_category.sub_category_id });
            //                             console.log(stored_child_sub_category);
            //                             await this.productCategoryModel.save({ category_id: stored_sub_category.category_id, sub_category_id: stored_child_sub_category.sub_category_id, child_sub_category_id: stored_child_sub_category.id, product_id: product.id }) 
            //                         } catch(error){}
            //                     }
            //                     if( path.length == 2) {
            //                         try{
            //                             let stored_sub_category       = await this.subCategoryModel.findOne({ where: { path: ILike(`%${take(path,2).join('/')}%`)  }});
            //                             await this.productCategoryModel.save({ category_id: stored_sub_category.category_id, sub_category_id: stored_sub_category.id, product_id: product.id }) 
            //                         } catch(error){}
            //                     }
            //                     if( path.length == 1) {
            //                         try{
            //                             let stored_category = await this.categoryModel.findOne({ where: { path: ILike(`%${take(path,1).join('/')}%`)  }});
            //                             await this.productCategoryModel.save({ category_id: stored_category.id, product_id: product.id }) 
            //                         } catch(error){}
            //                     }
            //                 }
            //             ));
            //         }
            //     ),
            // ]);
            
            // await Promise.all([
            //     prices.map( async ({ fullCode: full_code, simplecode: simple_code, price: amount }) => {
            //         await this.priceModel.save({ full_code, simple_code, amount})
            //     })
            // ]);

            // await Promise.all([
            //     stocks.map( 
            //         async ({simpleCode: simple_code, fullCode: full_code, stockType: type, stock: quantity, reservedStock: reserved_quantity, incomingStock: incoming_quantity, colourCode: colour_code}) => {
            //             return await this.stockModel.save({ simple_code, full_code, type, quantity, reserved_quantity, incoming_quantity, colour_code })
            //         }
            //     )
            // ]);    

            // Return the updated configurations
            return res.status(HttpStatus.OK).json({ configurations: this.jsonPlugin.readJSON(this.file_path) });

        } catch(error) {
            this.logger.error(error);
            console.log(error);
            // Return an error response if an error occurred
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(AdminGuard)
    @Post('logout')
    async logout(@Req() req: Request,  @Res() res: Response) {
        res.status(HttpStatus.OK).json(req);
    }    

}
