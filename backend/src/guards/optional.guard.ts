import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { DataSource } from 'typeorm';
  import { UserEntity } from '../entities';
  import { pick, set } from 'lodash';
  
  @Injectable()
  export class OptionalGuard implements CanActivate {
  
    private readonly userEntity;
    
    constructor(
      private jwtService: JwtService,
      @Inject(DataSource) private readonly dataSource: DataSource    
    ) {
      this.userEntity = this.dataSource.getRepository(UserEntity);
    }
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (token != undefined) {
        try {
            const { user: { email } } = await this.jwtService.verifyAsync(token,{secret: process.env.JWT_SESSION_KEY});
            const authUser            = await this.userEntity.findOneBy({email});
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