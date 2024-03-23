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
                const { auth } = data;
                this.httpService.axiosRef.defaults.headers.common['Authorization'] = `${auth.type} ${auth.token}`;
            }
        }
        return this.httpService;
    }

    async auth(){
        const url  = `${this.config.endpoints.auth_uri}/${this.config.endpoints.login}`;
        const { 
            credentials: {
                account_number: CustomerCode,
                password:       Password,
                username:       UserName
            }
        }  = this.config;

        const { data } = await firstValueFrom(
            this.request({ base_uri: this.config.endpoints.auth_uri })
                .post(
                    url,
                    {
                        CustomerCode,
                        Password,
                        UserName
                    }
                )
                .pipe(
                    catchError((error: any) => {
                        const { response: { status, data: { message }} } = error;
                        throw new HttpException(message,status);
                    })
                )
        );

        return data;

    }
}