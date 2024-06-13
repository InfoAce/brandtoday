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
    updateConfigurations(@Body() body: any, @Req() req: Request,  @Res() res: Response) {
        try{
            let { credentials } = this.configService.get<any>('services.amrod'), fs = require('fs');
            
            fs.writeFileSync(this.file_path,JSON.stringify(body));

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

                    // Fetch amrod prices
                    let stock = await this.amrodService.getStock();  
                    
                    await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}brands.json`,JSON.stringify(brands));
                    
                    await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}categories.json`,JSON.stringify(categories));
                    
                    await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}prices.json`,JSON.stringify(prices));
        
                    await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}products.json`,JSON.stringify(products));

                    await fs.writeFileSync(`${process.cwd()}${sep}public${sep}amrod${sep}stock.json`,JSON.stringify(stock));

                });

            return res.status(HttpStatus.OK).json({ configurations: this.jsonPlugin.readJSON(this.file_path) });
            
        } catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(AdminGuard)
    @Post('logout')
    async logout(@Req() req: Request,  @Res() res: Response) {
        res.status(HttpStatus.OK).json(req);
    }    

}
