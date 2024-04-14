import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { set, has, isEmpty } from 'lodash';
import { catchError, firstValueFrom } from "rxjs";

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
        if( !isEmpty(data) ){
            if( has(data,'base_uri') ){
                this.httpService.axiosRef.defaults.baseURL = data.base_uri;
            }
            if( has(data,'auth') ){
                let { auth } = data;
                this.httpService.axiosRef.defaults.headers.common['Authorization'] = `${auth.type} ${auth.token}`;
            }
        }
        return this.httpService;
    }

    async auth(){
        let { 
            credentials: {
                account_number: CustomerCode,
                password:       Password,
                username:       UserName
            }
        }  = this.config;

        let { data } = await firstValueFrom(
            this.request({ base_uri: this.config.endpoints.live })
                .post(
                    this.config.endpoints.auth,
                    {
                        CustomerCode,
                        Password,
                        UserName
                    }
                )
                .pipe(
                    catchError((error: any) => {
                        let { response: { status, data: { message }} } = error;
                        throw new HttpException(message,status);
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
            this.request({ base_uri: this.config.endpoints.live, auth: { type: 'Bearer', token: auth } })
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
                        throw new HttpException(message,status);
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
            this.request({ base_uri: this.config.endpoints.live,  auth: { type: 'Bearer', token: auth } })
                .post(
                    this.config.endpoints.registeripn,
                    { url, ipn_notification_type }
                )
                .pipe(
                    catchError((error: any) => {
                        let { response: { status, data: { message }} } = error;
                        throw new HttpException(message,status);
                    })
                )
        );

        return response_data;

    }    
}