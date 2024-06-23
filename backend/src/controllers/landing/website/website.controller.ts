import { Controller, Get, HttpException, HttpStatus, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { get } from 'lodash';
import { CompanyModel } from 'src/models';

@Controller('website')
export class WebsiteController {
    /**
     * Represents the controller for handling website related requests.
     * @constructor
     * @param {CompanyModel} companyModel - The company model to interact with the database.
     */
    constructor(
        private readonly companyModel: CompanyModel // The company model to interact with the database
    ){}

    /**
     * This function handles the GET request to the index page.
     * It fetches the privacy policy from the company model and returns it.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves when the privacy policy is returned in the response.
     * @throws HttpException if there is an error fetching the privacy policy.
     */
    @Get('privacy-policy')
    async privacyPolicy(@Req() req: Request,  @Res() res: Response) {
        try{

            // Fetch the privacy policy from the company model
            let { privacy_policy } = await this.companyModel.first();

            // Return the privacy policy in the response
            return res.status(HttpStatus.OK).json({ privacy_policy });

        } catch(error) {

            // Throw an HttpException with the error message and status
            throw new HttpException(error.message, error.status);
            
        }
    } 
    
    /**
     * This function handles the GET request to the terms and conditions page.
     * It fetches the terms and conditions from the company model and returns them.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves when the terms and conditions are returned in the response.
     * @throws HttpException if there is an error fetching the terms and conditions.
     */
    @Get('terms-conditions')
    async termsConditions(@Req() req: Request,  @Res() res: Response) {
        try{
            // Fetch the terms and conditions from the company model
            const { terms_conditions } = await this.companyModel.first();

            // Return the terms and conditions in the response
            return res.status(HttpStatus.OK).json({ terms_conditions });

        } catch(error) {
            // Throw an HttpException with the error message and status
            throw new HttpException(error.message, error.status);
        }
    } 
    
    /**
     * This function handles the GET request to the return and refund page.
     * It fetches the return and refund policy from the company model and returns it.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves when the return and refund policy is returned in the response.
     * @throws HttpException if there is an error fetching the return and refund policy.
     */
    @Get('return-refunds')
    async returnRefund(@Req() req: Request,  @Res() res: Response) {
        try{
            // Fetch the return and refund policy from the company model
            // We are using the 'first' method to get the first company in the database
            let { return_refunds } = await this.companyModel.first();

            // Return the return and refund policy in the response
            // We are using the HttpStatus.OK to indicate that the request was successful
            // We are using the JSON method to set the response body to the return and refund policy
            return res.status(HttpStatus.OK).json({ return_refunds });

        } catch(error) {
            // Throw an HttpException with the error message and status
            // We are using the error.message to get the error message and error.status to get the error status
            throw new HttpException(error.message, error.status);
        }
    }    

}
