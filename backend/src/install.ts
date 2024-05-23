const { isEmpty }  = require('lodash');
const randomstring = require("randomstring");
const fs           = require("fs");
const os           = require("os");
const { sep }      = require('path');

async function init(){
    setEnvValue("APP_KEY",randomstring.generate(50));
    setEnvValue("JWT_SESSION_KEY",randomstring.generate(100));
    setupAmrodData();
    console.log('Setup complete');
}

function setEnvValue(key, value) {

    // read file from hdd & split if from a linebreak to a array
    const ENV_VARS      = fs.readFileSync("./.env", "utf8").split(os.EOL);
    let   NEW_ENV_VARS  = [];

    // find the env we want based on the key
    if( !isEmpty(ENV_VARS) && ENV_VARS.length === 1 ){
        NEW_ENV_VARS = ENV_VARS[0].split('\n').map((item) => {
            const target = item.match(new RegExp(key));
            if( !isEmpty(target) ){
                item = `${target}=${value}`;
            }           
            return item;
        });
    }  
    
    if( !isEmpty(ENV_VARS) && ENV_VARS.length > 1 ){
        NEW_ENV_VARS = ENV_VARS.map((item) => {
            const target = item.match(new RegExp(key));
            if( !isEmpty(target) ){
                item = `${target}=${value}`;
            }
            return item;
        });
    }

    // // write everything back to the file system
    fs.writeFileSync("./.env", NEW_ENV_VARS.join(os.EOL));

}

function setupAmrodData() {

    console.log("Setting up amrod data");

    const amrod_data = {
        brands:     `${process.cwd()}${sep}public${sep}amrod${sep}brands.json`,
        categories: `${process.cwd()}${sep}public${sep}amrod${sep}categories.json`,
        prices:     `${process.cwd()}${sep}public${sep}amrod${sep}prices.json`,
        products:   `${process.cwd()}${sep}public${sep}amrod${sep}products.json`,
        stocks:     `${process.cwd()}${sep}public${sep}amrod${sep}stock.json`,
    };

    console.log("Check if files exists.");

    for( let value in amrod_data ){
        if( !fs.existsSync(amrod_data[value]) ){
            fs.writeFileSync(amrod_data[value],JSON.stringify([]));
            console.log(`Done creating file on ${amrod_data[value]}`);
        }
    }

    console.log("Done setting up amrod data.");

}

init();