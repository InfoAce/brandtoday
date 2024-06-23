import { Controller, Get, HttpException, HttpStatus, Render, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards';
import { CompanyModel } from 'src/models';

@Controller('dashboard/sidebar')
export class SidebarController {

    /**
     * The constructor for the SidebarController class.
     *
     * @param {CompanyModel} companyModel - The company model to interact with the database.
     */
    constructor(
        private readonly companyModel: CompanyModel // The company model to interact with the database
    ){}

    /**
     * Retrieves the company information and returns it as a JSON response.
     *
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @return {Promise<void>} A Promise that resolves when the response is sent.
     */
    @UseGuards(AuthGuard)
    @Get('')
    async index(@Req() req: Request,  @Res() res: Response): Promise<Response> {
        try {         
            // Get the company information from the model
            let company = await this.companyModel.first();

            // Send the company information as a JSON response with a 200 status code
            return res.status(HttpStatus.OK).json({ company });

        } catch(error) {
            // If there is an error, throw an HttpException with the error message and status
            throw new HttpException(error.status,error.message);

        }
    }   

}
