import { Controller, Get, HttpStatus, Logger, Param, Req, Res } from "@nestjs/common";
import { ProductModel } from "src/models";
import { get } from 'lodash';
import { Response } from "express";

@Controller('branding')
export class BrandingController {

    private logger = new Logger(BrandingController.name);

    constructor(
        protected productModel: ProductModel
    ) {}

    @Get(':full_code')
    async getProductBranding(
        @Param('full_code') full_code: string, // The code of the product
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            
            // Find the product with the given code
            let product: any = await this.productModel.findOne({ relations:{ branding: true }, where: { full_code: full_code }});

            // Send the product and favourite as a JSON response with a status code of 200 (OK)
            res.status(HttpStatus.OK).json({ product });

        } catch(error){

            // Log any errors that occur
            this.logger.error(error);

            res.status(error.status).json({ message: error.message })

        }
    }
}