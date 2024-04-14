

import appStore from './stores';
import api from './api'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import toast from './toast';

window.document.querySelector('title').innerHTML = `${import.meta.env.VITE_APP_NAME}`;

import { VueReCaptcha } from 'vue-recaptcha-v3'

// const component = {
//   setup() {
//     const { executeRecaptcha, recaptchaLoaded } = useReCaptcha()

//     const recaptcha = async () => {
//       // (optional) Wait until recaptcha has been loaded.
//       await recaptchaLoaded()

//       // Execute reCAPTCHA with action "login".
//       const token = await executeRecaptcha('login')

//       // Do stuff with the received token.
//     }

//     return {
//       recaptcha
//     }
//   },
//   template: '<button @click="recaptcha">Execute recaptcha</button>'
// }


const app = createApp(App)

app.use(toast);
app.use(appStore)
app.use(router)
app.use(api,{
    store: appStore
});
app.use(VueSweetalert2);
app.use(VueReCaptcha, { siteKey: '6LfUKLkpAAAAAMFo0iomiilG1QUpAkw8Xph5tz-Y' })

app.mount('#app')
