import { registerAs } from "@nestjs/config"
import { sep } from 'path';
import * as fs from 'fs';

export default registerAs('services',() => {

    const home = !process.cwd().includes('backend') ? `${process.cwd()}${sep}backend` : process.cwd();
    const json = require('json-reader-writer');
    const { 
        amrod: {
            account_number,
            auth_uri,
            password,
            username,
            vendor_uri,
        },
        pesapal:{
            consumer_key,
            consumer_secret
        }
    } = json.readJSON(`${home}${sep}configurations.json`);

    return {
        amrod:{
            version: 'v1',
            endpoints: {
                auth_uri,
                brands:{
                    all: '/Brands/',
                    updated: '/Brands/GetUpdated'  
                },
                vendor_uri,
                categories: {
                    all: 'Categories'
                },
                login: 'VendorLogin',
                prices:{
                    all: 'Prices',
                    updated: 'Prices/GetUpdated'
                },
                products: {
                    update_without_branding: 'Products/GetUpdatedProducts',
                    with_branding:           'Products/GetProductsAndBranding',
                    without_branding:        'Products',
                },
                stocks:{
                    all: 'Stock',
                    updated: 'Stock/GetUpdated'
                }
            },
            credentials:{
                account_number,
                password,
                username
            }
        },
        pesapal: {
            base:{
                live: "https://cybqa.pesapal.com/pesapalv3/api", // live phase endpoint
                sandbox:    "https://pay.pesapal.com/v3/api", // testing phase endpoint
            },
            endpoints: {
                auth:         "/Auth/RequestToken", // get authorization token4
                getipns:      "/URLSetup/GetIpnList", // list all Instant Payment Notification
                status:       "/Transactions/GetTransactionStatus", // track the transaction status
                registeripn:  "/URLSetup/RegisterIPN", // register Instant Payment Notification
                ipn:          "/URLSetup/RegisterIPN", // create an Instant Payment Notification
                live:         "https://pay.pesapal.com/v3/api", // testing phase endpoint
                orderRequest: "/Transactions/SubmitOrderRequest", // create an order request for a client
                sandbox:      "https://cybqa.pesapal.com/pesapalv3/api" // live phase endpoint
            },
            configuration:{
                consumer_key,
                consumer_secret
            }
        }
    };

});