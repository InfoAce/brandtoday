import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Injectable, Logger, Param, ParseIntPipe, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { Request, Response } from "express";
import { AdminGuard, AuthGuard } from "src/guards";
import { CompanyModel, RoleModel, UserModel } from "src/models";
import { get, isNull, has, set } from 'lodash';
import { CreateBannerValidation, StaffValidation } from "src/validation";
import { MailService } from "src/services";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import { QueryFailedError } from "typeorm";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Injectable()
@Controller('dashboard/website')
export class WebsiteController {

    private logger = new Logger(WebsiteController.name);

    constructor(
        private configService: ConfigService,
        private companyModel: CompanyModel,
    ){}

    @UseGuards(AdminGuard)
    @Get('')
    async get(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try{    

            let user    = get(req,'user');
           
            return res.status(HttpStatus.OK).json({ company: user.company });

        } catch(err) {

            this.logger.error(err);
        
        }
    }

    @UseGuards(AdminGuard)
    @Post('banner')
    async store(
        @Body() data: CreateBannerValidation,
        @Req() req:   Request,
        @Res() res:   Response,
    ) {
        try{    

            let user    = get(req,'user');
            let banners = Array();

            if( !isNull(user.company.banners) ){
                banners = user.company.banners;
            }
            
            banners.push(data);
            
            await this.companyModel.save({ id: user.company.id, banners: JSON.stringify(banners) });

            return res.status(HttpStatus.OK).json();

        } catch(err) {
            
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        
        }
    }

    @UseGuards(AdminGuard)
    @Post('upload')
    @UseInterceptors(
        FileInterceptor(
            'file',
            {
                storage: diskStorage({
                    destination: './public/images',
                    filename: (req, file, cb) => {
                        let uniqueSuffix = Date.now();
                        let ext          = file.mimetype.split('/');
                        cb(null, `${uniqueSuffix}.${ext[1]}`);
                      },
                }),
            }
        )
    )
    async uploadIcon(@UploadedFile() file: Express.Multer.File, @Req() req: Request,  @Res() res: Response) {

        try {
                        
            return res.status(HttpStatus.OK).json({file});

        } catch(err) {

            this.logger.error(err);

        }
    }

}