<template>
        <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h2>Sub Categories</h2>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <nav aria-label="breadcrumb" class="theme-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#" @click.prevent="$router.push({name:'Home'})">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Sub Categories</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <!-- breadcrumb end -->


        <!-- section start -->
        <section class="section-b-space ratio_asos">
            <div class="collection-wrapper">
                <div class="container">
                    <div class="row">
                        <div class="collection-content col">
                            <div class="page-main-content">
                                <div class="collection-product-wrapper">
                                    <div class="product-wrapper-grid">
                                        <div class="row margin-res" v-show="!isEmpty($data.sub_categories)">
                                            <div class="col-xl-3 col-6 col-grid-box mb-4" v-for="(sub_category,index) in $data.sub_categories" :key="index">
                                                <a href="#" @click.prevent="$router.push({ name: 'Products', params: { category: sub_category.fullCode }})">
                                                    <div class="card">
                                                        <div class="card-body p-0" >
                                                            <img v-if="!isEmpty(sub_category.image)" class="img-fluid blur-up lazyload bg-img w-100" :src="sub_category.image" alt="">
                                                            <h1 v-else class="w-100"><i class="fa fa-image"></i></h1>
                                                        </div>
                                                        <div class="card-footer bg-white">
                                                            <h4 class="mb-0"><strong>{{ sub_category.categoryName }}</strong></h4>
                                                            <h5 class="mb-0">{{ sub_category.categoryCode }}</h5>
                                                        </div>
                                                    </div>
                                                </a>
                                                <!-- <div class="product-box">
                                                    <div class="img-wrapper">
                                                        <div class="front">
                                                            <img class="img-fluid blur-up lazyload bg-img" :src="sub_category.image" alt="">
                                                        </div>
                                                    </div>
                                                    <div class="product-detail">
                                                        <div>
                                                            <a href="#" @click.prevent="$router.push({ name: 'Products', params: { category: sub_category.fullCode }})">
                                                                <h4><strong>{{ sub_category.categoryName }}</strong></h4>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- section End -->        
    </div>
</template>

<script setup lang="ts">
import { cloneDeep, isEmpty } from 'lodash';
import { useRoute } from 'vue-router';
import { inject, onBeforeMount, reactive, watch } from 'vue';
import { useStore } from 'vuex';

// Magic variables
const $api   = inject('$api');
const $route = useRoute();
const $store = useStore();
const $data  = reactive({
    sub_categories: Array()
});

// Methods
const fetch = () => {
    const { params: { category } } = $route;
    $store.commit('loader',true);
    $api.put(`/categories/view/${category}`)
        .then( ({ data: { sub_categories } }) => {
            $data.sub_categories = cloneDeep(sub_categories);
        })
        .catch( () => {
            $store.commit('loader',false);            
        })
        .finally( () => {
            $store.commit('loader',false);
        })
}

// Initialize component
onBeforeMount( () => fetch());

// Watch variables
watch( 
    () => $route.params,
    () => {
        fetch();
    },
    {
        deep: true
    }
)
</script>