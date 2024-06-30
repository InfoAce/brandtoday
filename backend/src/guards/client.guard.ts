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
  export class ClientGuard implements CanActivate {

    constructor(
      private jwtService: JwtService,
      private configService: ConfigService,
      private userModel: UserModel 
    ) {}
  
    /**
     * Verify the user's JWT token and determine if they have the correct role.
     * If the user is a client, set the user object in the request.
     * If the user does not have the correct role, throw an UnauthorizedException.
     * 
     * @param {ExecutionContext} context - The execution context.
     * @returns {Promise<boolean>} A promise that resolves to true if the user has the correct role.
     * @throws {UnauthorizedException} If the user does not have the correct role.
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
      // Get the HTTP request object from the execution context
      let request = context.switchToHttp().getRequest();
      // Extract the token from the request header
      let token   = this.extractTokenFromHeader(request);

      // If no token is found, throw an UnauthorizedException
      if (token == undefined) {
        throw new UnauthorizedException();
      }

      try {
        // Verify the token and get the user's id
        let { id }    = await this.jwtService.verifyAsync(token,{secret: this.configService.get<string>('app.JWT_SESSION_KEY') });
        // Get the user object from the database
        let authUser  = await this.userModel.findOneBy({ id });
        // Get the role object associated with the user
        let authRole  = await authUser.role;
        
        // If the user's role is 0 (client), set the user object in the request
        if( authRole.state === 0 ){
          set(request,'user',authUser);        
        }

        // If the user's role is not 0, throw an UnauthorizedException
        if( authRole.state != 0 ){
          throw new UnauthorizedException();     
        }

      } catch(err) {
        // If an error occurs during verification, throw an UnauthorizedException
        throw new UnauthorizedException();
      }
      
      // Return true if the user has the correct role
      return true;
    }
  
    /**
     * Extracts the token from the request header.
     * @param {Request} request - The HTTP request object.
     * @returns {string | undefined} The token if it's found, undefined otherwise.
     */
    private extractTokenFromHeader(request: Request): string | undefined {
      // Extract the token from the request header
      
      // Get the authorization header from the request
      let authorizationHeader = request.headers.authorization;
      
      // Split the authorization header into type and token
      let [type, token] = authorizationHeader?.split(' ') ?? [];
      
      // If the type is 'Bearer', return the token, otherwise return undefined
      return type === 'Bearer' ? token : undefined;
    }
  }