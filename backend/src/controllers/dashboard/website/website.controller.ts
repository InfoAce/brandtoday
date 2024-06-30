import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Injectable, Logger, Param, ParseIntPipe, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { Request, Response } from "express";
import { AdminGuard, AuthGuard } from "src/guards";
import { CompanyModel, RoleModel, UserModel } from "src/models";
import { cloneDeep, get, isEmpty, isNull, has, set } from 'lodash';
import { CreateBannerValidation, StaffValidation, UpdateBannerValidation, UpdatePrivacyPolicyValidation, UpdateTermsAndConditionsValidation } from "src/validation";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { UpdateReturnRefundsValidation } from "src/validation/website/update.return-refunds.validation";
import { UpdateFaqsValidation } from "src/validation/website/update.faqs.validation";
import { UpdateAboutUsValidation } from "src/validation/website/update.about-us.validation";

@Injectable()
@Controller('dashboard/website')
export class WebsiteController {

    private logger = new Logger(WebsiteController.name);

    /**
     * The constructor for the WebsiteController class.
     *
     * @param configService - The config service to access configuration settings.
     * @param companyModel - The company model to interact with the database.
     */
    constructor(
        private readonly configService: ConfigService, // The config service to access configuration settings.
        private readonly companyModel: CompanyModel // The company model to interact with the database.
    ) { }

    /**
     * Fetch company details for the authenticated user
     *
     * @param req - The request object
     * @param res - The response object
     * @returns The company details of the authenticated user as a JSON response with a 200 status code
     */
    @UseGuards(AdminGuard)
    @Get('')
    async get(
        @Req() req: Request, // The request object
        @Res() res: Response, // The response object
    ) {
        try {
            // Fetch the company details for the authenticated user from the database
            let company = await this.companyModel.findOne({ id: get(req,'user').company_id });

            // Return the company details as a JSON response with a 200 status code
            return res.status(HttpStatus.OK).json({ company });
        } catch (error) {
            // Log any errors that occur
            this.logger.error(error);  
        }
    }

    @UseGuards(AdminGuard)
    @Post('banner')
    /**
     * Store a banner for the company
     *
     * @param data - The banner data containing the path and title
     * @param req - The request object
     * @param res - The response object
     * @returns The response with a status code of 200 if successful
     */
    @UseGuards(AdminGuard)
    @Post('banner')
    async store(
        @Body() data: CreateBannerValidation,
        @Req()  req:  Request,
        @Res()  res:  Response,
    ) {
        try{   
            // Get the authenticated user from the request
            let user = get(req,'user');
            let banners = Array();

            // Append the base URL to the banner path
            data.path = `${this.configService.get('APP_URL')}/${data.path}`

            // Get the existing banners for the company (if any)
            if( !isNull(user.company.banners) ){
                banners = user.company.banners;
            }
            
            // Add the new banner to the list of banners
            banners.push(data);

            // Save the updated list of banners for the company
            await this.companyModel.save({ id: user.company.id, banners });

            // Return the response with a status code of 200
            return res.status(HttpStatus.OK).json();

        } catch(error) {
            // Log any errors that occur
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
    /**
     * Uploads an icon file for the company
     * @param file - The uploaded file
     * @param req - The request object
     * @param res - The response object
     * @returns A Promise that resolves to the uploaded file object
     */
    async uploadIcon(@UploadedFile() file: Express.Multer.File, @Req() req: Request,  @Res() res: Response) {

        try {
            // Return the uploaded file as a JSON response with a status code of 200
            return res.status(HttpStatus.OK).json({file});

        } catch(err) {
            // Log any errors that occur
            this.logger.error(err);
        }
    }

    /**
     * Update company banner images
     * @param data - The updated banner images for the company
     * @param req - The request object
     * @param res - The response object
     * @returns A Promise that resolves to the updated company object
     */
    @UseGuards(AdminGuard)
    @Put('banner')
    async delete(
        @Body() data: UpdateBannerValidation,
        @Req()  req:  Request,
        @Res()  res:  Response,
    ) { 
        
        try {    
            // Update the company's banner images and save the changes
            let company = await this.companyModel.save({ id: get(req,'user').company_idd, banners: get(data,'banners') });

            // Return the updated company object
            return res.status(HttpStatus.OK).json({ company });

        } catch(error) {

            // Log any errors that occur
            this.logger.error(error);

        }
    }

    /**
     * Update company privacy policy
     * @param {UpdatePrivacyPolicyValidation} data - The updated privacy policy for the company
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @returns {Promise<Object>} A Promise that resolves to the updated company object
     */
    @UseGuards(AdminGuard)
    @Put('privacy')
    async updatePrivacy(
        @Body() { privacy_policy }: UpdatePrivacyPolicyValidation,
        @Req()  req:  Request,
        @Res()  res:  Response,
    ) { 
        try {
            // Update the company's privacy policy and save the changes
            let company = await this.companyModel.save({ id: get(req,'user').company_id, privacy_policy });

            // Return the updated company object
            return res.status(HttpStatus.OK).json({ company });

        } catch(error) {
            // Log any errors that occur
            this.logger.error(error);
        }
    }

    /**
     * Update company privacy policy
     * @param {UpdatePrivacyPolicyValidation} data - The updated privacy policy for the company
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @returns {Promise<Object>} A Promise that resolves to the updated company object
     */
    @UseGuards(AdminGuard)
    @Put('about_us')
    async updateAboutUs(
        @Body() { about_us }: UpdateAboutUsValidation,
        @Req()  req:  Request,
        @Res()  res:  Response,
    ) { 
        try {
            // Update the company's privacy policy and save the changes
            let company = await this.companyModel.save({ id: get(req,'user').company_id, about_us });

            // Return the updated company object
            return res.status(HttpStatus.OK).json({ company });

        } catch(error) {
            // Log any errors that occur
            this.logger.error(error);
        }
    }
    
    /**
     * Update company privacy policy
     * @param {UpdatePrivacyPolicyValidation} data - The updated privacy policy for the company
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @returns {Promise<Object>} A Promise that resolves to the updated company object
     */
    @UseGuards(AdminGuard)
    @Put('faqs')
    async updateFaqs(
        @Body() { faqs }: UpdateFaqsValidation,
        @Req()  req:  Request,
        @Res()  res:  Response,
    ) { 
        try {
            // Update the company's privacy policy and save the changes
            let company = await this.companyModel.save({ id: get(req,'user').company_id, faqs });

            // Return the updated company object
            return res.status(HttpStatus.OK).json({ company });

        } catch(error) {
            // Log any errors that occur
            this.logger.error(error);
        }
    }
    
    /**
     * Update company privacy policy
     * @param {UpdatePrivacyPolicyValidation} data - The updated privacy policy for the company
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @returns {Promise<Object>} A Promise that resolves to the updated company object
     */
    @UseGuards(AdminGuard)
    @Put('return_refunds')
    async updateReturnRefunds(
        @Body() { return_refunds }: UpdateReturnRefundsValidation,
        @Req()  req:  Request,
        @Res()  res:  Response,
    ) { 
        try {
            // Update the company's privacy policy and save the changes
            let company = await this.companyModel.save({ id: get(req,'user').company_id, return_refunds });

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
            // Update the company's terms and conditions and save the changes
            let company = await this.companyModel.save({ id: get(req,'user').company_id, terms_conditions });

            // Return the updated company object
            return res.status(HttpStatus.OK).json({ company });

        } catch(error) {

            // Log any errors that occur
            this.logger.error(error);

        }
    }

}