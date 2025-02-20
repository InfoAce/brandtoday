<template>
<div class="tab-pane fade show active" id="orders">
    <CardLoader :loader="$data.loader" />
    <div class="row">
        <div class="col-12">
            <div class="card dashboard-table mt-0">
                <div class="card-body table-responsive-sm">
                    <div class="top-sec">
                        <h2>My Orders</h2>
                    </div>
                    <div class="table-responsive-xl">
                        <table class="table cart-table order-table">
                            <thead>
                                <tr class="table-head">
                                    <th>#</th>
                                    <th>Order #</th>
                                    <th>Items</th>
                                    <th>Quantity</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="!isEmpty($data.orders) && !isEmpty($data.orders.items)">
                                    <tr v-for="(order,index) in $data.orders.items" :key="index">
                                        <td>{{ index + 1 }}</td>
                                        <td> # {{ order.num_id }}</td>
                                        <td>{{ order.items.length }}</td>
                                        <td>{{ sumBy(order.items,'quantity') }}</td>
                                        <td>{{ home.company.currency }} {{ sumBy(order.items,'total_amount') }}</td>
                                        <td>
                                            <template v-if="order.status == 'pending'"><i class="badge badge-warning">{{ order.status }}</i></template>
                                            <template v-if="order.status == 'paid'"><p class="badge badge-primary">{{ order.status }}</p></template>
                                            <template v-if="order.status == 'confirmed'"><i class="badge badge-info">{{ order.status }}</i></template>
                                            <template v-if="order.status == 'in_transit'"><i class="badge badge-secondary">{{ order.status }}</i></template>
                                            <template v-if="order.status == 'delivered'"><i class="badge badge-success">{{ order.status }}</i></template>
                                            <template v-if="order.status == 'cencelled'"><i class="badge badge-danger">{{ order.status }}</i></template>
                                        </td>
                                        <td>{{ moment(order.created_at).format('Do MMMM, Y') }}</td>   
                                        <td>
                                            <button class="btn btn-solid btn-xs" type="button" @click="viewOrder(order, index)">
                                                <i class="fa fa-eye" v-if="!order.fetch"></i>
                                                <i class="fa fa-spinner fa-spin" v-if="order.fetch"></i>
                                            </button>
                                        </td>                                     
                                    </tr>
                                </template>
                                <template v-if="!isEmpty($data.orders) && isEmpty($data.orders.items)">
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
            <div class="modal fade bd-example-modal-lg" id="view-order" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
                    <div class="modal-content">
                        <div class="modal-header d-flex">
                            <h5 class="modal-title" id="exampleModalLabel">View Order</h5>
                            <button type="button" class="btn-close mt-3 text-danger" @click="$data.modals.view = false" aria-label="Close">
                                <i class="fa fa-times-circle"></i>
                            </button>
                        </div>
                        <div class="modal-body">                            
                            <div class="container">
                                <div class="row">

                                </div>
                            </div>                                                                                         
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-solid btn- btn-sm" type="button">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> 
</template>

<script setup lang="ts">
import { computed, inject, onBeforeMount, onMounted, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import  moment from 'moment';
import { cloneDeep, isEmpty, sum, sumBy} from 'lodash';
import { CardLoader } from '../components';

const $api:  any = inject('$api'); 
const $data: any = reactive({
    loader: Boolean(),
    orders: Object(),
    order:  Object(),
    modals: {
        view: Object()
    }
});
const $store = useStore();
const home   = computed( () => $store.getters.home);

/**
 * Fetches all orders from the API and stores them in the reactive data object.
 * Sets the 'fetch' property of each order to false when the operation is complete.
 * @returns {Promise<void>}
 */
const fetch = (): Promise<void> => {
    // Show loader while fetching data
    $data.loader = true;

    // Fetch orders data from API
    return $api.get('/orders')
        .then( ({ data: { orders } }: any) => {
            // Clone and process orders data
            $data.orders = cloneDeep(orders);
            // Refactor order structure
            $data.orders.items = cloneDeep(orders).map( (order: any) => ({ ...order, fetch: false }) );            
        })
        .catch( () => {
            // Hide loader after error
            $data.loader = false;
        })
        .finally( () => {
            // Hide loader after processing
            $data.loader = false;
        });
}

/**
 * Fetch an order by its ID and store it in the reactive data object.
 * Set the corresponding order in the orders array to have a 'fetch' property of true, and then set it back to false when the operation is complete.
 * @param {string} id - The ID of the order to fetch
 * @param {number} index - The index of the order in the orders array
 * @returns {Promise<void>}
 */
const viewOrder = async ({id}:any, index: number) => {
    try {
        // Set the corresponding order in the orders array to have a 'fetch' property of true
        $data.orders.items[index].fetch = true;
        
        // Fetch the order from the API
        const { data: { order } } = await $api.put(`/orders/${id}/view`);
        
        // Store the fetched order in the reactive data object
        $data.order = cloneDeep(order);
    } catch(error) {
        // Set the corresponding order in the orders array to have a 'fetch' property of false
        $data.orders.items[index].fetch = false;
    } finally {
        // Set the corresponding order in the orders array to have a 'fetch' property of false
        $data.orders.items[index].fetch = false;
    }
}

onBeforeMount( () => fetch());
/**
 * Watch the 'edit' property of the 'modals' object and show or hide the view order modal accordingly
 */
watch(
    () => $data.modals.edit,
    /**
     * A callback function that will be executed when the 'edit' property of the 'modals' object changes
     * @param {boolean} value - The new value of the 'edit' property
     */
    (value) => {
        if (value) {
            // Show the view order modal
            $('#view-order').modal('show');
        } else {
            // Hide the view order modal
            $('#view-order').modal('hide');
        }
    },
)
</script>