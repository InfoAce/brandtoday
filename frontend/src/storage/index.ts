import { isEmpty } from 'lodash';
import localStorage from 'reactive-localstorage';

export default {
    /**
     * Install the plugin.
     *
     * @param {object} app - The Vue app instance.
     */
    install: (app: any) => {
        // Get the Vuex store instance.
        const $store = app.config.globalProperties.$store;

        // Get the name of the application from the Vuex store.
        const { VITE_APP_ID } = $store.getters.env;

        // Get the authentication data stored in the local storage.
        const auth = localStorage.getItem(VITE_APP_ID);

        /**
         * If the authentication data is not empty, commit it to the Vuex store.
         */
        if (!isEmpty(auth)) {
            // Parse the authentication data from JSON and commit it to the Vuex store.
            $store.commit('auth', JSON.parse(auth));
        }

        // Add a change listener to the local storage.
        localStorage.on('change', (key, value) => {

            // If the key is the authentication key, parse the value from JSON and commit it to the Vuex store.
            if( key == VITE_APP_ID ) {
                const auth = JSON.parse(value);
                app.config.globalProperties.$api.interceptors.request.use(
                    (config) => {
                        if( !isEmpty(auth) ){
                            config.headers.Authorization = `${auth.token.token_type} ${auth.token.token}`;
                        }
                        return config;
                    },
                    error => Promise.reject(error)
                );
                $store.commit('auth',auth);
            }
        });
    }
}
