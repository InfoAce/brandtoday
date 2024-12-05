import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { OptionalGuard } from "src/guards";
import { CreateQuoteValidation } from "src/validation";
import { get, isEmpty, isNull, has } from 'lodash';
import * as moment from 'moment';
import { CompanyModel, OrderItemModel, QuoteModel } from "src/models";
import { resolve } from 'path';
import { ConfigService } from "@nestjs/config";

@Controller('quotes')
export class QuoteController {

    constructor(
        private configService: ConfigService,
        private companyModel:   CompanyModel,
        private orderItemModel: OrderItemModel, // The order model instance.
        private quoteModel: QuoteModel, // The order model instance.
    ){}

    @UseGuards(OptionalGuard)
    @Post('')
    async store(
        @Body() form: CreateQuoteValidation,
        @Res()  res: Response,
        @Req()  req: Request
    ){
        try {

            let user          = get(req,'user');
            let html_to_pdf   = require('html-pdf-node');
            let pug           = require('pug');
            let data          = Object({ extra_charges: Array(), items: form.items, created_at: moment().format('Do MMMM, YYYY') });
            let company       = await this.companyModel.first();

            data.currency     = company.currency;
            data.company_logo = `${this.configService.get<string>('APP_URL')}${company.logo}`;
            data.total        = form.items.map( item => item.total_amount ).reduce( (a,c) => a + c, 0)
            data.quote_number = moment().unix();

            if( !isEmpty(user) ){
                let quote = await this.quoteModel.save({ num_id: data.quote_number, user_id: user.id});

                // if( !isEmpty(form.sizes) ){
                //     await Promise.all(
                //         form.sizes.map( async (item) => {
                //             return await this.orderItemModel.save({ ...form, size: item.name, quantity: item.quantity, quote_id: quote.id })
                //         })
                //     )
                // }

                // if( isEmpty(form.sizes) ){
                //     await this.orderItemModel.save({ ...form, quote_id: quote.id });
                // }

                // quote = await this.quoteModel.findOne({ where: { id: quote.id } });

            }

            if( !isNull(company.service_fees) ){
                data.extra_charges = company.service_fees.map( service => ({ name: service.name, amount: service.type == 'percentage' ? (data.total * service.amount) / 100 : service.amount }) );
            }

            let pdf = await html_to_pdf.generatePdf({ 
                content: pug.renderFile(resolve(process.cwd(), "views/emails/quote/create.pug"),data)
            },{ format: 'A4' })

            return res.status(HttpStatus.OK).json({ pdf: pdf.toString('base64') });

        } catch (error) {

            console.log(error);
        }
    }
}