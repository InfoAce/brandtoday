import { Body, Controller, Get, HttpException, HttpStatus, Put, Render, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards';
import { QueueInterceptor } from 'src/interceptors';
import { CompanyModel, QueueModel } from 'src/models';
import { get } from 'lodash';
import { UpdateQueueValidation } from 'src/validation';

@Controller('dashboard/queues')
export class QueueController {

    /**
     * The constructor for the QueueController class.
     *
     * @param {QueueModel} queueModel - The queue model to interact with the database.
     * @description
     * This class is responsible for handling the queue related requests.
     * The constructor injects the queue model which is used to interact with the database.
     */
    constructor(
        private readonly queueModel: QueueModel // The company model to interact with the database
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
    async index(
        @Req() req: Request,  
        @Res() res: Response
    ): Promise<Response> {
        try {         
            // Get the company information from the model
            let queues = await this.queueModel.find();

            // Send the company information as a JSON response with a 200 status code
            return res.status(HttpStatus.OK).json({ queues });

        } catch(error) {
            // If there is an error, throw an HttpException with the error message and status
            throw new HttpException(error.status,error.message);

        }
    } 
    
    /**
     * Retrieves the company information and returns it as a JSON response.
     *
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @return {Promise<void>} A Promise that resolves when the response is sent.
     */
    @UseGuards(AuthGuard)
    @UseInterceptors(QueueInterceptor)
    @Put(':id/update')
    async update(
        @Body() body: UpdateQueueValidation,
        @Req()  req: Request,  
        @Res()  res: Response
    ): Promise<Response> {
        try {         
            // Get the company information from the model
            let queue = get(req,'queue');

            // Update the company information in the model
            await this.queueModel.updateOne({ id: queue.id }, { ...body });

            // Get the company information from the model
            queue = await this.queueModel.findOne({ where: { id: queue.id } });

            // Send the company information as a JSON response with a 200 status code
            return res.status(HttpStatus.OK).json({ queue });

        } catch(error) {
            // If there is an error, throw an HttpException with the error message and status
            throw new HttpException(error.status,error.message);

        }
    } 

    /**
     * Retrieves the company information and returns it as a JSON response.
     *
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @return {Promise<void>} A Promise that resolves when the response is sent.
     */
    @UseGuards(AuthGuard)
    @UseInterceptors(QueueInterceptor)
    @Put(':id')
    async show(
        @Req()  req: Request,  
        @Res()  res: Response
    ): Promise<Response> {
        try {         
            // Get the queue information from the request object
            let queue = get(req,'queue');

            // Send the queue information as a JSON response with a 200 status code
            return res.status(HttpStatus.OK).json({ queue });

        } catch(error) {
            // If there is an error, throw an HttpException with the error message and status
            throw new HttpException(error.status,error.message);

        }
    } 

}
