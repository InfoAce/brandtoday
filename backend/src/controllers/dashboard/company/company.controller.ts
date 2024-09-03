import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminGuard } from '../../../guards';
import { Request, Response } from 'express';
import { CompanyModel } from 'src/models';
import { get, pick } from 'lodash';
import { UpdateCompanyValidation } from 'src/validation';

@Controller('dashboard/company')
export class CompanyController {


    constructor(
        private readonly companyModel: CompanyModel
    ){}

    @UseGuards(AdminGuard)
    @Get('')
    async get(@Req() req: Request,  @Res() res: Response) {
        try{

            let company = await this.companyModel.findOne({ id: get(req,'user').company_id });

            res.status(HttpStatus.OK).json({ company: pick(company,['id','name','address','logo','white_logo','icon','email','phone_number']) });

        } catch(error) {

            throw new HttpException(error.status,error.message);

        }
    }


    @UseGuards(AdminGuard)
    @Put(':id/update')
    async update(
        @Param('id') companyId: string,
        @Body() body: UpdateCompanyValidation,
        @Req()  req:  Request,  
        @Res()  res:  Response
    ) {
        try{

            await this.companyModel.save({ id: companyId, ...body });

            let company = await this.companyModel.findOne({ id: get(req,'user').company_id });

            res.status(HttpStatus.OK).json({ company });
            
        } catch(error) {

            throw new HttpException(error.status,error.message);

        }
    }

}
