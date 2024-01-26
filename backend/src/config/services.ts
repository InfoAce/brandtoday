import { registerAs } from "@nestjs/config"

export default registerAs('services',() => ({
    amrod:{
        endpoints: {
            auth:   'https://identity.amrod.co.za',
            vendor: 'https://vendorapi.amrod.co.za'
        }
    }
}));