<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container-fluid">
                <div class="row px-4">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h2>Checkout</h2>
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
        <section class="section-b-space">
            <div class="container">
                <div class="checkout-page">
                    <div class="checkout-form pb-6">
                        <form>
                            <div class="row">
                                <div class="col-12">
                                    <div class="checkout-title">
                                        <h3>Billing Details</h3>
                                    </div>                                            
                                </div>
                                <div class="col-lg-7">
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
                                                    <input type="text" name="field-name"  v-model="$data.form.address_line_1" placeholder="Address Line 1">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'address_line_1')">{{$data.errors.address_line_1}}</p>	
                                                </div>
                                                <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                                    <div class="field-label">Address Line 2</div>
                                                    <input type="text" name="field-name" v-model="$data.form.address_line_2" placeholder="Address Line 2">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'address_line_2')">{{$data.errors.address_line_2}}</p>	
                                                </div>
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">Postal Code</div>
                                                    <input type="text" name="field-name" v-model="$data.form.postal_code" placeholder="Postal Code">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'postal_code')">{{$data.errors.postal_code}}</p>	
                                                </div>           
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">Country</div>
                                                    <Multiselect 
                                                        v-model="$data.form.country"
                                                        :options="listCountries" 
                                                        searchable
                                                        placeholder="Coutry"
                                                    />
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'country')">{{$data.errors.country}}</p>	
                                                </div>                                       
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">State / County</div>
                                                    <input type="text" name="field-name"  v-model="$data.form.county_state" placeholder="State / County">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'county_state')">{{$data.errors.county_state}}</p>	
                                                </div>  
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">Town / City</div>
                                                    <input type="text" name="field-name" v-model="$data.form.city_town" placeholder="Town / City">
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
                                                    <div class="col-12 mb-2" v-for="(address, index) in $data.addresses" :key="index">
                                                        <div class="card">
                                                            <div class="card-body d-flex align-items-center justify-content-between">
                                                                <div class="address-box d-flex align-items-center">
                                                                    <input class="form-check-input" style="width: 2em; height: 2em;" type="radio" name="address" :value="address.id" @input="selectAddress($event.target.value)" :id="`address_${index}`">                                                    
                                                                    <label class="form-check-label px-2">
                                                                        <strong>
                                                                            {{ address.address_line_1 }} <br>
                                                                            {{ address.address_line_2 }}
                                                                            {{ address.postal_code }}<br>
                                                                            {{ address.country }},
                                                                            {{ address.county_state }},
                                                                            {{ address.city_town }}
                                                                        </strong>
                                                                    </label>
                                                                </div>
                                                                <div class="btn btn-solid btn-sm">{{ address.category }}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h4 class="text-danger" v-show="has($data.errors,'address_id')">{{ $data.errors.address_id }}</h4>								
                                                </template>
                                                <template v-else>
                                                    <h4 class="text-warning text-center">
                                                        <i class="fa fa-info-circle"></i>
                                                        No addresses found.
                                                    </h4>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-5">
                                    <div class="checkout-details">
								        <p class="text-danger col col-12 mt-0" v-show="has($data.errors,'items')">{{$data.errors.items}}</p>								
                                        <div class="order-box">
                                            <div class="title-box pb-0">
                                                <div>Product <span class="text-end">Total</span></div>
                                            </div>
                                            <ul class="qty">
                                                <template  v-for="(item,index) in cart_items">
                                                    <template v-if="has(item,'size')">
                                                        <li :key="`${index}`" class="d-flex align-items-center justify-content-between">
                                                            <div>
                                                                <img :src="item.image" width="70" class="img-thumbnail"/>
                                                            </div>
                                                            <p class="px-2 mb-0">{{ item.name }} <br> {{ item.size.name }} <br> Quantity: {{ item.size.quantity }} </p>
                                                            <span class="text-end">{{ home.company.currency }} {{ (item.size.quantity * item.price).toFixed(2) }}</span>
                                                        </li>
                                                    </template>
                                                    <template v-else>
                                                        <li :key="index" class="d-flex align-items-center justify-content-between">
                                                            <div>
                                                                <img :src="item.image" width="70" class="img-thumbnail"/>
                                                            </div>
                                                            <p class="px-2 mb-0">{{ item.name }} <br> Quantity: {{ item.quantity }} </p>
                                                            <span class="text-end">{{ home.company.currency }} {{ (item.quantity * item.price).toFixed(2) }}</span>
                                                        </li>
                                                    </template>
                                                </template>
                                            </ul>
                                            <ul class="sub-total">
                                                <li>Subtotal <span class="count text-end">{{ home.company.currency }} {{ sub_total.toFixed(2) }}</span></li>
                                                <template v-if="!isEmpty($data.service_fees)">
                                                    <li v-for="(fee,key) in $data.service_fees" :key="key">
                                                        {{ fee.name }}
                                                        <span class="count text-end" v-if="fee.type == 'fixed'">{{ home.company.currency }} {{ fee.amount.toFixed(2) }}</span>
                                                        <span class="count text-end" v-if="fee.type == 'percentage'">{{ home.company.currency }} {{ ( ( fee.amount * sub_total ) / 100 ).toFixed(0) }}</span>
                                                    </li>
                                                </template>
                                            </ul>
                                            <ul class="total">
                                                <li>Total <span class="count text-end">{{ home.company.currency }} {{ total.toFixed(0) }}</span></li>
                                            </ul>
                                        </div>                                     
                                    </div>
                                </div>
                                <div class="col-12 text-center mt-4">
                                    <button class="btn-solid btn-xl hover-solid" type="button" @click="recaptcha" :disabled="$data.isDisabled || $data.loader.order">
                                        <i class="fa fa-spinner fa-spin" v-if="$data.loader.order"></i>
                                        Place Order
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        <!-- section end -->   
    </div>
</template>
<style src="@vueform/multiselect/themes/default.css"></style>
<script setup lang="ts">

import { computed, inject, onBeforeMount, onMounted, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import * as yup from "yup";
import { cloneDeep, debounce, each, first, isEmpty, has, omit, set, sum, values } from 'lodash';
import { VueTelInput } from 'vue3-tel-input';
import 'vue3-tel-input/dist/vue3-tel-input.css'
import { countries } from 'countries-list';
import Multiselect from '@vueform/multiselect'
import { useReCaptcha } from 'vue-recaptcha-v3';
import { useRouter } from 'vue-router';

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
    service_fees: Array()
});
const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

// Computed
const authUser   = computed( () => $store.getters.auth.user );
const cart       = computed( () => $store.getters.cart );
const cart_items = computed( () => $store.getters.cart.map( item => has(item,'sizes') ? item.sizes.map( (size:any) => ({...omit(item,['sizes']),size})): item ).flat() );
const home       = computed( () => $store.getters.home);
const sub_total  = computed( () => cart_items.value.map( item => has(item,'size') ? item.price * item.size.quantity : item.price * item.quantity ).reduce( (a,c) => a + c, 0) );
const total      = computed( () => $data.service_fees.map( (fee) => fee.type == 'percentage' ? ((fee.amount * sub_total.value ) / 100) : fee.amount ).reduce( (a,c) => a + c, 0) + sub_total.value );

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
    type:             yup.string()                       
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
const validateForm = (field) => {
    // Validate the field using the form schema
    formSchema.validateAt(field, $data.form)
        .then((value,key) => {
            // If the field is valid, delete the corresponding error from the errors object
            delete $data.errors[field];
        })
        .catch((err) => {
            // If the field is invalid, update the errors object with the error message
            $data.errors[err.path] = err.message;
        })
        .finally( () => {
            // Update the isDisabled property based on the presence of errors
            $data.isDisabled = !isEmpty($data.errors);
        })
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
    $api.get(`/orders/${order_id}/status`)
        .then( ({ data: { transaction }}) => {

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
        })
        .catch(() => {
            // If the request fails, set the loader to true.
            $data.loader.order = true;
        })
        .finally(() => {
            // Set the loader to true after the request is finished.
            $data.loader.order = true;
        });
}

const  openPesapal = () => {

    const { redirect_url, order_id} = $data.order;
    const iframe                    = document.createElement('iframe');
    const statusInterval            = setInterval( () => {
        checkTransactionStatus(statusInterval,order_id);
    },3000);  

    iframe.setAttribute('src',redirect_url);
    iframe.setAttribute('height',window.screen.height);
    iframe.setAttribute('width',window.screen.width);
    iframe.setAttribute('sandbox','allow-forms allow-scripts');

    document.querySelector('#payment_box .body').append(iframe);
    document.querySelector('#payment_box').style.visibility = 'visible';

    document.querySelector('#transaction_cancel')
            .addEventListener(
                'click',
                () => { 
                    /* later */
                    clearInterval(statusInterval);
                    document.querySelector('#payment_box').style.visibility = 'hidden';
                    document.querySelector('#payment_box .body iframe').remove();
                }
            );
            
}

const placeOrder = async () => {
    try{
        $data.loader.order      = true;
        const data              = !isEmpty(authUser.value) ? set($data.form,'type','existing') : set($data.form,'type','new');
        let { data: { order } } = await $api.post('/orders',data);
        let { data: orderData } = await $api.put(`/orders/${order.id}/transaction`);
        $data.order             = cloneDeep(orderData);
        openPesapal();
    } catch (error) {
        console.log(error);
        // $data.loader.order = true;
        // if( data.statusCode == 400 ){
        //     data.message.forEach( (value:string) => {
        //         $toast.error(value);
        //     })
        // }
    }
}

const getPhoneNumber = ($event) => {
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
            items:   Array() 
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
                type:             String('existing')
            };
        }

        if( !isEmpty(authUser.value) ){
            formSchema = yup.object().shape({
                items:      yup.array().min(1).required("*Cart Items is required"),                      
                address_id: yup.string().required("*Select an address"),                     
            });
        }
        
    } catch (error) {
        $store.commit('loader',false);
    } finally {
        $store.commit('loader',false);
    }
});


onMounted( 
    debounce(
        () => {
            $data.form.items = cloneDeep(cart.value);
            watch(
                () => $data.form, 
                (form) => {
                    each(form,(value,key) => {
                        validateForm(key);
                    });
                },
                { 
                    deep: true,
                    immediate: true
                }
            );        
        },500
    )
)

</script>