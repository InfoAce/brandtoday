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
                    <CardLoader />
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
                                    <template v-if="!$isEmpty($data.clients)">
                                        <tr v-for="(client,index) in $data.clients" :key="index">
                                            <td>{{ index + 1 }}</td>
                                            <td>
                                            <img v-if="!$isNull(client.image)" :src="client.image" :alt="`${client.first_name} ${client.last_name}`"/>
                                            <h2 v-else><i class="fa fa-user-circle"></i></h2>
                                            </td>
                                            <td>{{ client.first_name }} {{ client.last_name }}</td>
                                            <td>{{ client.email }}</td>
                                            <td>{{ client.phone_number }}</td>
                                            <td>
                                                <h6 v-if="!$isEmpty(client.email_verified_at)" class="badge badge-success p-2"><i class="fa fa-check-circle"></i></h6>
                                                <h6 v-if="$isEmpty(client.email_verified_at)" class="badge badge-primary p-2"><i class="fa fa-close "></i></h6>
                                            </td>
                                            <td>{{ $moment(client.created_at).format('Do MMMM, Y')}}</td>                                        
                                        </tr>
                                    </template>
                                    <template v-else>
                                        <tr>
                                            <td colspan="8" class="text-center p-5">
                                                <h4 class="mb-0"><i class="fa fa-exclamation-triangle"></i> No clients found.</h4>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                        <div class="col-12 py-4 d-flex justify-content-center" v-if="!$isEmpty($data.clients)">
                            <paginate
                                :page-count="$data.filter.total"
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
import { CardLoader } from '../components';
import { useStore } from 'vuex';
import moment from 'moment';
import Paginate from "vuejs-paginate-next";

const store    = useStore();
const router   = useRouter();
const $api     = inject('$api');
const $toast   = inject('$toast');
const swal     = inject('$swal');
const $moment  = moment;
const $isEmpty = isEmpty;
const $times   = times;
const $isNull  = isNull;
const $data    = reactive({clients: Object(),filter:{ page: 1, perPage: 10, total: 0 }});

const fetch = async () => {
    try {
        store.commit('card_loader',true);
        let { page, perPage } = $data.filter,url = `/dashboard/users?type=client&page=${page}&limit=${perPage}`;
        let { data: { users, count } } = await $api.get(url);
        store.commit('card_loader',false);
        $data.clients      = cloneDeep(users);
        $data.filter.total = count;
    } catch(error) {
        store.commit('card_loader',false);
        $toast.error(`Something went wrong while fetching users.`);
    }
}

/**
 * Handles pagination click event.
 * 
 * @param {Object} event The pagination event object.
 */
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