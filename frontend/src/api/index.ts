import axios from 'axios';
import { isEmpty, toPlainObject } from 'lodash';

export default {
    install: (app: any, options: any) => {
        // State variables
        let { auth, env:{ VITE_API_URL } } = toPlainObject(app.config.globalProperties.$store.getters);
        console.log(auth);
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
                    // console.debug('[Bekreftelser] Intercepting api response');
                    // store.commit('auth',{});
                    // sessionStorage.clear();
                    // window.location.href = VUE_APP_API_BASE_URL.replace('api', '');
                }
                return Promise.reject(error);
            }
        );

        app.provide('$api', api);
        app.config.globalProperties.$api = api;
    }
}
