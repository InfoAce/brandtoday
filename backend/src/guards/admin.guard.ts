import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { set } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { UserModel } from 'src/models';
  
  @Injectable()
  export class AdminGuard implements CanActivate {

    constructor(
      private jwtService: JwtService,
      private configService: ConfigService,
      private userModel: UserModel 
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      let request = context.switchToHttp().getRequest();
      let token   = this.extractTokenFromHeader(request);

      if (token == undefined) {
        throw new UnauthorizedException();
      }

      try {
        let { user: { email } } = await this.jwtService.verifyAsync(token,{secret: this.configService.get<string>('app.JWT_SESSION_KEY') });
        let authUser            = await this.userModel.findOneBy({email});
        let authRole            = await authUser.role;

        if( authRole.state > 0 ){
          request = set(request,'user',authUser);        
        }

        if( authRole.state === 0 ){
          throw new UnauthorizedException();     
        }

      } catch(err) {
        throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      let [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }