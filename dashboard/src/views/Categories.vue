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
                      <div class="card-header">
                          <form class="form-inline search-form search-box">
                              <div class="form-group">
                                  <input class="form-control-plaintext" type="search" placeholder="Search..">
                              </div>
                          </form>  
                      </div>
                      <div class="card-body p-6">                    
                          <div class="table-responsive table-desi">
                              <table class="review-table table">
                                  <thead>
                                      <tr>
                                          <th>#</th>
                                          <th>Name</th>
                                          <th>Code</th>
                                          <th>Path</th>
                                          <th>Sub Categories</th>
                                          <th>Created On</th>
                                          <th></th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                    <template v-if="!isEmpty($data.categories)">
                                        <tr v-for="(category,index) in $data.categories" :key="index">
                                          <td>{{ index + 1 }}</td>
                                          <td>{{ category.name }}</td>
                                          <td>{{ category.code }}</td>
                                          <td>{{ category.path }}</td>
                                          <td>{{ category.sub_categories_count }}</td>
                                          <td>{{ $moment(category.created_at).format('Do MMMM,Y') }}</td>      
                                          <td>
                                            <button 
                                                type="button" 
                                                @click.prevent="viewCategory(category)" 
                                                class="btn btn-solid btn-xs" 
                                                ref="buttonOrders"
                                            >
                                                View
                                            </button>
                                          </td>                                  
                                      </tr>
                                    </template>
                                    <template v-else>
                                        <tr>
                                            <td colspan="7" class=" p-4">
                                                <h4 class="mb-0 text-center"><i class="fa fa-exclamation-triangle"></i> No categories found.</h4>                                            
                                            </td>
                                        </tr>
                                    </template>
                                  </tbody>
                              </table>
                          </div>
                          <div class="col-12 py-4 d-flex justify-content-center" v-if="!$isEmpty($data.categories)">
                              <paginate
                                v-model="$data.pagination.page"
                                :page-count="$data.pagination.pages"
                                :page-range="2"
                                :click-handler="fetchPaginate"
                                :prev-text="'Prev'"
                                :next-text="'Next'"
                                container-class="text-center"
                              />
                          </div>
                          <EditCategory 
                            :modal="$data.modals.view" 
                            :data="$data.category" 
                            @updateModal="updateModal"
                            @fetchCategories="fetch"
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
import { inject, reactive, ref, watch, onMounted, onBeforeMount } from 'vue';
import { cloneDeep, debounce, each, isEmpty, isNull, has, set, times } from 'lodash';
import { useRouter } from 'vue-router';
import { CardLoader } from '../components';
import { useStore } from 'vuex';
import moment from 'moment';
import Paginate from "vuejs-paginate-next";
import { EditCategory } from './modals'

const $store    = useStore();
const $router   = useRouter();
const $api      = inject('$api');
const $toast    = inject('$toast');
const $moment  = moment;
const $isEmpty = isEmpty;
const $times   = times;
const $isNull  = isNull;
const $data    = reactive({
    categories: Array(),
    count:      Number(),
    category:   Object(),
    modals: {
        view: false
    },
    pagination: {
        page: 1, 
        pages: 0,
        limit: 10
    }
});

/**
 * Fetch all categories
 * @returns {Promise<void>}
 */
const fetch = async () => {
    try {
        // Show the loader
        $store.commit('card_loader',true);

        // Fetch categories from API
        const { page, limit } = $data.pagination;
        const { data: { categories, count } } = await $api.get(`/dashboard/categories?page=${page}&limit=${limit}`);

        // Hide the loader
        $store.commit('card_loader',false);

        // Set categories to the reactive data
        $data.categories       = cloneDeep(categories);
        $data.pagination.pages = Math.ceil(count/$data.pagination.limit);

    } catch(error) {
        // Hide the loader if there is an error
        $store.commit('card_loader',false);
    } finally {
        if( $data.modals.view ){
            $data.modals.view = Boolean();
        }
    }
}

/**
 * Fetch category by id
 * @param {Object} param0 - Contain `id` of the category
 * @returns {Promise<void>}
 */
const viewCategory = async ({ id }) => {
    try {
        // Show the loader
        $store.commit('card_loader',true);

        // Fetch category
        const { data: { category } } = await $api.put(`/dashboard/categories/${id}`);

        // Hide the loader
        $store.commit('card_loader',false);

        // Set category to the reactive data
        $data.category = cloneDeep(category);
        $data.modals.view = Boolean(true);
    } catch(error) {
        // Hide the loader
        $store.commit('card_loader',false);

        // Show error message using swal
        $toast.error('Something went wrong while fetching category information. Please try again later.');
    }
}


const fetchPaginate = () => {
    console.log(arguments);
}

const updateModal = (value) => {
    $data.modals.view = value
}

onBeforeMount(() => fetch());
</script>