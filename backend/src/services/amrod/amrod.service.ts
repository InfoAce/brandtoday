import { HttpException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';;
import { UserModel } from 'src/models';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { isEmpty, has, set } from 'lodash';
import { catchError, firstValueFrom } from 'rxjs';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class AmrodService {

    private config;

    constructor(
        private configService: ConfigService,
        private readonly httpService: HttpService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ){
        this.config = this.configService.get<string>('services.amrod');
        set(this.config.endpoints,'vendor_uri',`${this.config.endpoints.vendor_uri}/${this.config.version}/`)
    }

    // Query builder
    http_query_builder(data: any ){
        return new URLSearchParams(data).toString();
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
    
    async fetchProducts(){
      
        // const {  
        //     data: { value: authCompany } 
        // } = await firstValueFrom(
        //                         this.request({})
        //                             .get(url)
        //                             .pipe(
        //                                 catchError((error: any) => {
        //                                     const { response: { status, data: { message }} } = error;
        //                                     throw new HttpException(message,status);
        //                                 })
        //                             )
        //                     );
    }

    async login(){

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


        this.cacheManager.store.set('amrod_auth',{ type: 'Bearer', token: data.token },data.expiry)

    }
        
    async getProducts(){

        const auth = await this.cacheManager.store.get('amrod_auth');

        const { data } = await firstValueFrom(
            this.request({ base_uri: this.config.endpoints.vendor_uri, auth })
                .get(`${this.config.endpoints.products.without_branding}`)
                .pipe(
                    catchError((error: any) => {
                        console.log(error);
                        // const { response: { status, data: { message }} } = error;
                        throw new HttpException(error.message,error.status);
                    })
                )
        );
        
        return data;

    }

    async getStock(){

        const auth = await this.cacheManager.store.get('amrod_auth');

        const { data } = await firstValueFrom(
            this.request({ base_uri: this.config.endpoints.vendor_uri, auth })
                .get(`${this.config.endpoints.stocks.all}`)
                .pipe(
                    catchError((error: any) => {
                        console.log(error);
                        // const { response: { status, data: { message }} } = error;
                        throw new HttpException(error.message,error.status);
                    })
                )
        );
        
        return data;

    }

    async getPrices(){

        const auth = await this.cacheManager.store.get('amrod_auth');

        const { data } = await firstValueFrom(
            this.request({ base_uri: this.config.endpoints.vendor_uri, auth })
                .get(`${this.config.endpoints.prices.all}`)
                .pipe(
                    catchError((error: any) => {
                        console.log(error);
                        // const { response: { status, data: { message }} } = error;
                        throw new HttpException(error.message,error.status);
                    })
                )
        );
        
        return data;

    }

    async getCategories(){

        const auth = await this.cacheManager.store.get('amrod_auth');

        const { data } = await firstValueFrom(
            this.request({ base_uri: this.config.endpoints.vendor_uri, auth })
                .get(`${this.config.endpoints.categories.all}`)
                .pipe(
                    catchError((error: any) => {
                        console.log(error);
                        // const { response: { status, data: { message }} } = error;
                        throw new HttpException(error.message,error.status);
                    })
                )
        );
        
        return data;

    }

}
