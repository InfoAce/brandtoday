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
                                            <td>{{ getIndex(index) }}</td>
                                            <td>
                                                <img v-if="!$isNull(client.image)" :src="client.image" :alt="`${client.first_name} ${client.last_name}`"/>
                                                <h2 v-else><i class="fa fa-user-circle"></i></h2>
                                            </td>
                                            <td>{{ client.first_name }} {{ client.last_name }}</td>
                                            <td>{{ client.email }}</td>
                                            <td>{{ client.phone_number }}</td>
                                            <td>
                                                <h6 v-if="!$isEmpty(client.email_verified_at)" class="badge badge-success p-1 text-center"><i class="fa fa-check-circle"></i></h6>
                                                <h6 v-if="$isEmpty(client.email_verified_at)"  class="badge badge-primary p-1 text-center"><i class="fa fa-close "></i></h6>
                                            </td>
                                            <td>{{ $moment(client.created_at).format('Do MMMM, Y')}}</td>                                        
                                        </tr>
                                    </template>
                                    <template v-else>
                                        <tr>
                                            <td colspan="8" class="p-3">
                                                <h4 class="mb-0 text-center"><i class="fa fa-exclamation-triangle"></i> No clients found.</h4>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                        <div class="col-12 py-4 d-flex justify-content-center" v-if="!$isEmpty($data.clients)">
                            <paginate
                                v-model="$data.pagination.page"
                                :page-count="$data.pagination.pages"
                                :page-range="2"
                                :prev-text="'Prev'"
                                :next-text="'Next'"
                                container-class="text-center"
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
const $data    = reactive({
    clients: Object(),
    pagination: {
        page:  1, 
        pages: 1,
        limit: 5
    }
});

/**
 * Fetch clients data
 * 
 * @returns {void}
 */
const fetch = async () => {
    try {
        // Show the card loader
        store.commit('card_loader',true);
        // Get the page and per page from the pagination
        const { page, limit } = $data.pagination;
        // Fetch the users
        const { data: { users, count } } = await $api.get(`/dashboard/users?type=client&page=${page}&limit=${limit}`);
        // Hide the card loader
        store.commit('card_loader',false);
        // Set the clients to the users
        $data.clients          = cloneDeep(users);
        // Set the total number of pages
        $data.pagination.pages = Math.ceil(count/$data.pagination.limit);
    } catch(error) {
        // Hide the card loader
        store.commit('card_loader',false);
        // Show a toast error
        $toast.error(`Something went wrong while fetching users.`);
    } finally {
        // Hide the card loader
        store.commit('card_loader',false);        
    }
}

const getIndex = (index: number) => $data.pagination.page >= 2 ? ((index + 1) + $data.pagination.limit) : (index + 1) 

/**
 * Fetch categories data before the component is mounted
 * 
 * @returns {void}
 */
 onBeforeMount(() => fetch());

// Watch for page changes
watch( 
    () => $data.pagination.page,
    () => fetch()
)
</script>
