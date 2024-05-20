import { ForbiddenException, HttpException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';;
import { UserModel } from 'src/models';
import { ConfigService } from '@nestjs/config';
import { isEmpty, isNull, omit } from 'lodash';
import * as bcrypt from 'bcrypt';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { UserEntity } from 'src/entities';
import { Exception } from 'handlebars';
@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);

    constructor(
        private userModel: UserModel,
        private configService: ConfigService,
        private jwtService: JwtService
    ){}

    async findOneByEmail(email: string){
        try {
        
            return await this.userModel.findOneBy({ where: { email }, select:['id','email','password']});
        
        } catch (error) {

            this.logger.error(error);
        
        }
    }

    async signIn(email): Promise<any>{
        try {

            let user = await this.userModel.findOne({ where: { email }, relations:['company'], select:['id','first_name','last_name','email','image','email_verified_at'] });
            
            return {    
                token:{    
                    token_type: `Bearer`,
                    token:      await this.jwtService.signAsync(
                                    {
                                        ...omit(user,['__company__'])
                                    }, { 
                                        expiresIn: this.configService.get<string>('app.JWT_EXPIRES_IN'), 
                                        secret:    this.configService.get<string>('app.JWT_SESSION_KEY')  
                                    }
                                )
                },
                user
            };
            
        } catch(error) {

            this.logger.error(error);

            throw new HttpException(error.message,error.status);

        }
    }

    /**
     * Authenticates the user
     * 
     * @param email 
     * @param password 
     * @returns {Promise<Object>}
     */
    async login(email, password){
        try {

            let user = await this.userModel.findOne({ where: { email }, select:['id','email','password','email_verified_at'] });            
        
            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new UnauthorizedException('Incorrect username or password');
            }
            
            if(isNull(user.email_verified_at)) {
                throw new ForbiddenException('Your account is not verified.');
            }

            return await this.signIn(email);

        } catch (error) {

            this.logger.error(error);
            
            throw new HttpException(error.message,error.status);
        }        
    }

    async validateUser(username, password){
        const foundUser = await this.userModel.findOneBy({ email: username });
        if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
          throw new UnauthorizedException('Incorrect username or password');
        }
        const { password: _password, ...retUser } = foundUser;
        return retUser;
    }
}
