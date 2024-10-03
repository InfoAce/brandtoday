import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Param, ParseIntPipe, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AdminGuard } from "src/guards";
import { CategoryModel } from "src/models";
import { CategoryUpdateValidation } from "src/validation";

@Controller('dashboard/categories')
export class CategoryController {
    constructor(
        private readonly categoryModel: CategoryModel
    ){}

    @UseGuards(AdminGuard)
    @Get('')
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) queryPage: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) queryPerPage: number = 10,
        @Res() res: Response
    ) {
        try {
            let [categories, count]: any = await this.categoryModel.findAndCount({ take: queryPerPage, skip: (queryPage - 1) * queryPerPage, relations:{ sub_categories: true }  });

            return res.status(HttpStatus.OK).json({ categories, count});

        } catch(error) {
            return res.status(error.status).json({ error: error.message });
        }
    } 

    @UseGuards(AdminGuard)
    @Put(':id')
    /**
     * Get a category by its ID
     *
     * @param {number} id The ID of the category to fetch
     * @param {Response} res The response object
     * @param {Request} req The request object
     * @return {Promise<void>}
     */
    async show(
        @Param('id') id: string,
        @Res() res: Response,
        @Req() req: Request
    ) {
        try {
            // Fetch the category with the specified ID
            let category: any = await this.categoryModel.findOne({ where: { id } });

            // Return the fetched category as a JSON response with a 200 status code
            return res.status(HttpStatus.OK).json({ category });
        } catch(error) {
            // Log the error and return a JSON response with the appropriate status code
            return res.status(error.status).json({ error: error.message });
        }
    } 

    @UseGuards(AdminGuard)
    @Put(':id/update')
    /**
     * Get a category by its ID
     *
     * @param {number} id The ID of the category to fetch
     * @param {Response} res The response object
     * @param {Request} req The request object
     * @return {Promise<void>}
     */
    async update(
        @Body()      body: CategoryUpdateValidation,
        @Param('id') id: string,
        @Res()       res: Response,
    ) {
        try {
            // Fetch the category with the specified ID
            let category: any = await this.categoryModel.update(id,body);

            // Return the fetched category as a JSON response with a 200 status code
            return res.status(HttpStatus.OK).json({ category });
        } catch(error) {
            // Log the error and return a JSON response with the appropriate status code
            return res.status(error.status).json({ error: error.message });
        }
    } 

}   