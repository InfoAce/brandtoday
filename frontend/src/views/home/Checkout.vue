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
                                <div class="col-lg-6 col-sm-12 col-xs-12">
                                    <div class="checkout-details">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                                            <label class="form-check-label ml-2" for="defaultCheck1">
                                                Default checkbox
                                            </label>
                                        </div>
                                    </div>
                                    <div class="checkout-title">
                                        <h3>Billing Details</h3>
                                    </div>
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
                                        <div class="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <input type="checkbox" name="shipping-option" id="account-option"> &ensp;
                                            <label for="account-option">Create An Account?</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-sm-12 col-xs-12">
                                    <div class="checkout-details">
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
import { computed } from 'vue';
import { useStore } from 'vuex';
import { isEmpty, has, sum } from 'lodash';

const $store = useStore();

const cart   = computed( () => $store.getters.cart );
const total  = computed( () => { 
    return sum(cart.value.map( (val:any) => { 
        return has(val,'sizes') ? (val.price * sum(val.sizes.map( (size: any) => size.quantity))) : (val.price * val.quantity)
    }));
});

</script>