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
export class OptionalGuard implements CanActivate {
    
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userModel: UserModel 
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (token != undefined) {
      try {
        const { user: { email } } = await this.jwtService.verifyAsync(token,{secret: this.configService.get<string>('app.JWT_SESSION_KEY') });
        const authUser            = await this.userModel.findOneBy({email});
          // 💡 We're assigning the payload to the request object here
          // so that we can access it in our route handlers
          set(request,'user',authUser);
          // request.user =;
        } catch(err) {
          throw new UnauthorizedException();
        }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}