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
  
    /**
     * Check if the user is an admin by verifying the token and getting the user's role.
     * If the user is an admin, set the user object in the request.
     * If the user is not an admin, throw an UnauthorizedException.
     *
     * @param {ExecutionContext} context - The execution context
     * @returns {Promise<boolean>} - A promise that resolves to true if the user is an admin
     * @throws {UnauthorizedException} - If the user is not an admin
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
      // Get the HTTP request from the execution context
      let request = context.switchToHttp().getRequest();
      // Extract the token from the request header
      let token   = this.extractTokenFromHeader(request);

      // If no token is found, throw an UnauthorizedException
      if (token == undefined) {
        throw new UnauthorizedException();
      }

      try {
        // Verify the token and get the user's id
        let authUser    = await this.jwtService.verifyAsync(token,{secret: this.configService.get<string>('app.JWT_SESSION_KEY') });

        // If the user's role is greater than 0, set the user object in the request
        if( authUser.role.state > 0 ){
          request = set(request,'user',authUser);        
        }

        // If the user's role is 0, throw an UnauthorizedException
        if( authUser.role.state === 0 ){
          throw new UnauthorizedException();     
        }

      } catch(err) {
        // If an error occurs during verification, throw an UnauthorizedException
        throw new UnauthorizedException();
      }
      
      // Return true if the user is an admin
      return true;
    }
  
    /**
     * Extract the token from the request header
     * @param {Request} request - The HTTP request object
     * @returns {string | undefined} The token if it's found, undefined otherwise
     */
    private extractTokenFromHeader(request: Request): string | undefined {
      // Extract the token from the request header
      let [type, token] = request.headers.authorization?.split(' ') ?? [];

      // If the token is not a Bearer token, return undefined
      return type === 'Bearer' ? token : undefined;
    }

  }