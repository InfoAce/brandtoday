import { Body, Controller, HttpStatus, Logger, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { OptionalGuard } from "src/guards";
import { CreateQuoteValidation } from "src/validation";
import { get, isEmpty, isNull, has, pick } from 'lodash';
import * as moment from 'moment';
import { CompanyModel, OrderItemModel, QuoteModel } from "src/models";
import { resolve } from 'path';
import { ConfigService } from "@nestjs/config";
import { MailService } from "src/services";
import puppeteer from 'puppeteer';

@Controller('quotes')
export class QuoteController {

    private logger = new Logger(QuoteController.name);

    constructor(
        private configService: ConfigService,
        private companyModel:  CompanyModel,
        private mailService:   MailService,
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
            let pug           = require('pug');
            let data          = Object({ extra_charges: Array(), items: form.items, created_at: moment().format('Do MMMM, YYYY') });
            let company       = await this.companyModel.first();

            data.currency        = company.currency;
            data.company_logo    = `${this.configService.get<string>('APP_URL')}${company.logo}`;
            data.company_address = company.address;
            data.company_name    = company.name;
            data.company_phone   = company.phone_number;
            data.total           = form.items.map( item => item.total_amount ).reduce( (a,c) => a + c, 0)
            data.quote_number    = moment().unix();
            data.customer_name   = form.name;

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

            let browser = await puppeteer.launch();
            let page    = await browser.newPage();

            await page.setContent(pug.renderFile(resolve(process.cwd(), "views/emails/quote/create.pug"),data));

            let pdf     = await page.pdf();

            await this.mailService.emailQuote({
                 email: form.email, 
                 attachments: [{ 
                    filename: `quotation-${data.quote_number}.pdf`, 
                    content:  Buffer.from(pdf)
                }],
                context: pick(data,['company_logo','company_name','company_address','company_phone','customer_name'])
            });

            return res.status(HttpStatus.OK).json({});

        } catch (error) {

            // Log any errors that occur
            this.logger.error(error);

            return res.status(error.status).json({});
        }
    }
}