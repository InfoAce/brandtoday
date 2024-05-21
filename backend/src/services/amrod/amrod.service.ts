import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { isEmpty, has, set } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { AmrodServiceException } from 'src/exceptions/amrod.exception';

@Injectable()
export class AmrodService {

    private config;

    private readonly logger = new Logger(AmrodService.name);

    constructor(
        private configService: ConfigService,
        private readonly httpService: HttpService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
        this.httpService.axiosRef.defaults.timeout = 60000;
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

    /**
     * Login to amrod vendor service
     * 
     * @param data 
     * @returns {Object}
     */
    async login(data: any){

        try {

            let url  = `${this.config.endpoints.auth_uri}/${this.config.endpoints.login}`;

            let { account_number: CustomerCode, password: Password, username: UserName }  = data;
    
            let { data: auth_data } = await firstValueFrom( this.request({ base_uri: this.config.endpoints.auth_uri }).post( url, { CustomerCode, Password, UserName }) );
            
            this.cacheManager.set('amrod_auth', { type: 'Bearer', token: auth_data.token });

        } catch (error) {

            this.logger.error(`Login: ${error}`);
            
        }

    }
        
    async getProducts(){

        try {

            let auth = await this.cacheManager.get('amrod_auth'),
            { data } = await firstValueFrom( this.request({ base_uri: this.config.endpoints.vendor_uri, auth }).get(`${this.config.endpoints.products.without_branding}`) );

            return data;

        } catch (error) {

            this.logger.error(`Products: ${error}`);

        }

    }

    /**
     * Fetch stocks
     * 
     * @param data 
     * @returns {Array}
     */
    async getStock(){

        try {

            let auth  = await this.cacheManager.get('amrod_auth'),
            { data }  = await firstValueFrom( this.request({ base_uri: this.config.endpoints.vendor_uri, auth }).get(`${this.config.endpoints.stocks.updated}`) );
            
            return data;
            
        } catch (error) {
            
            this.logger.error(`Stock: ${error}`);
        
        }

    }

    async getPrices(){

        try {

            let auth = await this.cacheManager.get('amrod_auth'),
            { data } = await firstValueFrom( this.request({ base_uri: this.config.endpoints.vendor_uri, auth }).get(`${this.config.endpoints.prices.all}`) );
            
            return data;
            
        } catch (error) {

            this.logger.error(`Prices: ${error}`);
        
        }

    }

    async getCategories(){

        try{

            let auth = await this.cacheManager.get('amrod_auth'),
            { data } = await firstValueFrom( this.request({ base_uri: this.config.endpoints.vendor_uri, auth }).get(`${this.config.endpoints.categories.all}`) );
            
            return data;

        } catch (error) {

            this.logger.error(`Categories: ${error}`);
        
        }

    }

    async getBrands(){

        try{

            let auth = await this.cacheManager.get('amrod_auth'),
            { data } = await firstValueFrom(this.request({ base_uri: this.config.endpoints.vendor_uri, auth }).get(`${this.config.endpoints.brands.all}`) );
            
            return data;

        } catch (error) {

            this.logger.error(`Brands: ${error}`);
        
        }

    }

}
