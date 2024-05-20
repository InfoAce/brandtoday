import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Logger, NotFoundException, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../../guards';
import { Request, Response } from 'express';
import { AuthService, MailService } from 'src/services';
import { LoginValidation, RegisterValidation } from 'src/validation';
import { CompanyModel, RoleModel, UserModel } from 'src/models';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { get, isEmpty, isNull, pick, set } from 'lodash';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Controller('auth')
export class AuthController {

    private readonly logger = new Logger(AuthController.name);

    constructor(
        private authService: AuthService,
        private companyModel: CompanyModel,
        private configService: ConfigService,
        private mailService: MailService,
        private roleModel: RoleModel,
        private userModel: UserModel
    ){}

    @Post('login')
    async login(
        @Body() body: LoginValidation,
        @Req()  req:  Request, 
        @Res()  res:  Response
    ){
        try{

            let { email, password } = body;
            let token               = await this.authService.login(email,password);
            
            res.status(HttpStatus.OK).json({ ...token });
            
        } catch(error){

            res.status(error.status).json({ message: error.message });
        
        }
    }

    @Post('signup')
    async signup(@Body() registerUser: RegisterValidation, @Res() res: Response){
        try{
            let randomstring      = require("randomstring");
            let { id: companyId } = await this.companyModel.first();
            let { id: roleId }    = await this.roleModel.findOneBy({ name: 'client'});

            registerUser.password      = await bcrypt.hash(registerUser.password, parseInt(this.configService.get('SALT_LENGTH')));
            registerUser['token']      = randomstring.generate(100);
            registerUser['company_id'] = companyId;
            registerUser['role_id']    = roleId;
            delete registerUser.confirm_password;

            let user = await this.userModel.save(registerUser);
            await this.mailService.sendUserConfirmation(user);

            res.status(HttpStatus.OK).json({user});

        } catch(err) {
            console.log(err);
            throw new ExceptionsHandler(err);            
        }   
    }

    @Put('verify/:token')
    async verify(@Param('token') token: string, @Res() res: Response){
        try{
            let { id }       = await this.userModel.findOneBy({ token });
            let randomstring = require("randomstring");
            
            this.userModel.updateOne({ id }, { email_verified_at: new Date(), token: randomstring.generate(100) });

            return res.status(HttpStatus.OK).json({});

        } catch(err) {

            if( err.constructor.name == "EntityNotFoundError"){
                throw new NotFoundException();
            }

            throw new InternalServerErrorException(); 
        }
    }

    @Put('user/:token')
    async fetchToken(@Param('token') token: string, @Res() res: Response){
        try{
            let user = await this.userModel.findOneBy({ token });
            
            return res.status(HttpStatus.OK).json({ user });

        } catch(err) {

            if( err.constructor.name == "EntityNotFoundError"){
                throw new NotFoundException();
            }

            throw new InternalServerErrorException(); 
        }
    }

    @UseGuards(AuthGuard)
    @Get('user')
    async getProfile(@Req() req: Request,  @Res() res: Response) {

        try {

            let user = await this.userModel.findOne({ where: { id: get(req,'user.id') } });

            res.status(HttpStatus.OK).json({ user });

        } catch(error) {

            this.logger.error(error);

        }
    } 

    @UseGuards(AuthGuard)
    @Post('user')
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

    @UseGuards(AuthGuard)
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
    uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request,  @Res() res: Response) {
        let user = get(req,'user');
        this.userModel.save({ id: user.id, image: `images/${file.filename}` });
        return res.status(HttpStatus.OK).json({});
    }

    @UseGuards(AuthGuard)
    @Get('company')
    getCompany(@Req() req: Request,  @Res() res: Response) {
        let { company } = get(req,'user');
        res.status(HttpStatus.OK).json({company});
    } 

    @UseGuards(AuthGuard)
    @Post('company')
    async updateCompany(@Body() body: any, @Req() req: Request,  @Res() res: Response) {
        let { company } = get(req,'user');
        try{
            let updatedCompany = await this.companyModel.updateOne(company.id,body);
            return res.status(HttpStatus.OK).json({updatedCompany});
        } catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } 
}
