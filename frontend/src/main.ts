

import appStore from './stores';
import api from './api'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from './assets/icons'

import Toast, { PluginOptions } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
// import '@coreui/coreui/dist/css/coreui.min.css';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { createHead } from '@unhead/vue'

// const scripts = [
// 	'/assets/js/jquery-3.3.1.min.js',
// 	'/assets/js/jquery-ui.min.js',
// 	'/assets/js/bootstrap.bundle.min.js',
// 	'/assets/js/bootstrap-notify.min.js',	
// 	'/assets/js/jquery.exitintent.js',	
// ].map( 
// 	async (url) => new Promise( 
// 		resolve => setTimeout( async() => resolve(addScript(url)),0)
// 	) 
// )

// const addScript = (url:string) => {
//     let script  = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src  = url;
//     document.body.appendChild(script);
// }

// Promise.all(scripts);

const app = createApp(App)

app.use(CoreuiVue)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.use(Toast);
// app.component('EasyDataTable', Vue3EasyDataTable);
app.use(appStore)
app.use(router)
app.use(api,{
    store: appStore
});
app.use(createHead())
app.use(VueSweetalert2);

app.mount('#app')
