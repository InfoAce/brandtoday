import { registerAs } from "@nestjs/config"
import { sep } from 'path';

export default registerAs('services',() => {
    
    const json      = require('json-reader-writer');
    const { 
        amrod: {
            account_number,
            auth_uri,
            password,
            username,
            vendor_uri,
        }
    } = json.readJSON(`${process.cwd()}${sep}configurations.json`);

    return {
        amrod:{
            version: 'v1',
            endpoints: {
                auth_uri,
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
                    with_branding:    'Products/GetProductsAndBranding',
                    without_branding: 'Products',
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
        }
    };

});