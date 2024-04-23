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
                                        <th>Avatar</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone Number</th>
                                        <th>Active</th>
                                        <th>Joined On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(client,index) in data.clients.items" :key="index">
                                        <td>{{ index + 1 }}</td>
                                        <td>
                                          <img v-if="!$isNull(client.image)" :src="`${backendUri}${client.image}`" :alt="`${client.first_name} ${client.last_name}`"/>
                                          <h2 v-else><i class="fa fa-user-circle"></i></h2>
                                        </td>
                                        <td>{{ client.first_name }} {{ client.last_name }}</td>
                                        <td>{{ client.email }}</td>
                                        <td>{{ client.phone_number }}</td>
                                        <td class="td-check">
                                            <i v-if="!$isEmpty(client.email_verified_at)" data-feather="check-circle"></i>
                                            <i v-if="$isEmpty(client.email_verified_at)" data-feather="x-circle"></i>
                                        </td>
                                        <td>{{ $moment(client.created_at).format('Do MMMM, Y')}}</td>                                        
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="col-12 py-4 d-flex justify-content-center" v-if="!$isEmpty(data.clients)">
                            <paginate
                                :page-count="data.clients.meta.itemCount"
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
import { inject, reactive, ref, watch, onMounted, onBeforeMount } from 'vue';
import { cloneDeep, debounce, each, isEmpty, isNull, has, set, times } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";
import { toast  } from "vue3-toastify";
import { useStore } from 'vuex';
import moment from 'moment';
import Paginate from "vuejs-paginate-next";

const store    = useStore();
const router   = useRouter();
const $api     = inject('$api');
const swal     = inject('$swal');
const $moment  = moment;
const $isEmpty = isEmpty;
const $times   = times;
const $isNull  = isNull;
const data     = reactive({clients: Object()});

const fetch = (params = { page: 1, limit: 10}) => {
	store.commit('loader',true);
    let { page, limit } = params,url = `/dashboard/users?type=client&page=${page}&limit=${limit}`;
	$api.get(url)
		.then( ({ data:{ users } }) => {
            set(data,'clients',cloneDeep(users));
		})
		.catch( ({ response }) => {
			store.commit('loader',false);
		})
		.finally( () => {
			store.commit('loader',false);
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