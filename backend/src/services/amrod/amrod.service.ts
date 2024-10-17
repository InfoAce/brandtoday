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

    /**
     * AmrodService class
     * 
     * The AmrodService class is responsible for making requests to the Amrod vendor service.
     * It handles the authentication process, request validation, and caching of responses.
     */
    constructor(
        private configService: ConfigService, // The ConfigService instance
        private readonly httpService: HttpService, // The HttpService instance
        @Inject(CACHE_MANAGER) private cacheManager: Cache, // The Cache instance
    ){
        // Get the Amrod service configuration
        this.config = this.configService.get<string>('services.amrod');
        // Set the vendor_uri endpoint to include the version
        set(this.config.endpoints,'vendor_uri',`${this.config.endpoints.vendor_uri}/${this.config.version}/`)
    }


    /**
     * Query builder
     * 
     * A simple query builder method that takes an object and returns a URLSearchParams string.
     * This is used to build query strings for requests to the Amrod vendor service.
     * @param data - An object containing the query parameters.
     * @returns A URLSearchParams string representation of the query parameters.
     */
    http_query_builder(data: any ){
        return new URLSearchParams(data).toString();
    }

    /**
     * Interceptor for making requests to the Amrod vendor service.
     * Adds authentication headers to the request if provided.
     *
     * @param data - An optional object containing authentication data and base URI.
     * @param data.base_uri - The base URI for the request. If not provided, the base URI from the config is used.
     * @param data.auth - An object containing the authentication type and token.
     * @returns The HttpService instance with the appropriate headers and base URI.
     */
    request(data: any = {}): HttpService {
        // Set the default headers
        this.httpService.axiosRef.defaults.headers.common['Content-Type'] = "application/json";
        this.httpService.axiosRef.defaults.timeout = 60000;

        // Set the base URI
        if (!isEmpty(data) && has(data,'base_uri')) {
            this.httpService.axiosRef.defaults.baseURL = data.base_uri;
        }

        // Set the authentication headers
        if (!isEmpty(data) && has(data,'auth')) {
            let { auth } = data;
            this.httpService.axiosRef.defaults.headers.common['Authorization'] = `${auth.type} ${auth.token}`;
        }

        // Return the HttpService instance
        return this.httpService;
    }

    /**
     * Logs in to the Amrod vendor service.
     * 
     * @param data The data containing the customer code, password, and username.
     * @returns {Object} An object containing the authentication token.
     * @throws {AmrodServiceException} If an error occurs during the login process.
     */
    async login(data: any): Promise<{ token: string }> {
        // Try to login to the Amrod vendor service
        try {
            // Construct the URL for the login request
            let url = `${this.config.endpoints.auth_uri}/${this.config.endpoints.login}`;

            // Extract the customer code, password, and username from the data
            let { account_number: CustomerCode, password: Password, username: UserName } = data;

            // Make a POST request to the login endpoint
            let { data: auth_data } = await firstValueFrom(
                this.request({ base_uri: this.config.endpoints.auth_uri }).post(url, { CustomerCode, Password, UserName })
            );

            // Store the authentication token in the cache
            this.cacheManager.set('amrod_auth', { type: 'Bearer', token: auth_data.token });

            // Return the authentication token
            return { token: auth_data.token };

        } catch (error) {
            // Log any errors that occur during the login process
            this.logger.error(`Login: ${error}`);

            // Throw an AmrodServiceException with the error
            throw new AmrodServiceException(error);
        }
    }
        
    /**
     * Fetches all products from the Amrod API
     * 
     * @returns {Promise<Array<Object>>} A promise that resolves with an array of product objects
     * @throws {AmrodServiceException} If an error occurs during the request
     */
    async getProducts(): Promise<Array<any>> {
        try {

            // Get the authentication token from the cache
            let auth = await this.cacheManager.get('amrod_auth');

            // Make a GET request to the Amrod API to fetch all products
            let { data } = await firstValueFrom( this.request({ base_uri: this.config.endpoints.vendor_uri, auth }).get(`${this.config.endpoints.products.with_branding}`) );

            // Return the fetched products
            return data;

        } catch (error) {

            // Log any errors that occur during the request
            this.logger.error(`Products: ${error}`);

            // Throw an AmrodServiceException with the error
            throw new AmrodServiceException(error);

        }

    }

    /**
     * Fetches updated products from the Amrod API.
     * 
     * @returns {Promise<Array<any>>} A promise that resolves with an array of updated product objects.
     * @throws {AmrodServiceException} If an error occurs during the request.
     */
    async getUpdatedProducts(): Promise<Array<any>> {
        try {
            // Retrieve the authentication token from the cache
            let auth = await this.cacheManager.get('amrod_auth');

            // Construct the request URL using the vendor URI and endpoint for updated products
            let requestUrl = `${this.config.endpoints.vendor_uri}${this.config.endpoints.products.update_without_branding}`;

            // Execute a GET request to fetch updated products from the Amrod API
            let { data } = await firstValueFrom(
                this.request({ base_uri: this.config.endpoints.vendor_uri, auth }).get(requestUrl)
            );

            // Return the fetched updated products data
            return data;

        } catch (error) {
            // Log any errors encountered during the request
            this.logger.error(`Products: ${error}`);

            // Throw an AmrodServiceException containing the error details
            throw new AmrodServiceException(error);
        }
    }

    /**
     * Fetches all stocks from the Amrod API
     * 
     * @returns {Promise<Array<Object>>} A promise that resolves with an array of stock objects
     */
    async getStock(): Promise<any> {
        try {

            // Get the authentication token from the cache
            let auth  = await this.cacheManager.get('amrod_auth');

            // Make a GET request to the Amrod API to fetch all stocks
            let { data }  = await firstValueFrom( this.request({ base_uri: this.config.endpoints.vendor_uri, auth }).get(`${this.config.endpoints.stocks.all}`) );

            // Return the fetched stocks
            return data;

        } catch (error) {

            // Log any errors that occur during the request
            this.logger.error(`Stock: ${error}`);

            // Throw an AmrodServiceException with the error
            throw new AmrodServiceException(error);

        }

    }

    /**
     * Fetches all stocks from the Amrod API
     * 
     * @returns {Promise<Array<Object>>} A promise that resolves with an array of stock objects
     */
    async getUpdatedStock(): Promise<Array<Object>> {
        try {
            // Get the authentication token from the cache
            let auth  = await this.cacheManager.get('amrod_auth');

            // Make a GET request to the Amrod API to fetch all stocks
            let { data }  = await firstValueFrom( this.request({ base_uri: this.config.endpoints.vendor_uri, auth }).get(`${this.config.endpoints.stocks.updated}`) );

            // Return the fetched stocks
            return data;

        } catch (error) {
            // Log any errors that occur during the request
            this.logger.error(`Stock: ${error}`);
            
            // Throw an AmrodServiceException with the error
            throw new AmrodServiceException(error);

        }

    }    

    /**
     * Fetches all prices from the Amrod API
     * 
     * @returns {Promise<Array<Object>>} A promise that resolves with an array of price objects
     */
    async getPrices(): Promise<Array<any>> {
        try {

            // Get the authentication token from the cache
            let auth  = await this.cacheManager.get('amrod_auth');

            // Make a GET request to the Amrod API to fetch all prices
            let { data }  = await firstValueFrom( this.request({ base_uri: this.config.endpoints.vendor_uri, auth }).get(`${this.config.endpoints.prices.all}`) );

            // Return the fetched prices
            return data;

        } catch (error) {

            // Log any errors that occur during the request
            this.logger.error(`Prices: ${error}`);

             // Throw an AmrodServiceException with the error
            throw new AmrodServiceException(error);

        }

    }

    /**
     * Fetches all prices from the Amrod API
     * 
     * @returns {Promise<Array<Object>>} A promise that resolves with an array of price objects
     */
    async getUpdatedPrices(): Promise<Array<any>> {
        try {

            // Get the authentication token from the cache
            let auth  = await this.cacheManager.get('amrod_auth');

            // Make a GET request to the Amrod API to fetch all prices
            let { data }  = await firstValueFrom( this.request({ base_uri: this.config.endpoints.vendor_uri, auth }).get(`${this.config.endpoints.prices.updated}`) );

            // Return the fetched prices
            return data;

        } catch (error) {

            // Log any errors that occur during the request
            this.logger.error(`Prices: ${error}`);

             // Throw an AmrodServiceException with the error
            throw new AmrodServiceException(error);

        }

    }


    /**
     * Fetches all categories from the Amrod API.
     *
     * @returns {Promise<Array<Object>>} A promise that resolves with an array of category objects.
     * @throws {AmrodServiceException} If an error occurs during the request.
     */
    async getCategories(){

        try{

            // Get the authentication token from the cache
            let auth = await this.cacheManager.get('amrod_auth');

            // Make a GET request to the Amrod API to fetch all categories
            let { data } = await firstValueFrom( this.request({ base_uri: this.config.endpoints.vendor_uri, auth }).get(`${this.config.endpoints.categories.all}`) );
            
            // Return the fetched categories
            return data;

        } catch (error) {

            // Log any errors that occur during the request
            this.logger.error(`Categories: ${error}`);
            
            // Throw an AmrodServiceException with the error
            throw new AmrodServiceException(error);
        }

    }

    /**
     * Fetches the list of brands.
     * 
     * @returns {Promise<any>} The data containing the list of brands
     */
    async getBrands(){

        try{

            // Get the authentication token from the cache
            let auth = await this.cacheManager.get('amrod_auth');

            // Make a GET request to the Amrod API to fetch all brands
            let { data } = await firstValueFrom(this.request({ base_uri: this.config.endpoints.vendor_uri, auth }).get(`${this.config.endpoints.brands.all}`) );
            
            return data;

        } catch (error) {

            // Log any errors that occur during the request
            this.logger.error(`Brands: ${error}`);

            // Throw an AmrodServiceException with the error
            throw new AmrodServiceException(error);
        }

    }

    /**
     * Fetches the list of updated brands from the Amrod API.
     * 
     * @returns {Promise<any>} The data containing the list of updated brands
     * @throws {AmrodServiceException} If an error occurs during the request
     */
    async getUpdatedBrands(){

        try{

            // Get the authentication token from the cache
            let auth = await this.cacheManager.get('amrod_auth');

            // Make a GET request to the Amrod API to fetch all updated brands
            let { data } = await firstValueFrom(this.request({ base_uri: this.config.endpoints.vendor_uri, auth }).get(`${this.config.endpoints.brands.updated}`) );
            
            return data;

        } catch (error) {

            // Log any errors that occur during the request
            this.logger.error(`Brands: ${error}`);

            // Throw an AmrodServiceException with the error
            throw new AmrodServiceException(error);
        }

    }    

}
