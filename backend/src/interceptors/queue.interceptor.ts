import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from "@nestjs/common";
import { catchError, map, Observable, tap, throwError } from "rxjs";
import { QueueModel } from "src/models";
import { has, set } from 'lodash';

@Injectable()
export class QueueInterceptor implements NestInterceptor {
    constructor(
        private queueModel: QueueModel
    ) { }
    /**
     * Intercept the result of a controller method and throw a NotFoundException
     * if the result is undefined.
     * @param context The execution context of the controller method.
     * @param next The call handler for the controller method.
     * @returns An Observable of the controller method's result value.
     */
    async intercept(
        context: ExecutionContext, 
        next:    CallHandler
    ): Promise<Observable<any>> {
        try {
            let request  = context.switchToHttp().getRequest();
            if( has(request.params,'id') ){
                let queue = await this.queueModel.findOne({ where: { id: request.params.id } });
                set(request,'queue',queue);
            }
            return next.handle();
        } catch(error) {

        }

        // return next.handle().pipe(
        //     map( async (context) => {
        //         let { params }  = context.req;
        //         if( has(params,'id') ){
        //             let queue = await this.queueModel.findOne({ where: { id: params.id } });
        //             set(context.req,'queue',queue);
        //         }
        //         console.log(context.req.queue);
        //         return context;
        //     }),
        //     catchError(err => {
        //     //   // if the error is a timeout error, throw a RequestTimeoutException
        //     //   if (err instanceof TimeoutError) {
        //     //     return throwError(() => new RequestTimeoutException());
        //     //   }
        //         // otherwise throw the original error
        //         return throwError(() => err);
        //     }),
        //     );
    }
}