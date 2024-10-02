import { Body, Controller, Get, HttpStatus, Inject, Injectable, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CategoryModel, CompanyModel } from 'src/models';

@Controller({
  version: '1',
  path: 'header'
})
export class HeaderController {

    private readonly logger = new Logger(HeaderController.name);

    /**
     * Constructor for the HeaderController.
     *
     * @param {CategoryModel} categoryModel - The category model to interact with the database.
     * @param {CompanyModel} companyModel - The company model to interact with the database.
     */
    constructor(
      private categoryModel: CategoryModel,  // The category model to interact with the database.
      private companyModel:  CompanyModel,   // The company model to interact with the database.
    ){}

    /**
     * Retrieves all categories and the first company from the database and responds with a JSON object containing
     * the categories and the company.
     * 
     * @param {Request}  req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>} - A promise that resolves when the response has been sent.
     */
    @Get('')
    async index(@Req() req: Request,  @Res() res: Response): Promise<void> {
        try {
            // Retrieve all categories from the database
            let categories = await this.categoryModel.find({ cache: true, relations:{ sub_categories: true } });

            // Retrieve the first company from the database
            let company = await this.companyModel.first();

            // Send the categories and company as a JSON response with a 200 status code
            res.status(HttpStatus.OK).json({ categories, company });
        } catch(error) {
            // Log any errors that occur during the process
            this.logger.error(error);
        }
    }    
}
