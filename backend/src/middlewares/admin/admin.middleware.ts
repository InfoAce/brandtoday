import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if( req.user == undefined && req.user.role.state > 0 ){ next(); }
    res.status(HttpStatus.UNAUTHORIZED);
  }
}
