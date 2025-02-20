import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { has, isEmpty, pick } from 'lodash';
import { PesapalServiceException } from "src/exceptions/pesapal.exception";
import { sep } from 'path';

const json = require('json-reader-writer');

@Injectable()
export class PesapalService {

    private readonly config;

    private readonly home;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.home   = !process.cwd().includes('backend') ? `${process.cwd()}${sep}backend` : process.cwd();
        this.config = this.configService.get<string>('services.pesapal');
    }

    // Interceptor with authentication
    request(data: any = {}){
        
        let headers             = { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        let { pesapal:{ uri } } = json.readJSON(`${this.home}${sep}config.json`);

        if( !isEmpty(data) ){
            if( has(data,'auth') ){
                headers['Authorization'] = `${data.auth.type} ${data.auth.token}`;
                // axios.defaults.timeout = 50000; 
            }
        }
        
        return axios.create({
            baseURL: uri,
            timeout: 60000,
            headers
        });
    }

    /**
     * Authenticate with Pesapal API
     * Retrieves an authentication token from Pesapal API
     * 
     * @returns {Promise<Object>} - The authentication response from Pesapal API
     * @throws {PesapalServiceException} - If there is an error during authentication
     */
    async auth(){

        try {

            // Retrieve consumer key and secret from config
            let { pesapal:{ consumer_key, consumer_secret } } = json.readJSON(`${this.home}${sep}config.json`);

            // Send POST request to Pesapal API authentication endpoint
            // with consumer key and secret
            let { data } = await this.request().post(this.config.endpoints.auth,{ consumer_key, consumer_secret });
            
            // Return authentication response from Pesapal API
            return data;

        } catch(error) {
            console.log(error);
            // Throw PesapalServiceException if there is an error during authentication
            throw new PesapalServiceException(error);
        }

    }

    /**
     * Creates an order with Pesapal.
     * This endpoint is used to create an order request for a client.
     * @param data { id: string, currency: string, amount: number, description: string, callback_url: string, notification_id: string, billing_address: Object }
     * @param auth string
     * @returns { Promise<Object> }
     * @throws {PesapalServiceException}
     */
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

        try {

            // Send POST request to Pesapal API order request endpoint
            // with the order data
            let { data: response_data } = await this.request({ auth: { type: 'Bearer', token: auth } }).post(this.config.endpoints.orderRequest,pick(data,['id','currency','amount','description','callback_url','notification_id','billing_address']));

            // Return the order response from Pesapal API
            return response_data;

        } catch(error){
            // Throw a PesapalServiceException if there is an error
            throw new PesapalServiceException(error);
        }

    }    

    /**
     * Registers an Instant Payment Notification (IPN) URL with Pesapal.
     * This endpoint is used to receive notifications when a transaction is
     * processed or when a transaction status changes.
     * @param data { url: string, ipn_notification_type: string }
     * @param auth string
     * @returns { Promise<Object> }
     * @throws {PesapalServiceException}
     */
    async registerIPN(
        data: any = { url: String(), ipn_notification_type: String() },
        auth: string
    ){

        try {

            let { url, ipn_notification_type }  = data;

            // Send a POST request to the register IPN endpoint with the IPN URL and notification type
            let { data: response_data } = await this.request({ auth: { type: 'Bearer', token: auth } }).post(this.config.endpoints.registeripn,{ url, ipn_notification_type })

            // Return the response data
            return response_data;

        } catch(error){
            // Throw a PesapalServiceException if there is an error
            throw new PesapalServiceException(error);
        }

    } 
    
    /**
     * Retrieves the transaction status from Pesapal.
     * 
     * @param order_id - The tracking ID of the order to check status for.
     * @param auth - The authentication token for accessing Pesapal API.
     * @returns {Promise<Object>} - The response data containing transaction status.
     * @throws {PesapalServiceException} - If there is an error during the request.
     */
    async transactionStatus(
        order_id: string,
        auth: string
    ): Promise<any> {

        try {
            // Send a GET request to the transaction status endpoint with the order tracking ID
            let { data: response_data } = await this.request({ auth: { type: 'Bearer', token: auth } }).get(`${this.config.endpoints.status}?orderTrackingId=${order_id}`);

            // Return the response data containing the transaction status
            return response_data;

        } catch (error) {
            // Throw a PesapalServiceException if there is an error
            throw new PesapalServiceException(error);
        }

    }
}