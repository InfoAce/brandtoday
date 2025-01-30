import { Body, Controller, Get, HttpStatus, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../../guards';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { has } from 'lodash';
import { sep } from 'path';

@Controller('dashboard/system')
export class SystemController {

    private readonly logger = new Logger(SystemController.name);

    private readonly file_path = `${process.cwd()}${sep}config.json`;

    private jsonPlugin         = require('json-reader-writer');

    constructor(
        private configService:        ConfigService,
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
    /**
     * Update configurations
     * 
     * @param {Object} body - The body of the request containing the configurations
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @returns {Promise<Object>} - A promise that resolves to the updated configurations
     */
    async updateConfigurations(@Body() body: any, @Req() req: Request,  @Res() res: Response) {
        try{
            // Get amrod credentials from the configuration service
            let { credentials } = this.configService.get<any>('services.amrod'),
            // Import the file system module
            fs = require('fs');
            
            // Write the configurations to the file
            fs.writeFileSync(this.file_path,JSON.stringify(body));

            // Return the updated configurations
            return res.status(HttpStatus.OK).json({ configurations: this.jsonPlugin.readJSON(this.file_path) });

        } catch(error) {

            if( has(error,'applicationRef') ){
                let { response: { status, data } } = error.applicationRef;

                // Return an error response if an error occurred
                return res.status(status).json(data);
            }

        }
    }

    @UseGuards(AdminGuard)
    @Post('logout')
    async logout(@Req() req: Request,  @Res() res: Response) {
        res.status(HttpStatus.OK).json(req);
    }    

}
