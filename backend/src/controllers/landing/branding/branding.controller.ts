import { Controller, Get, HttpStatus, Logger, Param, Post, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ProductModel } from "src/models";
import { get } from 'lodash';
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

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

    @Post('upload')
    @UseInterceptors(
        FileInterceptor(
            'file',
            {
                storage: diskStorage({
                    destination: './public/documents',
                    filename: (req, file, cb) => {
                        let uniqueSuffix = Date.now();
                        let ext          = file.mimetype.split('/');
                        cb(null, `${uniqueSuffix}.${ext[1]}`);
                    },
                }),
            }
        )
    )
    uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request,  @Res() res: Response) {
        try {
            // Return the uploaded file as a JSON response with a status code of 200
            return res.status(HttpStatus.OK).json({ location:`/documents/${file.filename}`});
        } catch(error) {
            // Log any errors that occur
            this.logger.error(error);
        }
    }
}