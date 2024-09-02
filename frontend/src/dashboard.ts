

import appStore from './stores';
import api from './api'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import toast from './toast';

// window.document.querySelector('title').innerHTML = `${import.meta.env.VITE_APP_NAME}`;

import storage from './storage';

import "skeleton-screen-css";
// import themes from './theme';

const app = createApp(App)

app.use(toast);
app.use(appStore)
app.use(storage);
app.use(router)
app.use(api);
app.use(VueSweetalert2);
// app.use(themes,{ router });
app.mount('#app')
