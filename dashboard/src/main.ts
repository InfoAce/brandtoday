import appStore from './stores';
import api from './api'
import { createApp } from 'vue'
import router from './router'
import App from './App.vue';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import toast from './toast';
import storage from './storage';

import { RouterView } from 'vue-router';

const app = createApp(RouterView)

app.use(toast);
app.use(appStore)
app.use(storage);
app.use(router)
app.use(api);
app.use(VueSweetalert2);
app.mount('#app')
