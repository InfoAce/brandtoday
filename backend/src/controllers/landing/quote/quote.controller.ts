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
            let data          = Object({ extra_charges: Array(), items: Array(), created_at: moment().format('Do MMMM, YYYY') });
            let company       = await this.companyModel.first();

            data.currency     = company.currency;
            data.company_logo = `${this.configService.get<string>('APP_URL')}${company.logo}`;

            if( !isEmpty(user) ){
                let quote = await this.quoteModel.save({ num_id: moment().unix(), user_id: user.id});

                if( !isEmpty(form.sizes) ){
                    await Promise.all(
                        form.sizes.map( async (item) => {
                            return await this.orderItemModel.save({ ...form, size: item.name, quantity: item.quantity, quote_id: quote.id })
                        })
                    )
                }

                if( isEmpty(form.sizes) ){
                    await this.orderItemModel.save({ ...form, quote_id: quote.id });
                }

                quote = await this.quoteModel.findOne({ where: { id: quote.id } });

                data.items        = quote.items;
                data.quote_number = quote.num_id;
                data.total        = quote.items.map( item => item.quantity * item.price ).reduce( (a,c) => a + c, 0);

            }

            if( isEmpty(user) ){

                if( !isEmpty(form.sizes) ){
                    data.items = form.sizes.map( (item) => ({ ...form, size: item.name, quantity: item.quantity}))
                }

                if( isEmpty(form.sizes) ){
                    data.items.push({ ...form });
                }

                data.quote_number = moment().unix();
                data.total        = data.items.map( item => item.quantity * item.price ).reduce( (a,c) => a + c, 0)
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