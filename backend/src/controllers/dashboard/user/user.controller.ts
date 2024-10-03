import { Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Injectable, ParseIntPipe, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AdminGuard } from "src/guards";
import { RoleModel, UserModel } from "src/models";
import { get, has, set } from 'lodash';
import { StaffValidation } from "src/validation";
import { MailService } from "src/services";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';

@Injectable()
@Controller('dashboard/users')
export class UserController {

    constructor(
        private userModel: UserModel,
        private configService: ConfigService,
        private mailService: MailService,
        private roleModel: RoleModel,
    ){}

    @UseGuards(AdminGuard)
    @Get('')
    /**
     * Retrieves a paginated list of users based on the provided query parameters.
     * 
     * @param res The response object to send the result to.
     * @param page The page number of the results to retrieve. Defaults to 1.
     * @param limit The maximum number of results to retrieve per page. Defaults to 10.
     * @param type The role name of the users to retrieve. Defaults to an empty string.
     * @returns A JSON response containing the paginated list of users.
     */
    async show(
        @Res() res: Response,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @Query('type', new DefaultValuePipe(String())) type: string = String(),
    ) {
        try{
            // Retrieve paginated list of users based on the provided query parameters
            let users = await this.userModel.find({ skip: (page - 1) * limit, take: limit, where: { role: { name: type } }, });
            
            // Send the paginated list of users as a JSON response
            return res.status(HttpStatus.OK).json({users});
        } catch(err) {
            // If an error occurs, send a 500 Internal Server Error response
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(AdminGuard)
    @Post('')
    async store(
        @Req()  req: Request,
        @Body() staffUser: StaffValidation,
        @Res()  res: Response,
    ){
        try{

            let randomstring   = require("randomstring");
            let { id: roleId } = await this.roleModel.findOneBy({ name: 'staff'});
            let { company_id } = get(req,'user');
            let genPassword    = await bcrypt.hashSync(randomstring.generate(10), parseInt(this.configService.get('app.SALT_LENGTH')));

            set(staffUser,'company_id',company_id);
            set(staffUser,'role_id',roleId);
            set(staffUser,'password',genPassword);
            set(staffUser,'token',randomstring.generate(100));

            let user = await this.userModel.save(staffUser);

            await this.mailService.sendStaffConfirmation(user);
            
            return res.status(HttpStatus.OK).json({});
            
        } catch(error) {

            console.log(error);
            if( has(error,'applicationRef') ){
                throw new HttpException(error.applicationRef.status,error.applicationRef.message);
            }

        }
    }

}