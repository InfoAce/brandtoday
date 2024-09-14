<template>
    <div>
      <!-- Container-fluid starts-->
      <div class="container-fluid">
          <div class="page-header">
              <div class="row">
                  <div class="col-lg-6">
                      <div class="page-header-left">
                          <h3>
                            Queues
                            <small>List of Amrod Data Queues</small>
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
                          <li class="breadcrumb-item active">Queues</li>
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
                            <table class="table">
                                  <thead>
                                      <tr>
                                          <th>#</th>
                                          <th>Type</th>
                                          <th>Status</th>
                                          <th>State</th>
                                          <th>Depends On</th>
                                          <th>Created On</th>
                                          <th></th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <template v-if="!$isEmpty($data.queues)">
                                          <tr v-for="(queue,index) in $data.queues" :key="index">
                                              <td>{{ index + 1 }}</td>
                                              <td>{{ queue.type }}</td>
                                              <td><span class="badge badge-info">{{ queue.status }}</span></td>
                                              <td>
                                                <VueToggles :value="queue.state" @click="toggleSync(queue)" />
                                              </td>
                                              <td>
                                                <span class="badge badge-success" v-if="!isNull(queue.parent)">{{ queue.parent }}</span>
                                                <span class="badge badge-info" v-if="isNull(queue.parent)">None</span>
                                              </td>
                                              <td>{{ $moment(queue.created_at).format('Do MMMM, Y')}}</td>        
                                              <td>
                                                <button class="btn btn-primary btn-lg"><i class="fa fa-sync"></i></button>
                                              </td>                                
                                          </tr>
                                      </template>
                                      <template v-else>
                                          <tr>
                                              <td colspan="8" class="text-center p-3">
                                                  <h4 class="mb-0"><i class="fa fa-exclamation-triangle"></i> Nothing found here.</h4>
                                              </td>
                                          </tr>
                                      </template>
                                  </tbody>
                              </table>
                          </div>
                          <!-- <div class="col-12 py-4 d-flex justify-content-center" v-if="!$isEmpty($data.clients)">
                              <paginate
                                  :page-count="$data.clients.meta.itemCount"
                                  :click-handler="fetchPaginate"
                                  :prev-text="'Prev'"
                                  :next-text="'Next'"
                                  :container-class="'className'"
                              />
                          </div> -->
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
  import { cloneDeep, isEmpty, isNull } from 'lodash';
  import { useRouter } from 'vue-router';
  import { CardLoader } from '../components';
  import { useStore } from 'vuex';
  import moment from 'moment';
  import { VueToggles } from "vue-toggles";
  import Paginate from "vuejs-paginate-next";
  
  const store    = useStore();
  const router   = useRouter();
  const $api     = inject('$api');
  const $swal    = inject('$swal');
  const $moment  = moment;
  const $isEmpty = isEmpty;
  const $isNull  = isNull;
  const $data    = reactive({queues: Object()});
  
  const fetch = async () => {
    try {
        store.commit('card_loader',true);
        const { data: { queues } } = await $api.get(`/dashboard/queues`);
        store.commit('card_loader',false);
        $data.queues = cloneDeep(queues);
    } catch(error) {
        store.commit('card_loader',false);
    }
  }
  
  const toggleSync = async (item) => {
    if( !isNull(item.parent) && $data.queues.find( val => val.type == item.parent && val.status != 'complete') ){
        return $swal?.fire({
            icon: 'warning', // Icon to display in the dialog
            title: 'Oops!!', // Title of the dialog
            text:  'This queue will not be synced as its depends on another queue which is not complete.', // Text content of the dialog
            showCancelButton: true // Whether to show a "Cancel" button
        })
    }
    try {
        const { data: { queue } } = await $api.put(`/dashboard/queues/${item.id}/update`,{state: !item.state});
        $data.queues = $data.queues.map( val => {
            if( val.id === item.id ) {
                return queue;
            }
            return val;
        });
    } catch(error) {
        store.commit('card_loader',false);
    }
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