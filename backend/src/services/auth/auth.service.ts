import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';;
import { UserModel } from 'src/models';
import { ConfigService } from '@nestjs/config';
import { isEmpty, isNull } from 'lodash';
import * as bcrypt from 'bcrypt';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
@Injectable()
export class AuthService {

    constructor(
        private userModel: UserModel,
        private configService: ConfigService,
        private jwtService: JwtService
    ){}

    async findOneByEmail(email: string){
        return await this.userModel.findOneBy({email});
    }

    async signIn(user:any): Promise<any>{
        return {        
            token_type: `Bearer`,
            token:      await this.jwtService.signAsync(user)
        };
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
