import { Body, Controller, Get, HttpStatus, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../../guards';
import { Request, Response } from 'express';
import { AuthService, MailService } from 'src/services';
import { RegisterValidation } from 'src/validation';
import { CompanyModel, RoleModel, UserModel } from 'src/models';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { get, isEmpty, isNull, pick, set } from 'lodash';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('api/auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private companyModel: CompanyModel,
        private configService: ConfigService,
        private mailService: MailService,
        private roleModel: RoleModel,
        private userModel: UserModel
    ){}

    @Post('login')
    async login(@Req() req: Request,  @Res() res: Response){
        let { email, password } = req.body;
        try{
            const user = await this.authService.findOneByEmail(email);

            if(isNull(user)) {
                return res.status(HttpStatus.NOT_FOUND).json({});
            }

            if( !isEmpty(user) ){
                const isMatch = await bcrypt.compare(password,user.password);

                if( isMatch ){
                    const token = await this.authService.signIn({user,password});
                    return res.status(HttpStatus.OK).json({user: pick(user,['first_name','last_name','email','role','company']),token});
                }
                
                return res.status(HttpStatus.UNAUTHORIZED).json({});
            }
        
        } catch(err){
            return res.status(HttpStatus.GATEWAY_TIMEOUT);
        }
    }

    @Post('signup')
    async signup(@Body() registerUser: RegisterValidation, @Res() res: Response){
        try{
            const randomstring      = require("randomstring");
            const { id: companyId } = await this.companyModel.first();
            const { id: roleId }    = await this.roleModel.findOneBy({ name: 'client'});

            registerUser.password      = await bcrypt.hash(registerUser.password, parseInt(this.configService.get('SALT_LENGTH')));
            registerUser['token']      = randomstring.generate(100);
            registerUser['company_id'] = companyId;
            registerUser['role_id']    = roleId;
            delete registerUser.confirm_password;

            const user = await this.userModel.save(registerUser);
            await this.mailService.sendUserConfirmation(user);

            res.status(HttpStatus.OK).json({user});

        } catch(e) {
            throw new Error("Something went wrong. Please try again.");            
        }   
    }

    @UseGuards(AuthGuard)
    @Get('user')
    getProfile(@Req() req: Request,  @Res() res: Response) {
        res.status(HttpStatus.OK).json({user: get(req,'user') });
    } 

    @UseGuards(AuthGuard)
    @Post('user')
    async updateUser(@Body() body: any, @Req() req: Request,  @Res() res: Response) {
        const authUser = get(req,'user');
        try {
            const updatedUser = await this.userModel.updateOne({id: authUser.id},body)
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
                        const uniqueSuffix = Date.now();
                        const ext          = file.originalname.split('.');
                        cb(null, `${uniqueSuffix}.${ext[1]}`);
                    },
                }),
            }
        )
    )
    uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request,  @Res() res: Response) {
        const user = get(req,'user');
        this.userModel.save({ id: user.id, image: `images/${file.filename}` });
        return res.status(HttpStatus.OK).json({});
    }

    @UseGuards(AuthGuard)
    @Get('company')
    getCompany(@Req() req: Request,  @Res() res: Response) {
        const { company } = get(req,'user');
        res.status(HttpStatus.OK).json({company});
    } 

    @UseGuards(AuthGuard)
    @Post('company')
    async updateCompany(@Body() body: any, @Req() req: Request,  @Res() res: Response) {
        const { company } = get(req,'user');
        try{
            const updatedCompany = await this.companyModel.updateOne(company.id,body);
            return res.status(HttpStatus.OK).json({updatedCompany});
        } catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } 
}
