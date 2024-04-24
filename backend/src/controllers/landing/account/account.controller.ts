import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientGuard } from '../../../guards';
import { Request, Response } from 'express';
import { UserModel } from 'src/models';
import { get, set } from 'lodash';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SecurityValidation } from 'src/validation';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Controller('account')
export class AccountController {

    constructor(
        private readonly configService: ConfigService,
        private userModel: UserModel
    ){}

    @UseGuards(ClientGuard)
    @Get('')
    async getProfile(@Req() req: Request,  @Res() res: Response) {
        try {
            
            let user = await this.userModel.findOneBy({id: get(req,'user').id});

            set(user,'order_count',(await user.orders).length)
            set(user,'pending_order_count',(await user.orders).filter(val => val.status == 'pending').length )
            set(user,'favourite_count',(await user.favourites).length)

            res.status(HttpStatus.OK).json({ user  });
        
        } catch (err) {


        }
    } 

    @UseGuards(ClientGuard)
    @Post('')
    async updateUser(@Body() body: any, @Req() req: Request,  @Res() res: Response) {
        let authUser = get(req,'user');
        try {
            let updatedUser = await this.userModel.updateOne({id: authUser.id},body)
            set(req,'user',updatedUser);
            res.status(HttpStatus.OK).json({user: get(req,'user') });
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);        
        }
    } 

    @UseGuards(ClientGuard)
    @Post('security')
    async updateSecurity(
        @Body() body: SecurityValidation,
        @Req()  req:  Request, 
        @Res()  res:  Response
    ) {
        try {

            let { current_password, new_password } = body;
            let user    = get(req,'user');
            let isMatch = await bcrypt.compare(current_password,user.password);

            if(isMatch === false) {
                res.status(HttpStatus.UNAUTHORIZED).json({});
            }
            
            let password = await bcrypt.hash(new_password, parseInt(this.configService.get('SALT_LENGTH')))

            this.userModel.updateOne({id: get(req,'user').id},{ password  });

            return res.status(HttpStatus.OK).json({});
            
        } catch (err) {
            
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);   

        }
    } 

    @UseGuards(ClientGuard)
    @Post('upload/image')
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

    @UseGuards(ClientGuard)
    uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request,  @Res() res: Response) {
        let user = get(req,'user');
        this.userModel.save({ id: user.id, image: `images/${file.filename}` });
        return res.status(HttpStatus.OK).json({});
    }

}
