<template>
  <div>
    <!-- Container-fluid starts-->
    <div class="container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-lg-6">
                    <div class="page-header-left">
                        <h3>
                          Clients
                          <small>List of registered clients.</small>
                        </h3>
                    </div>
                </div>
                <div class="col-lg-6">
                    <ol class="breadcrumb pull-right">
                        <li class="breadcrumb-item">
                            <a href="#" @click.prevent="router.push({ name: 'Overview' })">
                                <i data-feather="home"></i>
                                Overview                        
                            </a>
                        </li>
                        <li class="breadcrumb-item">Data management</li>
                        <li class="breadcrumb-item active">Clients</li>
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
                    <div class="card-body">
                        <form class="form-inline search-form search-box">
                            <div class="form-group">
                                <input class="form-control-plaintext" type="search" placeholder="Search..">
                            </div>
                        </form>                      
                        <div class="all-package coupon-table table-responsive my-4">
                            <table class="table trans-table all-package">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Avatar</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone Number</th>
                                        <th class="text-center">Active</th>
                                        <th>Joined On</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(client,index) in data.clients.items" :key="index">
                                        <td>{{ index + 1 }}</td>
                                        <td class="text-center">
                                          <img v-if="!$isNull(client.image)" :src="`${backendUri}${client.image}`" :alt="`${client.first_name} ${client.last_name}`"/>
                                          <h2 v-else><i class="fa fa-user-circle"></i></h2>
                                        </td>
                                        <td>{{ client.first_name }} {{ client.last_name }}</td>
                                        <td>{{ client.email }}</td>
                                        <td>{{ client.phone_number }}</td>
                                        <td class="text-center">
                                          <span class="text-success" v-if="!$isEmpty(client.email_verified_at )"><i class="fa fa-check-circle"></i></span>
                                          <span class="text-danger"  v-if="$isEmpty(client.email_verified_at )"><i class="fa fa-times-circle"></i></span>
                                        </td>
                                        <td>{{ $moment(client.created_at).format('Do MMMM, Y')}}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
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
import { inject, reactive, ref, watch, onMounted, onBeforeMount } from 'vue';
import { cloneDeep, debounce, each, isEmpty, isNull, has } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";
import { toast  } from "vue3-toastify";
import { useStore } from 'vuex';
import moment from 'moment';

const store    = useStore();
const router   = useRouter();
const $api     = inject('$api');
const swal     = inject('$swal');
const $moment  = moment;
const $isEmpty = isEmpty;
const $isNull  = isNull;

const data = reactive({
  clients: Object()
});

const fetch = () => {
	store.commit('loader',true);
	$api.get('/users?type=client')
		.then( ({ data:{ clients } }) => {
      data.clients = cloneDeep(clients);
		})
		.catch( ({ response }) => {
			store.commit('loader',false);
			if( !isEmpty(response.data) && response.data.statusCode == 400 ){
				response.data.message.forEach( (value) => {
					toast.info(value);
				});
			}
		})
		.finally( () => {
			store.commit('loader',false);
		});
}

onBeforeMount(() => fetch());
</script>

<style scoped>
table tbody tr td, table thead tr th  {
  padding: 0;
}
</style>