<template>
    <div class="modal theme-modal fade bd-example-modal-lg" id="editorder" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">View Order</h5>
                    <button type="button" class="btn-close" @click="$emit('update-modal',false)" aria-label="Close">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-12 px-0">
                                <div class="bg-inner cart-section order-details-table">
                                    <div class="row g-4">
                                        <div class="col-12">
                                            <div class="card-details-title">
                                                <h3>Order Number <span>{{ order.num_id }}</span></h3>
                                            </div>
                                        </div>
                                        <div class="col-md-8">
                                            <div class="table-responsive table-details">
                                                <table class="table cart-table table-borderless">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="4">Items</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        <tr class="table-order" v-for="(item,index) in order.items" :key="index">
                                                            <td class="d-flex justify-content-between">
                                                                <img :src="item.image" class="img-fluid lazyload" alt="">
                                                                <h5>{{ item.name }}<br><span v-if="has(item,'sizes')">{{ item.sizes.map( size => size.name ).join(',') }}</span></h5>
                                                            </td>
                                                            <td class="text-end" colspan="3">
                                                                <p>Quantity</p>
                                                                <h5>{{ has(item,'sizes') ? sum(item.sizes.map( size => size.quantity )) : item.quantity }}</h5>
                                                                <p>Price</p>
                                                                <h5>{{ company.currency }} {{ item.price }}</h5>
                                                            </td>
                                                        </tr>

                                                    </tbody>

                                                    <tfoot>
                                                        <tr class="table-order">
                                                            <td colspan="3">
                                                                <h4 class="theme-color fw-bold">Total Price :</h4>
                                                            </td>
                                                            <td class="text-end">
                                                                <h4 class="theme-color fw-bold">{{ company.currency }} {{ total }}</h4>
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="col-md-4" v-if="!isEmpty(order)">
                                            <div class="row g-4">
                                                <div class="col-12">
                                                    <div class="order-success p-3">
                                                        <div class="mb-3">
                                                            <h4 class="mb-2">Summary</h4>
                                                            <ul class="order-details">
                                                                <li>Order ID:    {{ order.num_id }}</li>
                                                                <li>Order Date:  {{ moment(order.created_at).format('D MMMM Y') }}</li>
                                                                <li>Order Total: {{ company.currency }} {{ total }}</li>
                                                            </ul>
                                                        </div>
                                                        <div class="mb-3">
                                                            <h4 class="mb-2">Shipping address</h4>
                                                            <ul class="order-details">
                                                                <li>{{ order.address.address_line_1 }} {{ order.address.postal_code }},</li>
                                                                <li>{{ order.address.city_town }} {{ order.address.county_state }},</li>
                                                                <li>{{ order.address.country }}</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h4 class="mb-2">Payment Method</h4>
                                                            <ul class="order-details" v-if="!isEmpty(get(order,'transaction')) && order.status != 'pending'">
                                                                <li>Payment Method: {{ order.transaction.payment_method }}</li>
                                                                <li>Transaction Id: {{ order.transaction.confirmation_code }}</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- <div class="col-md-6">
                                                    <div class="order-success" v-if="!isEmpty(get(order,'transaction')) && order.status != 'pending'">
                                                        <div class="payment-mode">

                                                        </div>
                                                    </div>
                                                    <div class="order-success" v-if="!isEmpty(get(order,'transaction')) && order.status == 'pending'">
                                                        <div class="payment-mode">
                                                            <h4 class="text-danger">Pending Payment</h4>                                                          
                                                        </div>
                                                    </div>                                                   
                                                </div> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>                                
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" type="button" >
                        <!-- <i v-if="data.loader.register" class="fa fa-spinner fa-spin"></i> -->
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, defineProps, watch } from 'vue';
import { get, isEmpty, has, sum } from 'lodash';
import moment from 'moment';
import { useStore } from 'vuex';

/**
 * Define component properties
 * 
 * @param {Object}
 * @returns {Object}
 */
const $props = defineProps({
    data:{
        default: () => Object(),
        type:    Object
    }
});

/**
 * Initialize Vuex store
 * 
 * @returns {Object} Vuex store instance
 */
const $store = useStore();

/**
 * Computed order from component properties
 * 
 * @param {defineProps}
 * @returns {Object}
 */
const order    = computed(() => $props.data);

/**
 * Computed company from store
 * 
 * @param {useStore}
 * @returns {Object}
 */
const company  = computed( () => $store.getters.home.company);

/**
 * Computed total from order
 * 
 * @param {defineProps}
 * @returns {Object}
 */
const total = computed(() => isEmpty($props.data) ?  0 : 
                                    order.value.items.map( 
                                        item => has(item,'sizes') ? 
                                                    item.price * item.sizes.map( size => size.quantity).reduce( (result, current) => result + current, 0)  
                                                        : item.price * item.quantity ).reduce( (result, current) => result + current, 0)  
                                                    )
// ; // Get total amount

/**
 * Watch for changes
 * 
 * @param {Object}
 * @returns void
 */
watch(
    () => $props.data,
    (data) => {
        if( !isEmpty(data) ){
            $('#editorder').modal('show');
        }
        if( isEmpty(data)){
            $('#editorder').modal('hide');
        }
    }
)
</script>