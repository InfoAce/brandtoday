import { Body, Controller, Get, HttpStatus, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { RegisterValidation } from 'src/validation';
import { BrandModel, CategoryModel, ChildSubCategoryModel, CompanyModel, PriceModel, ProductCategoryModel, ProductModel, RoleModel, StockKeepingModel, SubCategoryModel, UserModel } from 'src/models';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { chunk, isEmpty, isNull, has, keys, take } from 'lodash';
import { sep } from 'path';
import StockModel from 'src/models/stock.model';
import { ILike } from 'typeorm';
import { delay } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import ProductVairantModel from 'src/models/product-variant.model';

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
        private productVariantModel:  ProductVairantModel,
        private stockModel:           StockModel,
        private stockKeepingModel:    StockKeepingModel,
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
            let categories = (await this.amrodService.getCategories()).map( category => ({ ...category, id: uuidv4() }));  

            // Fetch amrod prices
            let prices = await this.amrodService.getPrices();   

            // Fetch amrod brands
            let brands = await this.amrodService.getBrands();  
            
            // // // Fetch amrod products
            let products = (await this.amrodService.getProducts()).map( product => ({ ...product, id: uuidv4() }));    

            // // Fetch amrod stock
            let stocks = (await this.amrodService.getStock()).map( stock => ({ ...stock, id: uuidv4() }));  ;

            let sub_categories      = categories.map( category => category.children.map( sub_category => ({ ...sub_category, id: uuidv4(), category_id: category.id, children: sub_category.children }) ) ).flat();

            let child_sub_categories = sub_categories.map( sub_category => sub_category.children.map( child_sub_category => ({ ...child_sub_category, id: uuidv4(), sub_category_id: sub_category.id }) ) ).flat();

            let product_categories  = products.map( 
                product => product.categories.map( 
                    category => {
                        let path = category.path.split('/');
                        if( path.length > 2) {
                            let fetched_sub_category       = sub_categories.find( fetched_sub_category => fetched_sub_category.categoryPath == take(path,2).join('/') );
                            let fetched_child_sub_category = child_sub_categories.find( fetched_child_sub_category => fetched_child_sub_category.categoryPath == take(path,3).join('/') );
                            return { 
                                id: uuidv4(), 
                                category_id:           fetched_sub_category.category_id, 
                                sub_category_id:       fetched_child_sub_category.sub_category_id, 
                                child_sub_category_id: fetched_child_sub_category.id, 
                                product_id:   product.id 
                            }
                        }
                        if( path.length == 2) {
                            let fetched_sub_category = sub_categories.find( fetched_sub_category => fetched_sub_category.categoryPath == take(path,2).join('/') );
                            return {  
                                id: uuidv4(), 
                                category_id: fetched_sub_category.category_id, 
                                sub_category_id: fetched_sub_category.id, 
                                product_id:   product.id 
                            }
                        }
                        if( path.length == 1) {
                            let fetched_category = categories.find( fetched_category => fetched_category.categoryPath == take(path,1).join('/') );
                            return { id: uuidv4(), category_id: fetched_category.id, product_id: product.id }
                        }
                    }
                ) 
            ).flat();

            let variants = products.map( product => product.variants.map( variant => ({ ...variant, id: uuidv4(), product_id: product.id }) ) ).flat();

            await this.categoryModel.insert(categories.map( ({categoryName: name, categoryCode: code, categoryPath: path, id }) => ({ id, code, name, path}) ))

            await this.subCategoryModel.insert(sub_categories.map( ({categoryName: name, categoryCode: code, categoryPath: path, id, category_id }) => ({ id, category_id, code, name, path}) ))

            await this.childSubCategory.insert(child_sub_categories.map( ({categoryName: name, categoryCode: code, categoryPath: path, id, sub_category_id }) => ({ id, sub_category_id, code, name, path}) ))
                       
            await this.brandModel.insert(brands.map( ({ code, image, name}) => ({ code, name, image })));

            
            await Promise.all(
                chunk(products,1000).map( async (products) => {
                    await this.productModel.insert(
                        products.map( 
                            ({ id, fullCode: full_code, simpleCode: simple_code, price: amount, gender, images, variants, brandingTemplates: branding_templates, colourImages: colour_images, fullBrandingGuide: full_branding_guide, logo24BrandingGuide: logo_branding_guide, description, productName: name, companionCodes: companion_codes }) => 
                                ({ id, full_code, simple_code, amount, gender, branding_templates, variants, images, colour_images, companion_codes, description, full_branding_guide, logo_branding_guide, name }) 
                        )
                    );
                })
            )


            await this.productCategoryModel.insert( product_categories.map( (product_category) => product_category ) );

            await this.productVariantModel.insert( 
                variants.map( (variant, index) => { 
                        return { 
                            id:                      variant.id, 
                            product_id:              variant.product_id, 
                            simple_code:             variant.simpleCode, 
                            full_code:               variant.fullCode, 
                            code_colour:             variant.codeColour, 
                            code_colour_name:        variant.codeColourName, 
                            code_size:               variant.codeSize, 
                            code_size_name:          variant.codeSizeName, 
                            categorized_attribute:   variant.categorisedAttribute, 
                            packaging_and_dimension: variant.packagingAndDimension, 
                            product_dimension:       variant.productDimension, 
                            is_logo_24:              variant.isLogo24, 
                            components:              variant.components 
                        }
                    }
                ) 
            );

            await this.priceModel.insert( 
                prices.map( ({ fullCode: full_code, simplecode: simple_code, price: amount }) => {
                    let variant = variants.find( variant => variant.fullCode == full_code );
                    return { full_code, simple_code, amount, variant_id: variant.id };
                })
            );

            await this.stockModel.insert( 
                stocks.map( 
                    ({simpleCode: simple_code, fullCode: full_code, stockType: type, stock: quantity, reservedStock: reserved_quantity, incomingStock: incoming_quantity, colourCode: colour_code, id}) => {
                        return { id, simple_code, full_code, type, quantity, reserved_quantity, incoming_quantity, colour_code }
                    }
                )
            );

            await Promise.all(
                chunk(
                    stocks.map( 
                        ({fullCode: full_code, id}) => {
                            let variant = variants.find( variant => variant.fullCode == full_code );
                            let product = products.find( product => product.fullCode == full_code );
                            if( !isEmpty(variant)){
                                return  { stock_id: id, variant_id: variant.id };
                            } else {
                                if( !isEmpty(product) ){
                                    return { stock_id: id, product_id: product.id }
                                }
                                return {}
                            }
                        }
                    ).filter( stock => !isEmpty(stock) ),
                    1000
                ).map( async (stock_keeping) => {
                    return await this.stockKeepingModel.insert(stock_keeping);
                })
            );

            // Return the updated configurations
            return res.status(HttpStatus.OK).json({ configurations: this.jsonPlugin.readJSON(this.file_path) });

        } catch(error) {

            if( has(error,'applicationRef') ){
                let { response: { status, data } } = error.applicationRef;

                // Return an error response if an error occurred
                return res.status(status).json(data);
            }

        }
    }

    @UseGuards(AdminGuard)
    @Post('logout')
    async logout(@Req() req: Request,  @Res() res: Response) {
        res.status(HttpStatus.OK).json(req);
    }    

}
