<template>
    <div>
        <!-- footer -->
        <footer class="footer-light">
            <section class="section-b-space">
                <div class="container">
                    <div class="row footer-theme partition-f">
                        <div class="col px-0">
                            <div class="footer-title footer-mobile-title">
                                <h4>about</h4>
                            </div>
                            <div class="footer-contant">
                                <div class="footer-logo" v-show="!isEmpty(home.company)">
                                    <i v-if="isNull(home.company.white_logo)" class="fa fa-image fa-10x"></i>
                                    <img v-else :src="home.company.white_logo" width="200" :alt="home.company.name">
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
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div>
                <div class="container">
                    <div class="row">
                        <div class="col-xl-6 col-md-6 col-sm-12">
                            <div class="footer-end">
                                <p class="text-white"><i class="fa fa-copyright" aria-hidden="true"></i> {{ moment().format('Y') }} {{ $store.getters.env.VITE_APP_NAME }}</p>
                            </div>
                        </div>
                        <!-- <div class="col-xl-6 col-md-6 col-sm-12">
                            <div class="payment-card-bottom">
                                <ul>
                                    <li>
                                        <a href="#"><img src="/assets/home/images/icon/visa.png" alt=""></a>
                                    </li>
                                    <li>
                                        <a href="#"><img src="/assets/home/images/icon/mastercard.png" alt=""></a>
                                    </li>
                                    <li>
                                        <a href="#"><img src="/assets/home/images/icon/paypal.png" alt=""></a>
                                    </li>
                                    <li>
                                        <a href="#"><img src="/assets/home/images/icon/american-express.png" alt=""></a>
                                    </li>
                                    <li>
                                        <a href="#"><img src="/assets/home/images/icon/discover.png" alt=""></a>
                                    </li>
                                </ul>
                            </div>
                        </div> -->
                    </div>
                </div>
            </div>
        </footer>
        <!-- footer end -->

        <!-- Modal start -->
        <div class="modal logout-modal fade" id="logout" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Logging Out</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Do you want to log out?
                    </div>
                    <div class="modal-footer">
                        <a href="#" class="btn btn-dark btn-custom" data-bs-dismiss="modal">no</a>
                        <a href="index.html" class="btn btn-solid btn-custom">yes</a>
                    </div>
                </div>
            </div>
        </div>
        <!-- modal end -->


        <!-- cookie bar start -->
        <div class="cookie-bar">
            <p>We use cookies to improve our site and your shopping experience. By continuing to browse our site you accept
                our cookie policy.</p>
            <a href="javascript:void(0)" class="btn btn-solid btn-xs">accept</a>
            <a href="javascript:void(0)" class="btn btn-solid btn-xs">decline</a>
        </div>
        <!-- cookie bar end -->

        <!-- theme setting -->
        <div class="theme-settings">
            <ul>
                <li>
                    <div class="dark-btn">Dark</div>
                </li>
            </ul>
        </div>
        <!-- theme setting -->

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
    </div>
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
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import moment from 'moment';

// Magic functions 
const $store = useStore();
const $router = useRouter();

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

</script>