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
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">First Name</div>
                                                    <input type="text" name="field-name" value="" placeholder="">
                                                </div>
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">Last Name</div>
                                                    <input type="text" name="field-name" value="" placeholder="">
                                                </div>
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">Phone</div>
                                                    <input type="text" name="field-name" value="" placeholder="">
                                                </div>
                                                <div class="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div class="field-label">Email Address</div>
                                                    <input type="text" name="field-name" value="" placeholder="">
                                                </div>
                                                <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                                    <div class="field-label">Country</div>
                                                    <select>
                                                        <option>India</option>
                                                        <option>South Africa</option>
                                                        <option>United State</option>
                                                        <option>Australia</option>
                                                    </select>
                                                </div>
                                                <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                                    <div class="field-label">Address</div>
                                                    <input type="text" name="field-name" value="" placeholder="Street address">
                                                </div>
                                                <div class="form-group col-md-12 col-sm-12 col-xs-12">
                                                    <div class="field-label">Town/City</div>
                                                    <input type="text" name="field-name" value="" placeholder="">
                                                </div>
                                                <div class="form-group col-md-12 col-sm-6 col-xs-12">
                                                    <div class="field-label">State / County</div>
                                                    <input type="text" name="field-name" value="" placeholder="">
                                                </div>
                                                <div class="form-group col-md-12 col-sm-6 col-xs-12">
                                                    <div class="field-label">Postal Code</div>
                                                    <input type="text" name="field-name" value="" placeholder="">
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
                                                <button class="btn-solid btn" type="button" @click="placeOrder()" :disabled="$data.isDisabled || $data.loader.order">
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

<script setup lang="ts">

import { computed, inject, onBeforeMount, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import * as yup from "yup";
import { cloneDeep, each, isEmpty, has, sum } from 'lodash';

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
    loader:    {
        addresses: Boolean(),
        order:     Boolean(),
    },
    isDisabled: Boolean(true)
});

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


// Methods
const selectAddress = (value: string) => {
    $data.form.address_id = value;
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
    $api.post('/orders',$data.form)
        .then( ({ data: {  }}) => {

        })
        .catch( () => {
            $data.loader.order = Boolean();
        })
        .finally( () => {
            $data.loader.order = Boolean();
        });
}


onBeforeMount( () => {
    $data.form.items = cloneDeep(cart.value);
    if( !isEmpty(authUser) ){
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

</script>