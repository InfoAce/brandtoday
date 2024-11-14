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

  /**
   * CanActivate method that checks if the user is authenticated.
   * If the token is present, it verifies it and sets the user object in the request.
   * If the token is not present, it returns true.
   * @param {ExecutionContext} context - The execution context.
   * @returns {Promise<boolean>} A promise that resolves to true if the user is authenticated.
   * @throws {UnauthorizedException} If the user is not authenticated.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request = context.switchToHttp().getRequest();
    let token = this.extractTokenFromHeader(request);

    if (token != undefined) {
      try {
        // Verify the token and get the user's id
        let { id } = await this.jwtService.verifyAsync(
          token,
          { secret: this.configService.get<string>('app.JWT_SESSION_KEY') },
        );
        // Get the user object from the database
        let authUser = await this.userModel.findOneBy({ id });
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        set(request, 'user', authUser);
        // request.user =;
      } catch (err) {
        // If an error occurs during verification, throw an UnauthorizedException
        set(request, 'user', {});
      }
    }

    // Return true if the user is authenticated
    return true;
  }


  /**
   * Extracts the token from the request header.
   * @param {Request} request - The HTTP request object.
   * @returns {string | undefined} The token if it's found, undefined otherwise.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    // Try to extract the token from the request header
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    // If the type is 'Bearer', return the token, otherwise return undefined
    return type === 'Bearer' ? token : undefined;
  }
}