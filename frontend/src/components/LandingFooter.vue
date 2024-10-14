<template>
    <!-- footer -->
    <footer class="footer-light p-4 m-0">
        <div class="container-fluid">
            <div class="row footer-theme partition-f p-4">
                <div class="col px-0">
                    <div class="footer-title footer-mobile-title">
                        <h4>about</h4>
                    </div>
                    <div class="footer-contant">
                        <div class="footer-logo" v-show="!isEmpty(home.company)">
                            <i v-if="isNull(home.company.white_logo)" class="fa fa-image fa-10x"></i>
                            <img v-else :src="`${$store.getters.assetsUrl}${home.company.white_logo}`" width="200" :alt="home.company.name">
                        </div>
                    </div>
                </div>
                <div class="col px-0">
                    <div class="sub-title">
                        <div class="footer-title">
                            <h4>Shop by categories</h4>
                        </div>
                        <div class="footer-contant">
                            <ul>
                                <li v-for="(category,index) in home.categories" :key="index">
                                    <a href="#" @click.prevent="navigateTo(category)">{{ category.name }}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col px-0">
                    <div class="sub-title">
                        <div class="footer-title">
                            <h4>Company</h4>
                        </div>
                        <div class="footer-contant">
                            <ul>
                                <li><a href="#" @click.prevent="$router.push({ name: 'AboutUs'})">Get To Know Us</a></li>
                                <li><a href="#" @click.prevent="$router.push({ name: 'PrivacyPolicy'})">Privacy Policy</a></li>
                                <li><a href="#" @click.prevent="$router.push({ name: 'ReturnRefunds'})">Return & Refunds</a></li>
                                <li><a href="#" @click.prevent="$router.push({ name: 'TermsAndConditions'})">Terms & Conditions</a></li>
                                <li><a href="#" @click.prevent="$router.push({ name: 'Faqs'})">Frequently Asked Questions</a></li>
                                <li><a href="#" @click.prevent="$router.push({ name: 'Faqs'})">Branding Techniques</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col px-0">
                    <div class="sub-title">
                        <div class="footer-title">
                            <h4>Shop</h4>
                        </div>
                        <div class="footer-contant">
                            <ul>
                                <li><a href="#" @click.prevent="$router.push({ name: 'AccountProfile'})">My Account</a></li>
                                <li><a href="#" @click.prevent="$router.push({ name: 'AccountFavourites'})">My Wishlist</a></li>
                                <li><a href="#" @click.prevent="$router.push({ name: 'Brands'})">Our Brands</a></li>
                            </ul>
                        </div>
                    </div> 
                </div>
                <div class="col px-0">
                    <div class="sub-title">
                        <div class="footer-title">
                            <h4>Contact Us</h4>
                        </div>
                        <div class="footer-contant">
                            <ul class="contact-list">
                                <li><i class="fa fa-map-marker"></i>Location: {{ home.company.address }}</li>
                                <li><i class="fa fa-phone"></i>Call Us: {{ home.company.phone_number }}</li>
                                <li><i class="fa fa-envelope"></i>Email Us: <a href="#">{{ home.company.email }}</a></li>
                                <li><a :href="`https://wa.me/${$data.whatsapp.number}?text=${encodeURIComponent($data.whatsapp.message)}`" target="_blank"><img src="/assets/images/whatsapp-icon.png" width="150"/></a></li>
                                <li><h2>Send us a Google Review</h2></li>
                                <li><a href="https://g.co/kgs/3t2sxBs" target="_blank"><img src="/assets/images/google-review-symbol.png" width="150"/></a></li>
                                <li><a href="https://www.suavemarketing.co.ke/" target="_blank"><img src="/assets/images/suave.webp" width="150"/></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <p class="text-white"><i class="fa fa-copyright" aria-hidden="true"></i> {{ moment().format('Y') }} {{ $store.getters.env.VITE_APP_NAME }}</p>
                </div>
            </div>
        </div>
        <!-- tap to top -->
        <div class="tap-top top-cls">
            <div>
                <i class="fa fa-angle-double-up"></i>
            </div>
        </div>  
        <div id="payment_box">
            <div class="header">
                <button id="transaction_cancel"> <i class="fa fa-times fa-lg text-danger" alt="Cancel"></i> </button>
            </div>
            <div class="body"></div>
        </div>
    </footer>
    <!-- footer end -->      
</template>
<style scoped>
#payment_box {
    position: fixed;
    background-color: #fff;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 9998;
    display: block;
    overflow-y: hidden;
    overflow-x: hidden;
    visibility: hidden;
    padding: 2em;
}
#payment_box .header {
    padding-bottom: 2em;
    display: flex;
    justify-content:end;
}
#payment_box .body {
    border: 3px solid #ededed;
}
#payment_box .header button {
    border: 1px solid #ededed;
    border-radius: 100%;    
    height: 4.5em;
    width: 4.5em;
    background-color: #fff;
}
#payment_box .header button:hover {
    border: 2px solid #cdcdcd;
    background-color: #ededed;
}
</style>
<script setup>
import { isEmpty, isNull } from 'lodash';
import { computed, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import moment from 'moment';

// Magic functions 
const $store  = useStore();
const $router = useRouter();
const $data   = reactive({
    whatsapp:{
        number:  '+254714123456',
        message: 'Hello, I would like to know more about your products'
    }
});

// Computed
const backendUri = computed( () => $store.getters.env.VITE_API_URL.replace('api/v1','') );
const home       = computed( () => $store.getters.home);

// Methods
/**
 * Navigates to the category page with the given category name as query parameter.
 *
 * @param {Object} item - The category object containing the category name.
 * @return {Object} The navigation object returned by the Vue Router.
 */
 const navigateTo = (item) => {
    $store.commit('loader',true);
    // Use the Vue Router to navigate to the Category page with the category name as query parameter.
    $router.push({ 
        name:   'Category', 
        params: { category: item.id } 
    });
}

const send_handle = () => {
  const num = document.getElementById("number").value;
  const msg = document.getElementById("msg").value;
  const name = document.getElementById("name").value;

  const win = window.open(`https://wa.me/${num}?text=I%27m%20api%20msg%20hello%20${name}%20friend%20${msg}`, '_blank');
  // win.focus();
}

</script>