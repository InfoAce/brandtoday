import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { keys } from 'lodash';

@Injectable()
export default class CsrfMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next();
  }
}
