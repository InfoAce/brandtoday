import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { keys } from 'lodash';

@Injectable()
export default class ApiMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const { headers } = req;
    if( 
        keys(headers).includes('X-Requested-With') || 
        keys(headers).includes('x-requested-with') || 
        ( keys(headers).includes('accept') && (headers['accept'].includes('application/json') || headers['accept'].includes('text/event-stream')) )
     ){ 
      next()
    } else { 
      throw new HttpException('Not Acceptable',HttpStatus.NOT_ACCEPTABLE);
    }
  }
}
