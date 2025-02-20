import axios from 'axios';
import { get, isEmpty, toPlainObject } from 'lodash';
import localStorage from 'reactive-localstorage';

export default {
    install: (app: any, options: any) => {
        // Get vue store from app instance
        let $store = app.config.globalProperties.$store;

        // Get store state getters
        let { auth, env:{ VITE_APP_ID, VITE_API_URL } } = toPlainObject($store.getters);    
        
        // Init axios
        let api = axios.create({
            baseURL: `${VITE_API_URL}`,
            headers: {
                'Accept':           'application/json',  
                'X-Requested-With': 'XMLHttpRequest'
            },
        });

        if( !isEmpty(auth) ){
            let { token_type, token } = auth.token;

            api.interceptors.request.use(
                (config) => {
                    config.headers.Authorization = `${token_type} ${token}`;
                    return config;
                },
                error => Promise.reject(error)
            );
        }

        api.interceptors.response.use(
            response => response,
            (error) => {
                if (error.response.status === 401) {
                    // If the request is successful, save the user and token to local storage
                    localStorage.setItem(VITE_APP_ID, JSON.stringify({}));
                }
                return Promise.reject(error);
            }
        );

        app.provide('$api', api);
        app.config.globalProperties.$api = api;
    }
}
