<template>
    <div class="tab-pane fade active show" id="account" role="tabpanel" aria-labelledby="home-tab">
        <!-- Container-fluid starts-->
        <div class="container-fluid">
            <div class="col-12 d-flex justify-content-end">
                <button class="btn btn-primary" @click="$data.modal.add = true" >Add Image</button>
            </div>
            <div class="row products-admin ratio_asos">
                <div class="col-xl-4 col-sm-6" v-for="(image,key) in $data.company.banners" :key="key">
                    <div class="card">
                        <div class="card-body product-box">
                            <div class="img-wrapper">
                                <div class="front">
                                    <a href="javascript:void(0)">
                                        <img :src="`${backendUri}/${image.path}`" class="img-fluid blur-up lazyload bg-img" alt="">
                                    </a>
                                    <div class="product-hover">
                                        <ul>
                                            <li>
                                                <button class="btn" type="button" data-original-title=""
                                                    title=""><i class="ti-pencil-alt"></i></button>
                                            </li>
                                            <li>
                                                <button class="btn"><i class="ti-trash"></i></button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="product-detail">    
                                <h4>{{ image.title }}</h4>
                                <h6>{{ image.description }}</h6>
                            </div>
                        </div>
                    </div>
                </div>                        
            </div>
        </div>
        <AddBanner 
            :show="$data.modal.add" 
            @update-modal="updateModal" 
            @fetch-data="fetch"
        />
        <!-- Container-fluid Ends-->
    </div>    
</template>
<script lang="ts" setup>
import { AddBanner } from '../modals';
import { computed, inject, onBeforeMount, reactive } from 'vue';
import { useStore } from 'vuex';

// Magin variables
const $api  = inject('$api');
const $data = reactive({
    company: Object(),
    modal: {
        add:  Boolean(),
        edit: Boolean()
    }
});
const $store = useStore();

// Computed variables //
const backendUri = computed( () => $store.getters.env.VITE_API_BASE_URL.replace('api/v1','') );

// Methods
const fetch = () => {
    $store.commit('loader',true);
    $api.get('/dashboard/website')
        .then( ({ data: { company } }) => {
            $data.company = company;
        })
        .catch( () => {
            $store.commit('loader',false);
        })
        .finally( () => {
            $store.commit('loader',false);
        });
}

const updateModal = (value:boolean) => {
    $data.modal.add = value;
}

onBeforeMount( () => fetch())
</script>