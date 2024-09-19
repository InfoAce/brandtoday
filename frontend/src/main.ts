

import appStore from './stores';
import api from './api'

import { createApp } from 'vue'

import router from './router'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import toast from './toast';


import { VueReCaptcha } from 'vue-recaptcha-v3';
import storage from './storage';

import "skeleton-screen-css";
import { RouterView } from 'vue-router';
import App from './App.vue';
import InfiniteScroll from "@kurtliao/vue-infinite-scroll";

const app                         = createApp(App)
const { VITE_RECAPTCHA_SITE_KEY } = import.meta.env;

app.directive("InfiniteScroll", InfiniteScroll);
app.use(toast);
app.use(appStore)
app.use(storage);
app.use(router)
app.use(api);
app.use(VueSweetalert2);
app.use(VueReCaptcha, { siteKey: VITE_RECAPTCHA_SITE_KEY });
app.mount('#app')

