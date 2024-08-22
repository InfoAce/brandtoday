import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Logger, NotFoundException, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../../guards';
import { Request, Response } from 'express';
import { AuthService, MailService } from 'src/services';
import { LoginValidation, RegisterValidation, UpdateAuthValidation } from 'src/validation';
import { CompanyModel, RoleModel, UserModel } from 'src/models';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { get, isEmpty, isNull, pick, omit, set } from 'lodash';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { ControllerException } from 'src/exceptions/controller.exception';

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
    /**
     * Handle login request
     *
     * @param {LoginValidation} body - The request body containing email and password
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @return {Promise<void>} - Returns a Promise that resolves when the response is sent
     */
    async login(
        @Body() body: LoginValidation,
        @Req()  req:  Request, 
        @Res()  res:  Response
    ){
        try{

            // Destructure email and password from request body
            let { email, password } = body;

            // Authenticate user and retrieve token
            let token = await this.authService.login(email,password);

            // Send response with token
            res.status(HttpStatus.OK).json({ ...token });

        } catch(error){

            // Send error response with status and message
            res.status(error.status).json({ message: error.message });
        
        }
    }

    @Post('signup')
    /**
     * Handle signup request
     *
     * @param {RegisterValidation} registerUser - The request body containing user details
     * @param {Response} res - The response object
     * @return {Promise<void>} - Returns a Promise that resolves when the response is sent
     */
    async signup(
        @Body() registerUser: RegisterValidation, 
        @Res()  res:          Response
    ){
        try{
            // Generate random string for token
            let randomstring = require("randomstring");
            
            // Get company and role IDs
            let { id: companyId } = await this.companyModel.first();
            let { id: roleId }    = await this.roleModel.findOneBy({ name: 'client'});

            // Hash password and generate token
            registerUser.password      = await bcrypt.hashSync(registerUser.password, parseInt(this.configService.get('app.SALT_LENGTH')));
            registerUser['token']      = randomstring.generate(100);
            registerUser['company_id'] = companyId;
            registerUser['role_id']    = roleId;
            
            // Remove confirm password field
            delete registerUser.confirm_password;

            // Save user and send confirmation email
            let user = await this.userModel.save(registerUser);
            
            await this.mailService.sendUserConfirmation(user);

            // Send response with user details
            res.status(HttpStatus.OK).json({user});

        } catch(error) {
            this.logger.error(error);
            // Log and throw error
            throw new ControllerException(error);            
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
    /**
     * Fetches the user profile of the authenticated user.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<void>} - A promise that resolves when the operation is complete.
     */
    async getProfile(@Req() req: Request,  @Res() res: Response) {
        try {
            // Fetch the user profile of the authenticated user from the database.
            let user = await this.userModel.findOneBy({ id: get(req,'user').id });

            // Return the user profile as a JSON response with a 200 status code.
            res.status(HttpStatus.OK).json({ user });

        } catch(error) {
            // Log any errors that occur.
            this.logger.error(error);

        }
    } 

    /**
     * Updates the authenticated user's profile.
     *
     * @param {any} body - The request body containing the updated user data.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<void>} - A promise that resolves when the operation is complete.
     */
    @UseGuards(AuthGuard)
    @Post('user')
    async updateUser(
        @Body() body: UpdateAuthValidation, 
        @Req()  req: Request,  
        @Res()  res: Response
    ) {
        // Get the authenticated user from the request.
        let authUser = get(req,'user');
        try {
            // Update the user's data in the database.
            await this.userModel.save({id: authUser.id, ...body});

            // Fetch the user's data in the database
            let user = await this.userModel.findOneBy({ id: get(req,'user').id });

            // Return the updated user data as a JSON response with a 200 status code.
            res.status(HttpStatus.OK).json({ user: omit(user,['company']) });
        } catch (err) {
            // Return an internal server error response if an error occurs.
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
        try {
            // Return the uploaded file as a JSON response with a status code of 200
            return res.status(HttpStatus.OK).json({ location:`${this.configService.get<string>('app.APP_FRONTEND_URL')}/images/${file.filename}`});
        } catch(error) {
            // Log any errors that occur
            this.logger.error(error);
        }
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
