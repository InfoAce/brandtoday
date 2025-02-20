import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { has, set } from 'lodash'; 
import { OrderModel } from "src/models";
@Injectable()
export class ViewOrderInterceptor implements NestInterceptor {
    constructor(
        private model: OrderModel
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
            if( has(request.params,'order') ){
                let { params: { order } } = request;
                order = await this.model.findOne({ where: { id: request.params.order } });
                set(request,'order',order);
            }
            return next.handle();
        } catch(error) {
            return next.handle().pipe(
                tap(
                    data => {
                    // console.log(data);
                        if (data === undefined) throw new NotFoundException();
                    }
                )
            );
        }
    }
}