const { isEmpty }  = require('lodash');
const randomstring = require("randomstring");
const fs           = require("fs");
const os           = require("os");

async function init(){
    setEnvValue("APP_KEY",randomstring.generate(50));
    setEnvValue("COOKIE_KEY",randomstring.generate(32));
    setEnvValue("CSRF_KEY",randomstring.generate(32));
    setEnvValue("SESSION_KEY",randomstring.generate(32));
    setEnvValue("JWT_SESSION_KEY",randomstring.generate(100));
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
    } else if( !isEmpty(ENV_VARS) && ENV_VARS.length > 1 ){
        NEW_ENV_VARS = ENV_VARS.map((item) => {
            const target = item.match(new RegExp(key));
            console.log(target);
            // if( !isEmpty(target) ){
            //     item = `${target}=${value}`;
            // }
            return item;
        });
    }

    // // write everything back to the file system
    fs.writeFileSync("./.env", NEW_ENV_VARS.join(os.EOL));

}

init();