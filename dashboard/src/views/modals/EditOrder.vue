<template>
    <div class="modal theme-modal fade bd-example-modal-lg" id="editorder" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">View Order</h5>
                    <button type="button" class="btn-close" @click="$emit('update-modal',false)" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-12 px-0">
                                <div class="bg-inner cart-section order-details-table">
                                    <div class="row g-4">
                                        <div class="col-xl-8">
                                            <div class="card-details-title">
                                                <h3>Order Number <span>{{ order.num_id }}</span></h3>
                                            </div>
                                            <div class="table-responsive table-details">
                                                <table class="table cart-table table-borderless">
                                                    <thead>
                                                        <tr>
                                                            <th colspan="2">Items</th>
                                                            <th class="text-end" colspan="2">
                                                                <a href="javascript:void(0)"
                                                                    class="theme-color">Edit Items</a>
                                                            </th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        <tr class="table-order" v-for="(item,index) in order.items" :key="index">
                                                            <td>
                                                                <a href="javascript:void(0)">
                                                                    <img :src="item.image" class="img-fluid lazyload" alt="">
                                                                </a>
                                                                <h5>{{ item.name }}<br><span v-if="has(item,'sizes')">{{ item.sizes.map( size => size.name ).join(',') }}</span></h5>
                                                            </td>
                                                            <td>
                                                                <p>Quantity</p>
                                                                <h5>{{ has(item,'sizes') ? sum(item.sizes.map( size => size.quantity )) : item.quantity }}</h5>
                                                            </td>
                                                            <td>
                                                                <p>Price</p>
                                                                <h5>{{ company.currency }} {{ item.price }}</h5>
                                                            </td>
                                                            <td class="text-end">
                                                                <p>Total</p>
                                                                <h5>{{ company.currency }} {{ has(item,'sizes') ?  item.price * sum(item.sizes.map( size => size.quantity )) : item.price * item.quantity }}</h5>
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

                                        <div class="col-xl-4" v-if="!isEmpty(order) ">
                                            <div class="row g-4">
                                                <div class="col-12">
                                                    <div class="order-success">
                                                        <h4>summary</h4>
                                                        <ul class="order-details">
                                                            <li>Order ID:    {{ order.num_id }}</li>
                                                            <li>Order Date:  {{ moment(order.created_at).format('D MMMM Y') }}</li>
                                                            <li>Order Total: {{ total }}</li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div class="col-12">
                                                    <div class="order-success">
                                                        <h4>Shipping address</h4>
                                                        <ul class="order-details">
                                                            <li>{{ order.address.address_line_1 }} {{ order.address.postal_code }},</li>
                                                            <li>{{ order.address.city_town }} {{ order.address.county_state }},</li>
                                                            <li>{{ order.address.country }}</li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <!-- <div class="col-12">
                                                    <div class="order-success">
                                                        <h4>client details</h4>
                                                        <ul class="order-details">
                                                            <li>{{ order.user.first_name }} {{ order.user.last_name }}</li>
                                                            <li>{{ order.user.email }}</li>
                                                            <li>{{ order.user.phone_number }}</li>
                                                        </ul>
                                                    </div>
                                                </div> -->

                                                <div class="col-12">
                                                    <div class="order-success" v-if="!isEmpty(get(order,'transaction')) && order.status != 'pending'">
                                                        <div class="payment-mode">
                                                            <h4>payment method</h4>
                                                            <ul class="list-group">
                                                                <li class="list-item">Payment Method: {{ order.transaction.payment_method }}</li>
                                                                <li class="list-item">Transaction Id: {{ order.transaction.confirmation_code }}</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div class="order-success" v-if="!isEmpty(get(order,'transaction')) && order.status == 'pending'">
                                                        <div class="payment-mode">
                                                            <h4 class="text-danger">Pending Payment</h4>                                                          
                                                        </div>
                                                    </div>                                                   
                                                </div>
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
    },
    show: {
        default: Boolean(),
        type:    Boolean
    }
});

const $store    = useStore();

/**
 * Computed order from component properties
 * 
 * @param {defineProps}
 * @returns {Object}
 */
const order = computed(() => $props.data);

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
    () => $props.show,
    (modal) => {
        if( modal === true){
            $('#editorder').modal('show');
        }
        if( modal === false){
            $('#editorder').modal('hide');
        }
    }
)
</script>