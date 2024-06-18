import { Body, Controller, Get, HttpStatus, Inject, Injectable, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../guards';
import { Request, Response } from 'express';
import { AmrodService, AuthService, MailService } from 'src/services';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { isEmpty } from 'lodash';
import { CompanyModel } from 'src/models';
import { sep } from 'path';

@Controller({
  version: '1',
  path: 'header'
})
export class HeaderController {

    private amrod_categories   = Array();

    private readonly file_path = `${process.cwd()}${sep}public${sep}amrod${sep}categories.json`;

    private readonly logger = new Logger(HeaderController.name);

    private jsonPlugin      = require('json-reader-writer');

    constructor(
      private amrodService: AmrodService,
      private companyModel: CompanyModel,
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){      
      try {
        this.amrod_categories = this.jsonPlugin.readJSON(this.file_path);
      } catch(error){
        this.amrod_categories = [];
      }
    }

    @Get('')
    async index(@Req() req: Request,  @Res() res: Response) {
 
      try {
        
        let company           = await this.companyModel.first();

        res.status(HttpStatus.OK).json({ categories: this.amrod_categories, company });

      } catch(error){

        this.logger.error(error);

      }

    }   

}
