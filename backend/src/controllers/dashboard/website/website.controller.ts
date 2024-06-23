import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Injectable, Logger, Param, ParseIntPipe, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { Request, Response } from "express";
import { AdminGuard, AuthGuard } from "src/guards";
import { CompanyModel, RoleModel, UserModel } from "src/models";
import { cloneDeep, get, isEmpty, isNull, has, set } from 'lodash';
import { CreateBannerValidation, StaffValidation, UpdateBannerValidation, UpdatePrivacyPolicyValidation, UpdateTermsAndConditionsValidation } from "src/validation";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Injectable()
@Controller('dashboard/website')
export class WebsiteController {

    private logger = new Logger(WebsiteController.name);

    constructor(
        private configService: ConfigService,
        private companyModel: CompanyModel,
    ){}

    /**
     * Fetch company details 
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    @UseGuards(AdminGuard)
    @Get('')
    async get(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try{    
            let user  = get(req,'user');
            return res.status(HttpStatus.OK).json({ company: user.company });
        } catch(error) {
            this.logger.error(error);    
        }
    }

    @UseGuards(AdminGuard)
    @Post('banner')
    async store(
        @Body() data: CreateBannerValidation,
        @Req()  req:  Request,
        @Res()  res:  Response,
    ) {
        try{    

            let user    = get(req,'user');
            let banners = Array();

            data.path   = `${this.configService.get('APP_URL')}/${data.path}`

            if( !isNull(user.company.banners) ){
                banners = user.company.banners;
            }
            
            banners.push(data);
            
            await this.companyModel.save({ id: user.company.id, banners });

            return res.status(HttpStatus.OK).json();

        } catch(error) {
            
            this.logger.error(error);
        
        }
    }

    @UseGuards(AdminGuard)
    @Post('upload')
    @UseInterceptors(
        FileInterceptor(
            'file',
            {
                storage: diskStorage({
                    destination: './public/images',
                    filename: (req, file, cb) => {
                        let uniqueSuffix = Date.now();
                        let ext          = file.mimetype.split('/');
                        cb(null, `${uniqueSuffix}.${ext[1]}`);
                      },
                }),
            }
        )
    )
    async uploadIcon(@UploadedFile() file: Express.Multer.File, @Req() req: Request,  @Res() res: Response) {

        try {
                        
            return res.status(HttpStatus.OK).json({file});

        } catch(err) {

            this.logger.error(err);

        }
    }

    /**
     * Update company banner images
     * @param req 
     * @param res 
     */
    @UseGuards(AdminGuard)
    @Put('banner')
    async delete(
        @Body() data: UpdateBannerValidation,
        @Req()  req:  Request,
        @Res()  res:  Response,
    ) { 
        
        try {

            let user    = get(req,'user');            
            let company = await this.companyModel.save({ id: user.company.id, banners: get(data,'banners') });

            return res.status(HttpStatus.OK).json({ company });

        } catch(error) {

            this.logger.error(error);

        }
    }

    /**
     * Update company privacy policy
     * @param req 
     * @param res 
     */
    @UseGuards(AdminGuard)
    @Put('privacy')
    /**
     * Update company privacy policy
     * @param req 
     * @param res 
     */
    @UseGuards(AdminGuard)
    @Put('privacy')
    async updatePrivacy(
        @Body() { privacy_policy }: UpdatePrivacyPolicyValidation,
        @Req()  req:  Request,
        @Res()  res:  Response,
    ) { 
        /**
         * Update company privacy policy
         * @param privacy_policy - The new privacy policy of the company
         * @param req - The request object
         * @param res - The response object
         * @returns A Promise that resolves to the updated company object
         */
        try {

            // Get the authenticated user from the request
            let user    = get(req,'user');           

            // Update the company's privacy policy and save the changes
            let company = await this.companyModel.save({ id: user.company.id, privacy_policy });

            // Return the updated company object
            return res.status(HttpStatus.OK).json({ company });

        } catch(error) {

            // Log any errors that occur
            this.logger.error(error);

        }
    }

    /**
     * Update company terms and conditions
     * @param req 
     * @param res 
     */
    @UseGuards(AdminGuard)
    @Put('terms')
    /**
     * Update company terms and conditions
     * @param req - The request object
     * @param res - The response object
     * @param {UpdateTermsAndConditionsValidation} body - The terms and conditions to update
     * @returns A Promise that resolves to the updated company object
     */
    @UseGuards(AdminGuard)
    @Put('terms')
    async updateTerms(
        @Body() { terms_conditions }: UpdateTermsAndConditionsValidation,
        @Req()  req:  Request,
        @Res()  res:  Response,
    ) { 
        /**
         * Updates the company terms and conditions
         * @returns A Promise that resolves to the updated company object
         */
        try {

            // Get the authenticated user from the request
            let user    = get(req,'user');           

            // Update the company's terms and conditions and save the changes
            let company = await this.companyModel.save({ id: user.company.id, terms_conditions });

            // Return the updated company object
            return res.status(HttpStatus.OK).json({ company });

        } catch(error) {

            // Log any errors that occur
            this.logger.error(error);

        }
    }

}