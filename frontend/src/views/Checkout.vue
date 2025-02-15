<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container-fluid">
                <div class="row px-4">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h4>Checkout</h4>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <nav aria-label="breadcrumb" class="theme-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#" @click="$router.push({ name: 'Home' })">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Checkout</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <!-- breadcrumb End -->

        <!-- section start -->
        <section class="section-b-space" v-if="!$data.saved">
            <div class="container-fluid">
                <div class="checkout-page px-4">
                    <div class="checkout-form pb-6">
                        <form>
                            <div class="row">
                                <div class="col-12">
                                    <div class="checkout-title">
                                        <h3>Billing Details</h3>
                                    </div>                                            
                                </div>
                                <div class="col-md-8">
                                    <form autocomplete="off" >
                                    <div class="row">
                                        <div class="col-12" v-show="isEmpty(authUser)">
                                            <div class="row check-out">
                                                <div class="col-12">
                                                    <h5>User information</h5>
                                                </div>
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <label for="fname" class="field-label">First Name</label>
                                                    <input type="text" class="form-control mb-2" autofill="off" autocomplete="off" id="fname" v-model="$data.form.first_name" placeholder="First Name" required="">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'first_name')">{{$data.errors.first_name}}</p>	
                                                </div>
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <label for="lname" class="field-label">Last Name</label>
                                                    <input type="text" class="form-control mb-2"  autocomplete="off" id="lname" v-model="$data.form.last_name" placeholder="Last Name" required="">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'last_name')">{{$data.errors.last_name}}</p>	
                                                </div>
                                                <div class="form-group col-12">
                                                    <label for="email" class="field-label">Email Address</label>
                                                    <input type="text" class="form-control mb-2"  autocomplete="off" id="email" v-model="$data.form.email" placeholder="Email" required="">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'email')">{{$data.errors.email}}</p>	
                                                </div>
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <label for="phone" class="field-label">Phone Number</label>
                                                    <vue-tel-input 
                                                        @input="getPhoneNumber" 
                                                        defaultCountry="KE"                                                     
                                                        :inputOptions="{ styleClasses: 'form-control m-1', placeholder: 'Phone Number' }" 
                                                        mode="international"
                                                        class="mb-2"
                                                    />
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'phone_number')">{{$data.errors.phone_number}}</p>	
                                                </div>                                                
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">Currency</div>
                                                    <Multiselect 
                                                        v-model="$data.form.currency"
                                                        :options="listCurrencies" 
                                                        searchable                                                  
                                                        placeholder="Currency"
                                                        class="mb-2"
                                                    />
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'currency')">{{$data.errors.currency}}</p>	
                                                </div>
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <label for="password" class="field-label">Password</label>
                                                    <input type="password" class="form-control mb-2" id="password" placeholder="Enter your password" v-model="$data.form.password" required="">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'password')">{{$data.errors.password}}</p>	
                                                </div>
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <label for="confirm_password" class="field-label mb-2">Confirm Password</label>
                                                    <input type="password" class="form-control mb-2" id="confirm_password" placeholder="Enter password confirmation" v-model="$data.form.confirm_password" required="">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'confirm_password')">{{$data.errors.confirm_password}}</p>	
                                                </div>
                                            </div>
                                            <div class="row check-out">
                                                <div class="col-12">
                                                    <h4>Address information</h4>
                                                </div>
                                                <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                                    <div class="field-label">Address Line 1</div>
                                                    <input type="text" name="field-name"  autocomplete="off"  v-model="$data.form.address_line_1" placeholder="Address Line 1">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'address_line_1')">{{$data.errors.address_line_1}}</p>	
                                                </div>
                                                <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                                    <div class="field-label">Address Line 2</div>
                                                    <input type="text" name="field-name"  autocomplete="off" v-model="$data.form.address_line_2" placeholder="Address Line 2">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'address_line_2')">{{$data.errors.address_line_2}}</p>	
                                                </div>
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">Postal Code</div>
                                                    <input type="text" name="field-name"  autocomplete="off" v-model="$data.form.postal_code" placeholder="Postal Code">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'postal_code')">{{$data.errors.postal_code}}</p>	
                                                </div>           
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">Country</div>
                                                    <Multiselect 
                                                        v-model="$data.form.country"
                                                        :options="listCountries" 
                                                        searchable                                                
                                                        placeholder="Country"
                                                    />
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'country')">{{$data.errors.country}}</p>	
                                                </div>                                       
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">State / County</div>
                                                    <input type="text" name="field-name"  autocomplete="off"  v-model="$data.form.county_state" placeholder="State / County">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'county_state')">{{$data.errors.county_state}}</p>	
                                                </div>  
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">Town / City</div>
                                                    <input type="text" name="field-name"  autocomplete="off" v-model="$data.form.city_town" placeholder="Town / City">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'city_town')">{{$data.errors.city_town}}</p>	
                                                </div>                                                                                               
                                            </div>
                                        </div>
                                        <div class="col-12" v-show="!isEmpty(authUser)">
                                            <div class="checkout-details" >
                                                <div class="checkout-title">
                                                    <h3>Address Details</h3>
                                                </div> 
                                                <template v-if="!isEmpty($data.addresses)">
                                                    <div class="col-12 mb-2 px-0" v-for="(address, index) in $data.addresses" :key="index">
                                                        <div class="card">
                                                            <div class="card-body d-flex align-items-center justify-content-between">
                                                                <input class="form-check-input" style="width: 2em; height: 2em; margin-top: 0 !important; position:relative !important; margin-left: 0 !important;" type="radio" name="address" :value="address.id" @input="selectAddress($event.target.value)" :id="`address_${index}`">                                                    
                                                                <label class="form-check-label">
                                                                    <strong>
                                                                        {{ address.address_line_1 }} <br>
                                                                        {{ address.address_line_2 }}
                                                                        {{ address.postal_code }}<br>
                                                                        {{ address.country }},
                                                                        {{ address.county_state }},
                                                                        {{ address.city_town }}
                                                                    </strong>
                                                                </label>
                                                                <div class="badge badge-danger">{{ address.category }}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <div class="col-12 px-0">
                                                        <h4 class="text-warning text-center">
                                                            <i class="fa fa-info-circle"></i>
                                                            No addresses found.
                                                            Click <router-link :to="$router.resolve({ name: 'AddressBook' }).path">here</router-link > to create an address.
                                                        </h4>
                                                    </div>
                                                </template>
                                                <h4 class="text-danger" v-show="has($data.errors,'address_id')">{{ $data.errors.address_id }}</h4>								
                                            </div>
                                        </div>
                                    </div>
                                    </form>
                                </div>
                                <div class="col-md-4 col-sm-12 col-xs-12">
                                    <div class="checkout-details">
                                        <p class="text-danger col col-12 mt-0" v-show="has($data.errors,'items')">{{$data.errors.items}}</p>
                                        <div class="order-box">
                                            <table class="table">
                                                <tbody>
                                                    <tr>
                                                        <td class="text-left"><strong>Sub Total</strong></td>
                                                        <td class="text-left">{{ currency }} {{ sub_total.toFixed(2) }}</td>
                                                    </tr>
                                                    <tr v-for="(fee, index) in $data.service_fees" :key="index">
                                                        <td class="text-left"><strong>{{ fee.name }}</strong></td>
                                                        <td class="text-left">
                                                            {{ currency }} 
                                                            <span v-if="fee.type == 'fixed'">{{ fee.amount }}"></span>
                                                            <span v-if="fee.type == 'percentage'">{{ (( fee.amount * sub_total ) / 100 ).toFixed(2) }}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="text-left"><strong>Total</strong></td>
                                                        <td class="text-left">{{ currency }} {{ total.toFixed(2) }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div class="row">
                                                <div class="col-12 mb-4">
                                                    <label>Save For Later</label>
                                                    <VueToggles v-model="$data.form.saved"/>               
                                                </div>
                                                <div class="col-12">
                                                    <button class="btn btn-theme btn-xl w-100" type="button" @click="recaptcha" :disabled="$data.isDisabled || $data.loader.order">
                                                        <i class="fa fa-spinner fa-spin" v-if="$data.loader.order"></i>
                                                        Place Order
                                                    </button>                      
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>        
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        <!-- section end -->   

        <div class="col-12 p-4" v-if="$data.saved">
            <!-- thank-you section start -->
            <section class="section-b-space light-layout">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="success-text">
                                <div class="checkmark">
                                    <svg class="star" height="19" viewBox="0 0 19 19" width="19"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
                                        </path>
                                    </svg>
                                    <svg class="star" height="19" viewBox="0 0 19 19" width="19"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
                                        </path>
                                    </svg>
                                    <svg class="star" height="19" viewBox="0 0 19 19" width="19"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
                                        </path>
                                    </svg>
                                    <svg class="star" height="19" viewBox="0 0 19 19" width="19"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
                                        </path>
                                    </svg>
                                    <svg class="star" height="19" viewBox="0 0 19 19" width="19"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
                                        </path>
                                    </svg>
                                    <svg class="star" height="19" viewBox="0 0 19 19" width="19"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
                                        </path>
                                    </svg>
                                    <svg class="checkmark__check" height="36" viewBox="0 0 48 36" width="48"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M47.248 3.9L43.906.667a2.428 2.428 0 0 0-3.344 0l-23.63 23.09-9.554-9.338a2.432 2.432 0 0 0-3.345 0L.692 17.654a2.236 2.236 0 0 0 .002 3.233l14.567 14.175c.926.894 2.42.894 3.342.01L47.248 7.128c.922-.89.922-2.34 0-3.23">
                                        </path>
                                    </svg>
                                    <svg class="checkmark__background" height="115" viewBox="0 0 120 115" width="120"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M107.332 72.938c-1.798 5.557 4.564 15.334 1.21 19.96-3.387 4.674-14.646 1.605-19.298 5.003-4.61 3.368-5.163 15.074-10.695 16.878-5.344 1.743-12.628-7.35-18.545-7.35-5.922 0-13.206 9.088-18.543 7.345-5.538-1.804-6.09-13.515-10.696-16.877-4.657-3.398-15.91-.334-19.297-5.002-3.356-4.627 3.006-14.404 1.208-19.962C10.93 67.576 0 63.442 0 57.5c0-5.943 10.93-10.076 12.668-15.438 1.798-5.557-4.564-15.334-1.21-19.96 3.387-4.674 14.646-1.605 19.298-5.003C35.366 13.73 35.92 2.025 41.45.22c5.344-1.743 12.628 7.35 18.545 7.35 5.922 0 13.206-9.088 18.543-7.345 5.538 1.804 6.09 13.515 10.696 16.877 4.657 3.398 15.91.334 19.297 5.002 3.356 4.627-3.006 14.404-1.208 19.962C109.07 47.424 120 51.562 120 57.5c0 5.943-10.93 10.076-12.668 15.438z">
                                        </path>
                                    </svg>
                                </div>
                                <h2>Order Successfully Saved</h2>
                                <p>Your order has been saved. You can click the link below to view the details.</p>
                                <button class="btn btn-theme btn-lg" @click="$router.push({ name: 'AccountOrders' })" v-if="!isEmpty(auth)">View Order</button>
                                <button class="btn btn-theme btn-lg" @click="$router.push({ name: 'Home' })" v-if="isEmpty(auth)">Continue Shopping</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <!-- Section ends -->
        </div>
    </div>
</template>
<style src="@vueform/multiselect/themes/default.css"></style>
<script setup lang="ts">

import { computed, inject, onBeforeMount, onMounted, reactive, watch } from 'vue';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useStore } from 'vuex';
import * as yup from "yup";
import { cloneDeep, debounce, each, first, isEmpty, has, get, omit, set, sum, values } from 'lodash';
import { VueTelInput } from 'vue3-tel-input';
import 'vue3-tel-input/dist/vue3-tel-input.css'
import { countries } from 'countries-list';
import Multiselect from '@vueform/multiselect'
import { useReCaptcha } from 'vue-recaptcha-v3';
import { useRouter } from 'vue-router';
import VueToggles from "vue-toggles";

// Data variables
const $api    = inject('$api');
const $toast  = inject('$toast');
const $store  = useStore();
const $router = useRouter();
const $data   = reactive({
    addresses: Array(),
    errors:    Object(),
    form:      Object(),
    loader:    {
        addresses: Boolean(),
        order:     Boolean(),
    },
    isDisabled:   Boolean(true),
    order:        Object(),
    saved:        Boolean(),
    service_fees: Array()
});
const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

// Computed
const auth       = computed( () => $store.getters.auth );
const authUser   = computed( () => $store.getters.auth.user );
const cart       = computed( () => $store.getters.cart );
const currency   = computed( () => $store.getters.home.company.currency );
const cart_items = computed({
    get(): any {
        return cloneDeep($store.getters.cart).map( (item: any) => {
            if( !isEmpty(item.sizes) ){
                set(item,'total_quantity',sum(item.sizes.map( (size:any) => size.quantity )) );
                if(has(item,'positions')){
                    set(item,'total_branding_cost', (sum(item.positions.map( (position:any) => position.price )) * item.total_quantity).toFixed(2));
                    set(item,'total_setup_cost', (sum(item.positions.map( (position:any) => position.setup )) * item.total_quantity).toFixed(2));
                    set(item,'total_amount',sum([(item.price * item.total_quantity),item.total_branding_cost,item.total_setup_cost].map( price => parseFloat(price) )) );
                }
                if(!has(item,'positions')){
                    set(item,'total_amount',(item.price * item.total_quantity));                
                }
            }
            if( isEmpty(item.sizes) ){
                set(item,'total_quantity',item.quantity);
                set(item,'total_amount',(item.price * item.quantity));                
            }
            return item;
        });
    },
    set(value:any): void {
        $store.commit('cart',value);
    }
});
const home       = computed( () => $store.getters.home);
const sub_total  = computed( () => sum(cart_items.value.map( (val:any) => val.total_amount )) )
const total      = computed( () => sum(
        cart_items.value.map( (val:any) => val.total_amount ).concat(
            !isEmpty($data.service_fees) ? 
                $data.service_fees.map( (fee:any) => fee.type == 'fixed' ? fee.amount : ((fee.amount/100) * sub_total.value) ) :
                    []
        )
    )  
)

let formSchema       = yup.object().shape({
    items:            yup.array().min(1).required("*Cart Items is required"),                      
    first_name:       yup.string()
                        .required("*First name is required"),
    email:            yup.string()
                        .email("*Enter a valid email address")
                        .required("*Email address is required"),                         
    last_name:        yup.string()
                        .required("*Last name is required"),
    currency:         yup.string()
                        .required("*Currency is required"),                         
    address_line_1:   yup.string()
                        .required("*Address Line 1 is required"),
    address_line_2:   yup.string(),
    postal_code:      yup.string()
                        .required("*Postal Code is required"),
    country:          yup.string()
                        .required("*Country is required"),
    county_state:     yup.string()
                        .required("*State / County is required"),
    city_town:        yup.string()
                        .required("*Town / City is required"),                                                                                                                                                      
    phone_number:     yup.string()
                        .required("*Phone number is required"),                         
    confirm_password: yup.string()
                        .required("*Confirmation password is required")
                        .oneOf([yup.ref('password'), null], 'Password mismatch'),
    password:         yup.string()
                        .required("*Password is required"),  
    type:             yup.string(),                     
    saved:            yup.boolean()                       
});

const listCountries  = computed( () => values(countries).map( country => ({ label: country.name, value: country.name })) );
const listCurrencies = computed( () => values(countries).map( country => ({ label: `${country.name} - ${first(country.currency)}`, value: first(country.currency) })) );


// Methods
const selectAddress = (value: string) => {
    $data.form.address_id = value;
}


/**
 * Validates a form field based on the form schema.
 * Updates the errors object accordingly.
 * Updates the isDisabled property based on the presence of errors.
 * 
 * @param {string} field - The name of the field to validate.
 * @returns {void}
 */
const validateForm = async (field) => {
    try{
        // Validate the field using the form schema
        await formSchema.validateAt(field, $data.form)        
        // If the field is valid, delete the corresponding error from the errors object
        delete $data.errors[field];
    } catch(error) {
        // If the field is invalid, update the errors object with the error message
        $data.errors[error.path] = error.message;
    } finally {
        // Update the isDisabled property based on the presence of errors
        $data.isDisabled = !isEmpty($data.errors);
    }
}

/**
 * Checks the status of a transaction.
 * If the status is 1 (i.e. the transaction is paid), the loader is stopped and the user is redirected to the order success page.
 * If the status is not 1, the loader is set to true.
 * @param {number} statusInterval - The interval ID to clear the interval.
 * @param {string} order_id - The ID of the order to check the status of.
 * @returns {void}
 */
const checkTransactionStatus = (statusInterval: number, order_id: string) => {

    const { VITE_API_URL } = $store.getters.env;

    let headers: any = {
        'Allow-Origin': '*',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
    };

    if( !isEmpty(authUser.value) ){
        const { token: { token, token_type } } = $store.getters.auth;
        headers['Authorization'] = `${token_type} ${token}`;
    }

    // Create a new EventSource object
    let es = new EventSourcePolyfill(`${VITE_API_URL}/orders/${order_id}/status`, {
        headers,
        heartbeatTimeout: 360000 // 6 minutes
    });

    // Handle incoming messages from the server
    es.onmessage = ({ data }) => {
        let { transaction } = JSON.parse(data);
        // If the transaction is paid, stop the interval and redirect the user to the order success page.
        if (transaction.status_code === 1) {
            $data.loader.order = false;
            clearInterval(statusInterval);
            document.querySelector('#payment_box').style.visibility = 'hidden';
            document.querySelector('#payment_box .body iframe').remove();
            $toast.success('Payment successful. Please check your email for order details.');

            setTimeout(() => {
                $store.commit('cart', []);
                $router.push({ name: "OrderSuccess", params: { order: transaction.order_id }});
            }, 1000);
        }
    }

    es.onerror = (error) => {
        console.log(error);
        $data.loader.order = false;
    }
}

const  openPesapal = () => {

    const { redirect_url, order_id} = $data.order;
    const iframe                    = document.createElement('iframe');

    iframe.setAttribute('src',redirect_url);
    iframe.setAttribute('height',window.screen.height);
    iframe.setAttribute('width',window.screen.width);
    iframe.setAttribute('sandbox','allow-same-origin allow-scripts allow-popups allow-forms');

    document.querySelector('#payment_box .body').append(iframe);
    document.querySelector('#payment_box').style.visibility = 'visible';

    document.querySelector('#transaction_cancel').addEventListener(
        'click',
        () => { 
            /* later */
            clearInterval(statusInterval);
            document.querySelector('#payment_box').style.visibility = 'hidden';
            document.querySelector('#payment_box .body iframe').remove();
        }
    );

    const { VITE_API_URL } = $store.getters.env;

    let headers: any = {
        'Allow-Origin': '*',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
    };

    if( !isEmpty(authUser.value) ){
        const { token: { token, token_type } } = $store.getters.auth;
        headers['Authorization'] = `${token_type} ${token}`;
    }

    // Create a new EventSource object
    let es = new EventSourcePolyfill(`${VITE_API_URL}/orders/${order_id}/status`, {
        headers,
        heartbeatTimeout: 360000 // 6 minutes
    });

    // Handle incoming messages from the server
    es.onmessage = ({ data }) => {
        let { transaction } = JSON.parse(data);
        // If the transaction is paid, stop the interval and redirect the user to the order success page.
        if (transaction.status_code === 1) {
            $data.loader.order = false;
            document.querySelector('#payment_box').style.visibility = 'hidden';
            document.querySelector('#payment_box .body iframe').remove();
            $toast.success('Payment successful. Please check your email for order details.');

            es.close();

            setTimeout(() => {
                $store.commit('cart', []);
                $router.push({ name: "OrderSuccess", params: { order: transaction.order_id }});
            }, 1000);
        }
    }

    es.onerror = (error) => {
        console.log(error);
        $data.loader.order = false;
        $toast.error('An error occurred while processing your payment. Please try again later.');
        es.close();
    }            
            
}

/**
 * Places an order by sending a POST request to the API with the form data.
 * If the request is successful, the order object is stored in the component's data and a success toast is shown.
 * The user is then redirected to make payment for the order.
 * If the request fails, an error toast is shown and the error is logged to the console.
 * @returns {void}
 */
const placeOrder = async () => {
    try{
        // Set the loader to true
        $data.loader.order        = true;

        // Set the type of the order to either 'existing' or 'new' based on whether the user is logged in or not
        const data                = !isEmpty(authUser.value) ? set($data.form,'type','existing') : set($data.form,'type','new');

        // Send a POST request to the API to place the order
        const { data: { order } } = await $api.post('/orders',data);

        if( order.saved === true ){
            $data.saved = order.saved;
            
            $store.commit('cart', []);

            // Show a success toast
            $toast.success('Your order has been saved. Please check your email for order details.'); 
   
        }

        // Set the order status to 'saved'
        if( order.saved === false ){ 
            // Show a success toast
            $toast.success('Your order has been placed successfully.');

            // Send a PUT request to the API to update the order's transaction status
            const { data: orderData } = await $api.put(`/orders/${order.id}/transaction`);

            // Store the order object in the component's data
            $data.order               = cloneDeep(orderData);

            // Show a success toast
            $toast.success('Redirecting you to make payment for your order.');
            
            // Open the payment iframe
            openPesapal();
        }
    } catch (error) {
        $data.loader.order = false;

        if( has(error,'response') ){

            // Show an error
            switch(get(error.response,'status')){
                case 400:
                    let messages: any = get(error.response,'data.message');
                    messages.forEach( (value) => {
                        // Show an error toast
                        $toast.warning(value)
                    });
                return;
                default: 
                    return $toast.error('Oops! Something went wrong when placing the order.')
            }
        }

    } finally {
        $data.loader.order        = false;
    }
}

/**
 * Get the phone number from the Vue-Tel-Input component.
 * @param {object|string} $event - The event object from the Vue-Tel-Input component.
 * @returns {void}
 */
const getPhoneNumber = ($event) => {
    /**
     * Extract the phone number from the event object.
     * If the event object is a string, assign it directly to the form's phone number.
     * If the event object is an object, extract the value from the target property.
     * @type {string}
     */
    $data.form.phone_number = $event.constructor == String ? $event : $event.target.value 
}

const recaptcha = async () => {
    try {
        // (optional) Wait until recaptcha has been loaded.
        await recaptchaLoaded()

        // Execute reCAPTCHA with action "login".
        await executeRecaptcha('login')

        placeOrder();
        
    } catch(error) {

        console.log(error);
    }
}


onBeforeMount( async() => {
    try {

        $store.commit('loader',true);
        
        const { data: { addresses, service_fees } } = await $api.get('/orders/checkout');

        $data.addresses    = cloneDeep(addresses);
        $data.service_fees = cloneDeep(service_fees);

        $data.form      = {
            address_id: String(),
            items:      Array(),
            saved:      Boolean()
        }
        
        
        if( isEmpty(authUser.value) ){
            $data.form = {
                items:            Array(),
                address_line_1:   String(),
                address_line_2:   String(),
                confirm_password: String(),
                country:          String(),
                currency:         String(),
                first_name:       String(),
                last_name:        String(),
                email:            String(),
                password:         String(),
                phone_number:     String(),
                postal_code:      String(),
                county_state:     String(),
                city_town:        String(),
                type:             String('existing'),
                saved:            Boolean()
            };
        }

        if( !isEmpty(authUser.value) ){
            formSchema = yup.object().shape({
                items:      yup.array().min(1).required("*Cart Items is required"),                      
                address_id: yup.string().required("*Select an address"),         
                saved:      yup.boolean()               
            });
        }

        $data.form.items   = cloneDeep(cart_items.value);
        
    } catch (error) {
        $store.commit('loader',false);
    } finally {
        $store.commit('loader',false);
    }
});


onMounted( 
    debounce(
        () => {
            watch(
                () => $data.form, 
                (form) => {
                    each(form,(value,key) => {
                        validateForm(key);
                    });
                },
                { 
                    deep: true,
                    immediate: false
                }
            );        
        },500
    )
)

</script>