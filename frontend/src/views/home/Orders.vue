<template>
<div class="tab-pane fade show active" id="orders">
    <div class="row">
        <div class="col-12">
            <div class="card dashboard-table mt-0">
                <div class="card-body table-responsive-sm">
                    <div class="top-sec">
                        <h3>My Orders</h3>
                    </div>
                    <div class="table-responsive-xl">
                        <table class="table cart-table order-table">
                            <thead>
                                <tr class="table-head">
                                    <th>#</th>
                                    <th>Order #</th>
                                    <th>Items</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="!isEmpty($data.orders)">
                                    <tr v-for="(order,index) in $data.orders.items" :key="index">
                                        <td>{{ index + 1 }}</td>
                                        <td> # {{ order.num_id }}</td>
                                        <td>{{ order.items.length }}</td>
                                        <td>KSH {{ sum(order.items.map( item => item.price * item.quantity)).toFixed() }}</td>
                                        <td>
                                            <template v-if="order.status == 'pending'"><i class="text-warning">{{ order.status }}</i></template>
                                            <template v-if="order.status == 'paid'"><i class="text-info">{{ order.status }}</i></template>
                                            <template v-if="order.status == 'confirmed'"><i class="text-success">{{ order.status }}</i></template>
                                            <template v-if="order.status == 'in_transit'"><i class="text-success">{{ order.status }}</i></template>
                                            <template v-if="order.status == 'delivered'"><i class="text-success">{{ order.status }}</i></template>
                                            <template v-if="order.status == 'cencelled'"><i class="text-danger">{{ order.status }}</i></template>
                                        </td>
                                        <td>{{ moment(order.created_at).format('Do MMMM, Y') }}</td>   
                                        <td></td>                                     
                                    </tr>
                                </template>
                                <template v-else>
                                    <tr>
                                        <td colspan="8" class="text-center">
                                            <h4 class="mb-0 p-3"><i class="fa fa-exclamation-triangle"></i> No orders Found.</h4>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> 
</template>

<script setup>
import { inject, onBeforeMount, reactive } from 'vue';
import { useStore } from 'vuex';
import  moment from 'moment';
import { isEmpty, sum } from 'lodash';

const $api  = inject('$api'); 
const $data = reactive({
    orders: Object()
});
const $store = useStore();

const fetch = () => {
    $store.commit('loader',true);
    $api.get(`/orders`)
        .then( ({ data: { orders } }) => {
            $data.orders = orders
        })
        .catch( () => {
            $store.commit('loader',false);
        })
        .finally( () => {
            $store.commit('loader',false);
        });
}

onBeforeMount( () => fetch());

</script>