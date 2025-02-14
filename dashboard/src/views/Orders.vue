<template>
    <div>
      <!-- Container-fluid starts-->
      <div class="container-fluid">
          <div class="page-header">
              <div class="row">
                  <div class="col-lg-6">
                      <div class="page-header-left">
                        <h3>Orders</h3>
                        <p>List of created orders.</p>
                      </div>
                  </div>
                  <div class="col-lg-6">
                      <ol class="breadcrumb pull-right">
                          <li class="breadcrumb-item">
                              <a href="#" @click.prevent="$router.push({ name: 'Overview' })">
                                  <i data-feather="home"></i>
                                  Overview                        
                              </a>
                          </li>
                          <li class="breadcrumb-item">Data management</li>
                          <li class="breadcrumb-item active">Orders</li>
                      </ol>
                  </div>
              </div>
          </div>
      </div>
      <!-- Container-fluid Ends-->
  
      <!-- Container-fluid starts-->
      <div class="container-fluid">
          <div class="row">
              <div class="col-sm-12">
                  <div class="card">
                    <CardLoader />
                    <div class="card-header py-4">
                        <form class="form-inline search-form search-box">
                            <div class="form-group">
                                <input class="form-control-plaintext" type="search" placeholder="Search..">
                            </div>
                        </form>  
                    </div>
                    <div class="card-body">                    
                        <div class="table-desi">
                            <table class="review-table table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Order No.</th>
                                        <th>User</th>
                                        <th>Items</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Created On</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                <template v-if="!isEmpty($data.orders)">
                                    <tr v-for="(order,index) in $data.orders" :key="index">
                                        <td>{{ getIndex(index) }}</td>
                                        <td> {{ order.num_id }}</td>
                                        <td>{{ order.__user__.first_name }} {{ order.__user__.last_name }}</td>
                                        <td>{{ order.items.length }}</td>
                                        <td>{{ company.currency }} {{ order.total }}</td>
                                        <td>
                                            <h6 v-if="order.status == 'paid'" class="badge badge-success badge-outline p-1"><i class="fa fa-check-circle"></i> {{ order.status }}</h6>
                                            <h6 v-if="order.status == 'pending'" class="badge badge-warning p-1"><i class="fa fa-exclamation-triangle "></i> {{ order.status }}</h6>
                                            <h6 v-if="order.status == 'shipped'" class="badge badge-info p-1"><i class="fa fa-exclamation-triangle "></i>{{ order.status }}</h6>
                                        </td>
                                        <td>
                                            {{ $moment(order.created_at).format('hh:mm:ss') }} <br>
                                            {{ $moment(order.created_at).format('Do MMMM Y') }}
                                        </td>      
                                        <td>
                                            <div class="dropdown">
                                                <button class="btn btn-outline-primary dropdown-toggle btn-sm px-2" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click="viewMenu">
                                                    More
                                                </button>
                                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                    <a class="dropdown-item" href="#" @click.prevent="viewOrder(order)">View</a>
                                                    <a class="dropdown-item" href="#" @click.prevent="viewTimeline(order)">Timeline</a>
                                                    <a class="dropdown-item" href="#" v-if="authUser.role.state == 3" @click.prevent="deleteOrder(order)">Delete</a>
                                                </div>
                                            </div>
                                        </td>                                  
                                    </tr>
                                </template>
                                <template v-else>
                                    <tr>
                                        <td colspan="8" class="p-3">
                                            <h4 class="mb-0 text-center"><i class="fa fa-exclamation-triangle"></i> No orders found.</h4>
                                        </td>
                                    </tr>
                                </template>
                                </tbody>
                            </table>
                        </div>
                        <div class="col-12 py-4 d-flex justify-content-center" v-if="!$isEmpty($data.orders)">
                            <paginate
                                v-model="$data.pagination.page"
                                :page-count="$data.pagination.pages"
                                :page-range="2"
                                :prev-text="'Prev'"
                                :next-text="'Next'"
                                container-class="text-center"
                            />
                        </div>
                        <EditOrder 
                            :data="$data.view" 
                            @update-modal="updateEditModal" 
                        />
                        <OrderTimeline 
                            :data="$data.timeline" 
                            @update-modal="closeTimeline" 
                        />
                    </div>
                  </div>
              </div>
          </div>
      </div>
      <!-- Container-fluid Ends-->    
    </div>
</template>
  
<script setup lang="ts">
import { computed, inject, reactive, nextTick, onBeforeMount, ref, watch, onMounted } from 'vue';
import { cloneDeep, isEmpty, isNull, get, has, sum, times } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";
import { toast  } from "vue3-toastify";
import { useStore } from 'vuex';
import moment from 'moment';
import Paginate from "vuejs-paginate-next";
import { EditOrder, OrderTimeline } from './modals'
import { CardLoader } from '../components';

const $store   = useStore();
const $router  = useRouter();
const $api     = inject('$api');
const $swal    = inject('$swal');
const $toast   = inject('$toast');
const $moment  = moment;
const $isEmpty = isEmpty;
const $times   = times;
const $isNull  = isNull;
const $data    = reactive({
    orders: Object(),
    errors: Object(),
    form:{ 
        first_name: String(), 
        last_name:  String(), 
        email:      String(),
    },
    loader: {
        register: false
    },
    isDisabled: true,
    modals:{
        edit: Boolean()  
    },
    pagination: {
        page:  1, 
        pages: 1,
        limit: 5
    },
    timeline: {
        order_number: String(),
        timelines:    Array()
    },
    view:     Object()
});

/**
 * A reactive reference to an array of HTMLButtonElements, which will store the edit buttons in the orders table
 * 
 * @type {Ref<HTMLButtonElement[]>}
 */
const buttonOrders = ref([]);

/**
 * Expose the buttonOrders ref to the parent component
 * 
 * @type {Ref<HTMLButtonElement[]>}
 */
defineExpose({ buttonOrders });

/**
 * Computed property for accessing the company details from the Vuex store
 * 
 * @returns {Object} The company object from the Vuex store
 */
const company = computed(() => $store.getters.home.company);

/**
 * Computed property for accessing the logged in user's data
 * 
 * @returns {Object} The user object from the Vuex store
 */
const authUser = computed( () => get($store.getters.auth,'user') );

/**
 * The form schema for the orders table
 * 
 * @typedef {Object} FormSchema
 * 
 * @property {string} first_name - The first name of the user
 * @property {string} email - The email address of the user
 * @property {string} last_name - The last name of the user
 */
const formSchema = yup.object().shape({
    /**
     * The first name of the user
     * 
     * @type {string}
     */
	first_name:       yup.string()
						 .required("*First name is required"),
    /**
     * The email address of the user
     * 
     * @type {string}
     */
	email:            yup.string()
						 .email("*Enter a valid email address")
						 .required("*Email address is required"),                         
    /**
     * The last name of the user
     * 
     * @type {string}
     */
    last_name:        yup.string()
						 .required("*Last name is required"),                       
});

/**
 * Form validation
 * 
 * @param field 
 * @returns {void}
 */
const validateForm = (field) => {
	formSchema.validateAt(field, data.form)
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

/**
 * Computes the index of the current element in the orders array
 * 
 * @param {number} index - The index of the current element in the orders array
 * @returns {number} The computed index
 */
const getIndex = (index: number): number => 
    $data.pagination.page >= 2 
        ? ((index + 1) + $data.pagination.limit) 
        : (index + 1);

/**
 * Fetch orders with pagination and compute total price for each order
 *
 * @returns {Promise<void>}
 */
const fetch = async () => {
    try {
        // Show loader while fetching data
        $store.commit('loader', true);

        // Destructure pagination
        const { page, limit } = $data.pagination;
        
        // Fetch orders data from API with pagination parameters
        const { data: { orders, count } } = await $api.get(`/dashboard/orders?page=${page}&limit=${limit}`);

        $store.commit('loader', false);

        // Clone and process orders data
        $data.orders = cloneDeep(orders);

        $data.orders = orders.map(
            order => {
                // Calculate total price for each order
                order.total = sum(order.items.map(item => item.price * item.quantity));
                return order;
            }
        );
        
        // Set the total number of pages
        $data.pagination.pages = Math.ceil(count/$data.pagination.limit);       
    } catch (error) {
        $store.commit('loader', false);
        console.error("Error fetching orders:", error);
    } finally {
        // Hide loader after processing
        $store.commit('loader', false);
    }
}

/**
 * Deletes an order by its ID
 * 
 * @param {Object} payload - The order data
 * @param {Number} payload.id - The order ID
 * @returns {Promise<void>}
 */
const deleteOrder = async ({ id, num_id }: any) => {
    const target = $(event.target);
    try{
        // Show spinner on the view button
        target.html(`<i class="fa fa-spinner fa-spin fa-sm"></i> ${$(event.target).text()}`)

        // Confirm deletion
        const { isConfirmed } = await $swal?.fire({
            icon: 'question',
            title: 'Delete Order',
            text: 'Are you sure you want to delete this order?',
            showCancelButton: true
        });

        // If not confirmed, exit
        if( !isConfirmed ) return;           

        // Delete order from API
        await $api.delete(`/dashboard/orders/${id}`);

        // Show success message
        $toast.success(`Order #${num_id} deleted successfully`);

        // Fetch orders data after deletion
        await fetch();

        // Hide the spinner on the view button
        target.html('Delete');        
    } catch (error) {
        // Hide the spinner on the view button
        target.html('Delete');

        $store.commit('loader', false);
    } finally {
        // Hide the spinner on the view button
        target.html('Delete');       
         
        // Hide loader after deletion
        $store.commit('loader', false);
    }
}

/**
 * Toggles the dropdown menu for viewing the order details
 * 
 * @returns {void}
 */
const viewMenu = () => {
    $(event.target).dropdown('toggle');
}
/**
 * Fetch the order and open the modal for editing
 * 
 * @param {string} id - The id of the order to fetch
 * @param {number} index - The index of the order in the orders array
 * @returns {void}
 */
const viewOrder = async ({ id }: any): Promise<void> => {
    const target = $(event.target);
    try {
        // Show spinner on the view button
        target.html(`<i class="fa fa-spinner fa-spin fa-sm"></i> ${$(event.target).text()}`)
        
        // Fetch the order from the API
        const { data: { order } } = await $api.put(`/dashboard/orders/${id}/view`);
        
        // Clone and set the order data to the view modal
        $data.view              = cloneDeep(order); 
        
        // Hide the spinner on the view button
        target.html('View');
    } catch(error) {
        // Hide the spinner on the view button
        target.html('View');
    } finally {
        // Hide the spinner on the view button
        target.html('View');
        // Toggle the dropdown
        $('.dropdown-toggle').dropdown('hide')
    }
}
/**
 * Fetch the order and open the modal for editing
 * 
 * @param {string} id - The id of the order to fetch
 * @param {number} index - The index of the order in the orders array
 * @returns {void}
 */
 const viewTimeline = async ({ id }: any): Promise<void> => {
    const target = $(event.target);
    try {
        // Show spinner on the view button
        target.html(`<i class="fa fa-spinner fa-spin fa-sm"></i> ${$(event.target).text()}`)
        
        // Fetch the order from the API
        const { data: { order_number, timelines } } = await $api.put(`/dashboard/orders/${id}/timeline`);
        
        // Clone and set the order data to the view modal
        $data.timeline                = cloneDeep({ order_number, timelines }); 
        
        // Hide the spinner on the view button
        target.html('Timeline');
    } catch(error) {
        // Hide the spinner on the view button
        target.html('Timeline');
    } finally {
        // Hide the spinner on the view button
        target.html('Timeline');
        // Toggle the dropdown
        $('.dropdown-toggle').dropdown('hide')
    }
}
/**
 * Update edit modal
 * 
 * @param {void}
 * @returns {void}
 */
 const updateEditModal = () => $data.view = Object()

/**
 * Update edit modal
 * 
 * @param {void}
 * @returns {void}
 */
 const closeTimeline = () => $data.timeline = { order_number: String(), timelines: Array() }

/**
 * Fetch orders data before the component is mounted
 * 
 * @returns {void}
 */
onBeforeMount(() => fetch())
</script>