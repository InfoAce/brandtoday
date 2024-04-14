<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container">
                <div class="row">
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
                    <div class="checkout-form">
                        <form>
                            <div class="row">
                                <div class="col-12">
                                    <div class="checkout-title">
                                        <h3>Billing Details</h3>
                                    </div>                                            
                                </div>
                                <div class="col-lg-6 col-sm-12 col-xs-12">
                                    <div class="row">
                                        <div class="col-12" v-show="isEmpty(authUser)">
                                            <div class="row check-out">
                                                <div class="col-12">
                                                    <h5>User information</h5>
                                                </div>
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <label for="fname" class="field-label">First Name</label>
                                                    <input type="text" class="form-control mb-2" autofill="off" autocomplete="off" id="fname" v-model="$data.signup_form.first_name" placeholder="First Name" required="">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'first_name')">{{$data.errors.first_name}}</p>	
                                                </div>
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <label for="lname" class="field-label">Last Name</label>
                                                    <input type="text" class="form-control mb-2"  autocomplete="off" id="lname" v-model="$data.signup_form.last_name" placeholder="Last Name" required="">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'last_name')">{{$data.errors.last_name}}</p>	
                                                </div>
                                                <div class="form-group col-12">
                                                    <label for="email" class="field-label">Email Address</label>
                                                    <input type="text" class="form-control mb-2"  autocomplete="off" id="email" v-model="$data.signup_form.email" placeholder="Email" required="">
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
                                                        v-model="$data.signup_form.currency"
                                                        :options="listCurrencies" 
                                                        searchable
                                                        placeholder="Currency"
                                                        class="mb-2"
                                                    />
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'currency')">{{$data.errors.currency}}</p>	
                                                </div>
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <label for="password" class="field-label">Password</label>
                                                    <input type="password" class="form-control mb-2" id="password" placeholder="Enter your password" v-model="$data.signup_form.password" required="">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'password')">{{$data.errors.password}}</p>	
                                                </div>
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <label for="confirm_password" class="field-label mb-2">Confirm Password</label>
                                                    <input type="password" class="form-control mb-2" id="confirm_password" placeholder="Enter password confirmation" v-model="$data.signup_form.confirm_password" required="">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'confirm_password')">{{$data.errors.confirm_password}}</p>	
                                                </div>
                                            </div>
                                            <div class="row check-out">
                                                <div class="col-12">
                                                    <h4>Address information</h4>
                                                </div>
                                                <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                                    <div class="field-label">Address Line 1</div>
                                                    <input type="text" name="field-name"  v-model="$data.signup_form.address_line_1" placeholder="Address Line 1">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'address_line_1')">{{$data.errors.address_line_1}}</p>	
                                                </div>
                                                <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                                    <div class="field-label">Address Line 2</div>
                                                    <input type="text" name="field-name" v-model="$data.signup_form.address_line_2" placeholder="Address Line 2">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'address_line_2')">{{$data.errors.address_line_2}}</p>	
                                                </div>
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">Postal Code</div>
                                                    <input type="text" name="field-name" v-model="$data.signup_form.postal_code" placeholder="Postal Code">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'postal_code')">{{$data.errors.postal_code}}</p>	
                                                </div>           
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">Country</div>
                                                    <Multiselect 
                                                        v-model="$data.signup_form.country"
                                                        :options="listCountries" 
                                                        searchable
                                                        placeholder="Coutry"
                                                    />
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'country')">{{$data.errors.country}}</p>	
                                                </div>                                       
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">State / County</div>
                                                    <input type="text" name="field-name"  v-model="$data.signup_form.state_county" placeholder="State / County">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'state_county')">{{$data.errors.state_county}}</p>	
                                                </div>  
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">Town / City</div>
                                                    <input type="text" name="field-name" v-model="$data.signup_form.town_city" placeholder="Town / City">
                                                    <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'town_city')">{{$data.errors.town_city}}</p>	
                                                </div>                                                                                               
                                            </div>
                                        </div>
                                        <div class="col-12" v-show="!isEmpty(authUser)">
                                            <div class="checkout-details" >
								                <p class="text-danger col col-12 mt-0" v-show="has($data.errors,'address')">{{$data.errors.address}}</p>								
                                                <template v-if="!isEmpty($data.addresses)">
                                                    <div class="col-12 mb-2" v-for="(address, index) in $data.addresses" :key="index">
                                                        <div class="card">
                                                            <div class="card-body d-flex align-items-center justify-content-between">
                                                                <div class="address-box">
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
                                <div class="col-lg-6 col-sm-12 col-xs-12">
                                    <div class="checkout-details">
								        <p class="text-danger col col-12 mt-0" v-show="has($data.errors,'items')">{{$data.errors.items}}</p>								
                                        <div class="order-box">
                                            <div class="title-box">
                                                <div>Product <span>Total</span></div>
                                            </div>
                                            <ul class="qty">
                                                <template  v-for="(item,index) in cart">
                                                    <template v-if="has(item,'sizes')">
                                                        <li v-for="(size,key) in item.sizes" :key="`${index}_${key}`">{{ item.name }} - {{ size.name }} × {{ size.quantity }} <span>KSH {{ (size.quantity * item.price).toFixed(0) }}</span></li>
                                                    </template>
                                                    <template v-else>
                                                        <li :key="index">{{ item.name }} × {{ item.quantity }} <span>KSH {{ (item.quantity * item.price).toFixed(0) }}</span></li>
                                                    </template>
                                                </template>
                                            </ul>
                                            <ul class="sub-total">
                                                <li>Subtotal <span class="count">KSH {{ total.toFixed(0) }}</span></li>
                                                <!-- <li>Shipping
                                                    <div class="shipping">
                                                        <div class="shopping-option">
                                                            <input type="checkbox" name="free-shipping" id="free-shipping">
                                                            <label for="free-shipping">Free Shipping</label>
                                                        </div>
                                                        <div class="shopping-option">
                                                            <input type="checkbox" name="local-pickup" id="local-pickup">
                                                            <label for="local-pickup">Local Pickup</label>
                                                        </div>
                                                    </div>
                                                </li> -->
                                            </ul>
                                            <ul class="total">
                                                <li>Total <span class="count">KSH {{ total.toFixed(0) }}</span></li>
                                            </ul>
                                        </div>
                                        <div class="payment-box">
                                            <div class="text-center">
                                                <button class="btn-solid btn" type="button" @click="recaptcha()" :disabled="$data.isDisabled || $data.loader.order">
                                                    <i class="fa fa-spinner fa-spin" v-if="$data.loader.order"></i>
                                                    Place Order
                                                </button>
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
    </div>
</template>
<style src="@vueform/multiselect/themes/default.css"></style>
<script setup lang="ts">

import { computed, inject, onBeforeMount, onMounted, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import * as yup from "yup";
import { cloneDeep, each, first, isEmpty, has, set, sum, values } from 'lodash';
import { VueTelInput } from 'vue3-tel-input';
import 'vue3-tel-input/dist/vue3-tel-input.css'
import { countries } from 'countries-list';
import Multiselect from '@vueform/multiselect'
import { useReCaptcha } from 'vue-recaptcha-v3'

// Data variables
const $api   = inject('$api');
const $store = useStore();
const $data  = reactive({
    addresses: Array(),
    errors:    Object(),
    form: {
        address_id: String(),
        items:      Array()
    },
    signup_form: {
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
        state_county:     String(),
        town_city:        String(),
        items:            Array()
	},
    loader:    {
        addresses: Boolean(),
        order:     Boolean(),
    },
    isDisabled:       Boolean(true),
});
const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

// Computed
const authUser = computed( () => $store.getters.authUser );
const cart     = computed( () => $store.getters.cart );
const total    = computed( () => { 
    return sum(cart.value.map( (val:any) => { 
        return has(val,'sizes') ? (val.price * sum(val.sizes.map( (size: any) => size.quantity))) : (val.price * val.quantity)
    }));
});
const formSchema = yup.object().shape({
	address_id: yup.string().required("*Address is required"),                      
	items:   yup.array().min(1).required("*Cart Items is required"),                      
});
const listCountries  = computed( () => values(countries).map( country => ({ label: country.name, value: country.name })) );
const listCurrencies = computed( () => values(countries).map( country => ({ label: `${country.name} - ${first(country.currency)}`, value: first(country.currency) })) );


// Methods
const selectAddress = (value: string) => {
    $data.form.address_id = value;
}

const signupFormSchema = yup.object().shape({
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
    state_county:     yup.string()
						 .required("*State / County is required"),
    town_city:        yup.string()
						 .required("*Town / City is required"),                                                                                                                                                      
    phone_number:     yup.string()
						 .required("*Phone number is required"),                         
	confirm_password: yup.string()
                         .required("*Confirmation password is required")
                         .oneOf([yup.ref('password'), null], 'Password mismatch'),
	password:         yup.string()
						 .required("*Password is required"),                         
});

const validateSignupForm = (field) => {
	signupFormSchema.validateAt(field, $data.signup_form)
        .then((value,key) => {
			delete $data.errors[field];
		})
        .catch((err) => {
          $data.errors[err.path] = err.message;
        })
        .finally( () => {
		    $data.isDisabled = !isEmpty($data.errors);
        })
}


const validateForm = (field) => {
  formSchema.validateAt(field, $data.form)
            .then((value,key) => {
                delete $data.errors[field];
            })
            .catch((err) => {
                $data.errors[err.path] = err.message;
            })
            .finally( () => {
                $data.isDisabled = !isEmpty($data.errors);
            })
}

const placeOrder = () => {
    $data.loader.order = Boolean(true);
    const data = !isEmpty(authUser.value) ? set($data.form,'type','existing') : set($data.signup_form,'type','new');
    $api.post('/orders',data)
        .then( ({ data: {  }}) => {

        })
        .catch( () => {
            $data.loader.order = Boolean();
        })
        .finally( () => {
            $data.loader.order = Boolean();
        });
}

const getPhoneNumber = ($event) => {
    $data.signup_form.phone_number = $event.constructor == String ? $event : $event.target.value 
}

const recaptcha = async () => {
    try {
        // (optional) Wait until recaptcha has been loaded.
        await recaptchaLoaded()

        // Execute reCAPTCHA with action "login".
        await executeRecaptcha('login')

        placeOrder();
        
    } catch(err) {

        
    }
}


onBeforeMount( () => {
    if( !isEmpty(authUser.value) ){
        $data.loader.addresses = Boolean(true);
        $api.get('/addresses')
            .then( ({ data: { addresses }}) => {
                $data.addresses = cloneDeep(addresses);
            })
            .catch( () => {
                $data.loader.addresses = Boolean();
            })
            .finally( () => {
                $data.loader.addresses = Boolean();
            });
    }
});

onMounted( () => {

    if( !isEmpty(authUser.value) ){
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
            }
        );        
    }

    if( isEmpty(authUser.value) ){
        $data.signup_form.items = cloneDeep(cart.value);
        watch(
            () => $data.signup_form, 
            (form) => {
                each(form,(value,key) => {
                    validateSignupForm(key);
                });
            },
            { 
                deep: true,
                immediate: true
            }
        );        
    }

})

</script>