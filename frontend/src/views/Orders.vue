<template>
<div class="tab-pane fade show active" id="orders">
    <CardLoader :loader="$data.loader" />
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
                                        <td>{{ home.company.currency }} {{ sum(order.items.map( item => item.price * item.quantity)).toFixed() }}</td>
                                        <td>
                                            <template v-if="order.status == 'pending'"><i class="btn btn-outline-warning">{{ order.status }}</i></template>
                                            <template v-if="order.status == 'paid'"><p class="btn btn-outline-primary">{{ order.status }}</p></template>
                                            <template v-if="order.status == 'confirmed'"><i class="btn btn-outline-info">{{ order.status }}</i></template>
                                            <template v-if="order.status == 'in_transit'"><i class="btn btn-outline-secondary">{{ order.status }}</i></template>
                                            <template v-if="order.status == 'delivered'"><i class="btn btn-outline-secondary">{{ order.status }}</i></template>
                                            <template v-if="order.status == 'cencelled'"><i class="btn btn-outline-danger">{{ order.status }}</i></template>
                                        </td>
                                        <td>{{ moment(order.created_at).format('Do MMMM, Y') }}</td>   
                                        <td></td>                                     
                                    </tr>
                                </template>
                                <template v-else>
                                    <tr>
                                        <td colspan="8">
                                            <h4 class="mb-0 p-3 text-center"><i class="fa fa-exclamation-triangle"></i> No orders Found.</h4>
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
import { computed, inject, onBeforeMount, reactive } from 'vue';
import { useStore } from 'vuex';
import  moment from 'moment';
import { isEmpty, sum } from 'lodash';
import { CardLoader } from '../components';

const $api  = inject('$api'); 
const $data = reactive({
    loader: Boolean(),
    orders: Object()
});
const $store = useStore();
const home   = computed( () => $store.getters.home);

const fetch = () => {
    $data.loader = Boolean(true);
    $api.get(`/orders`)
        .then( ({ data: { orders } }) => {
            $data.orders = orders
        })
        .catch( () => {
            $data.loader = Boolean();
        })
        .finally( () => {
            $data.loader = Boolean();
        });
}

onBeforeMount( () => fetch());

</script>