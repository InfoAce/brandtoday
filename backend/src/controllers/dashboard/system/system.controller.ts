import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { RegisterValidation } from 'src/validation';
import { CompanyModel, RoleModel, UserModel } from 'src/models';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { isEmpty, isNull } from 'lodash';
import { sep } from 'path';

@Controller('dashboard/system')
export class SystemController {

    private readonly file_path = `${process.cwd()}${sep}configurations.json`;

    private jsonPlugin = require('json-reader-writer');

    constructor(
        private amrodService: AmrodService,
        private configService: ConfigService,
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
    updateConfigurations(@Body() body: any, @Req() req: Request,  @Res() res: Response) {
        try{
            // Get amrod credentials from the configuration service
            let { credentials } = this.configService.get<any>('services.amrod'),
                // Import the file system module
                fs = require('fs');
            
            // Write the configurations to the file
            fs.writeFileSync(this.file_path,JSON.stringify(body));

            // Login to amrod
            this.amrodService
                .login(credentials)
                .then( async() => {
        
                    // Fetch amrod product categories
                    let categories = await this.amrodService.getCategories();  
        
                    // Fetch amrod prices
                    let prices = await this.amrodService.getPrices();   
        
                    // Fetch amrod brands
                    let brands = await this.amrodService.getBrands();  
                    
                    // Fetch amrod products
                    let products = await this.amrodService.getProducts();    

                    // Fetch amrod stock
                    let stock = await this.amrodService.getStock();  
                    
                    // Write the amrod brands to a json file
                    await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}brands.json`,JSON.stringify(brands));
                    
                    // Write the amrod categories to a json file
                    await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}categories.json`,JSON.stringify(categories));
                    
                    // Write the amrod prices to a json file
                    await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}prices.json`,JSON.stringify(prices));
        
                    // Write the amrod products to a json file
                    await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}products.json`,JSON.stringify(products));

                    // Write the amrod stock to a json file
                    await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}stock.json`,JSON.stringify(stock));

                });

            // Return the updated configurations
            return res.status(HttpStatus.OK).json({ configurations: this.jsonPlugin.readJSON(this.file_path) });

        } catch(err) {
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
