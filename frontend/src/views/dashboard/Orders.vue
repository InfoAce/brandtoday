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
                      <div class="card-header py-4">
                          <form class="form-inline search-form search-box">
                              <div class="form-group">
                                  <input class="form-control-plaintext" type="search" placeholder="Search..">
                              </div>
                          </form>  
                      </div>
                      <div class="card-body">                    
                          <div class="table-responsive table-desi">
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
                                        <tr v-for="(order,index) in $data.orders.items" :key="index">
                                          <td>{{ index + 1 }}</td>
                                          <td> {{ order.num_id }}</td>
                                          <td></td>
                                          <td>{{ order.items.length }}</td>
                                          <td>KSH {{ order.total }}</td>
                                          <td>{{ order.status }}</td>
                                          <td>{{ $moment(order.created_at).format('Do MMMM, Y hh:mm:ss') }}</td>      
                                          <td>
                                            <a href="javascript:void(0)" class="btn btn-primary p-2 btn-sm">
                                                <div class="d-flex align-items-center">
                                                    View                                                    
                                                </div>
                                            </a>
                                          </td>                                  
                                      </tr>
                                    </template>
                                    <template v-else>
                                        <tr>
                                            <td colspan="8" class="text-center">
                                                <h4 class="mb-0"><i class="fa fa-exclamation-triangle"></i> No orders found.</h4>
                                            </td>
                                        </tr>
                                    </template>
                                  </tbody>
                              </table>
                          </div>
                          <div class="col-12 py-4 d-flex justify-content-center" v-if="!$isEmpty($data.orders)">
                              <paginate
                                  :page-count="$data.orders.meta.itemCount"
                                  :click-handler="fetchPaginate"
                                  :prev-text="'Prev'"
                                  :next-text="'Next'"
                                  :container-class="'className'"
                              />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <!-- Container-fluid Ends-->    
    </div>
</template>
  
<script setup lang="ts">
import { inject, reactive, onBeforeMount } from 'vue';
import { cloneDeep, isEmpty, isNull, has, sum, times } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";
import { toast  } from "vue3-toastify";
import { useStore } from 'vuex';
import moment from 'moment';
import Paginate from "vuejs-paginate-next";

const $store    = useStore();
const $router   = useRouter();
const $api     = inject('$api');
const swal     = inject('$swal');
const $moment  = moment;
const $isEmpty = isEmpty;
const $times   = times;
const $isNull  = isNull;
const $data     = reactive({
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
    isDisabled: true
});

const formSchema = yup.object().shape({
	first_name:       yup.string()
						 .required("*First name is required"),
	email:            yup.string()
						 .email("*Enter a valid email address")
						 .required("*Email address is required"),                         
    last_name:        yup.string()
						 .required("*Last name is required"),                       
});

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

const fetch = (params = { page: 1, limit: 10}) => {
    $store.commit('loader',true);
    let { page, limit } = params,url = `/dashboard/orders?page=${page}&limit=${limit}`;
    $api.get(url)
        .then( ({ data:{ orders } }) => {
            $data.orders       = cloneDeep(orders)
            $data.orders.items = $data.orders.items.map( order => {
                order.total = sum(order.items.map( item => item.price * item.quantity ));
                return order;
            });
        })
        .catch( ({ response }) => {
            $store.commit('loader',false);
        })
        .finally( () => {
            $store.commit('loader',false);
        });
}

const fetchPaginate = () => {
    console.log(arguments);
}

onBeforeMount(() => fetch());
</script>

<style scoped>
.review-table thead tr th {
    text-align: center !important;
}
.review-table tbody tr td {
    text-align: center !important;
}
</style>