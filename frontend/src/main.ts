

import appStore from './stores';
import api from './api'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from './assets/icons'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import toast from './toast';

const app = createApp(App)

app.use(CoreuiVue)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.use(toast);
app.use(appStore)
app.use(router)
app.use(api,{
    store: appStore
});
app.use(VueSweetalert2);

app.mount('#app')
