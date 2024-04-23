import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { set, has, isEmpty } from 'lodash';
import { catchError, firstValueFrom } from "rxjs";
import { PesapalServiceException } from "src/exceptions/pesapal.exception";

@Injectable()
export class PesapalService {

    private config;

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {
        this.config = this.configService.get<string>('services.pesapal');
        set(this.config.endpoints,'vendor_uri',`${this.config.endpoints.vendor_uri}/${this.config.version}/`)
    }

    // Interceptor with authentication
    request(data: any = {}){
        this.httpService.axiosRef.defaults.headers.common['Content-Type'] = "application/json";
        this.httpService.axiosRef.defaults.baseURL = this.config.endpoints.live;
        if( !isEmpty(data) ){
            if( has(data,'auth') ){
                let { auth } = data;
                this.httpService.axiosRef.defaults.headers.common['Authorization'] = `${auth.type} ${auth.token}`;
                this.httpService.axiosRef.defaults.timeout = 50000;
            }
        }
        return this.httpService;
    }

    async auth(){
        let { 
            configuration:{
                consumer_key,
                consumer_secret
            }
        }  = this.config;

        let { data } = await firstValueFrom(
            this.request()
                .post(
                    this.config.endpoints.auth,
                    {
                        consumer_key,
                        consumer_secret
                    }
                )
                .pipe(
                    catchError((error: any) => {
                        let { response: { status, data: { message }} } = error;
                        throw new PesapalServiceException(message,status);
                    })
                )
        );

        return data;

    }

    async order(
        data: any = {
            id:              String(),
            currency:        String(),
            amount:          Number(),
            description:     String(),
            callback_url:    String(),
            notification_id: String(),
            billing_address: Object()
        },
        auth: string
    ){

        let { 
            id,
            currency,
            amount,
            description,
            callback_url,
            notification_id,
            billing_address
        }  = data;

        let { data: response_data } = await firstValueFrom(
            this.request({ auth: { type: 'Bearer', token: auth } })
                .post(
                    this.config.endpoints.orderRequest,
                    {
                        id,
                        currency,
                        amount,
                        description,
                        callback_url,
                        notification_id,
                        billing_address
                    }
                )
                .pipe(
                    catchError((error: any) => {
                        let { response: { status, data: { message }} } = error;
                        throw new PesapalServiceException(message,status);
                    })
                )
        );

        return response_data;

    }    

    async registerIPN(
        data: any = { url: String(), ipn_notification_type: String() },
        auth: string
    ){

        let { url, ipn_notification_type }  = data;

        let { data: response_data } = await firstValueFrom(
            this.request({ auth: { type: 'Bearer', token: auth } })
                .post(
                    this.config.endpoints.registeripn,
                    { url, ipn_notification_type }
                )
                .pipe(
                    catchError((error: any) => {
                        let { response: { status, data: { message }} } = error;
                        throw new PesapalServiceException(message,status);
                    })
                )
        );

        return response_data;

    } 
    
    async transactionStatus(
        order_id: string,
        auth: string
    ){

        let { data: response_data } = await firstValueFrom(
            this.request({ auth: { type: 'Bearer', token: auth } })
                .get(`${this.config.endpoints.status}?orderTrackingId=${order_id}`)
                .pipe(
                    catchError((error: any) => {
                        let { response: { status, data: { message }} } = error;
                        throw new PesapalServiceException(message,status);
                    })
                )
        );

        return response_data;

    } 
}