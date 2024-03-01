import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class LoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const isAuthenticated = context.switchToHttp().getRequest().isAuthenticated();

    if( !isAuthenticated ){
      context.switchToHttp().getResponse().redirect('login');
    }

    return isAuthenticated;
  }
}
