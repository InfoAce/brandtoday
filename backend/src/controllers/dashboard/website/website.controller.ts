import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Injectable, Logger, Param, ParseIntPipe, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { Request, Response } from "express";
import { AdminGuard, AuthGuard } from "src/guards";
import { CompanyModel, RoleModel, UserModel } from "src/models";
import { cloneDeep, get, isEmpty, isNull, has, set } from 'lodash';
import { CreateBannerValidation, StaffValidation, UpdateBannerValidation } from "src/validation";
import { ConfigService } from "@nestjs/config";
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
    @Get('banner')
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
        @Req()  req:  Request,
        @Res()  res:  Response,
    ) {
        try{    

            let user    = get(req,'user');
            let banners = Array();

            data.path   = `${this.configService.get('APP_URL')}/${data.path}`

            if( !isNull(user.company.banners) ){
                banners = user.company.banners;
            }
            
            banners.push(data);
            
            await this.companyModel.save({ id: user.company.id, banners });

            return res.status(HttpStatus.OK).json();

        } catch(error) {
            
            this.logger.error(error);
        
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

    /**
     * Update company banner images
     * @param req 
     * @param res 
     */
    @UseGuards(AdminGuard)
    @Put('banner')
    async delete(
        @Body() data: UpdateBannerValidation,
        @Req()  req:  Request,
        @Res()  res:  Response,
    ) { 
        
        try {

            let user    = get(req,'user');            
            let company = await this.companyModel.save({ id: user.company.id, banners: get(data,'banners') });

            return res.status(HttpStatus.OK).json({ company });

        } catch(error) {

            this.logger.error(error);

        }
    }

}