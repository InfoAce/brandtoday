<template>
        <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container-fluid">
                <div class="row px-4">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h2 class="text-theme">Sub Categories - {{ $data.products_count }} results</h2>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <nav aria-label="breadcrumb" class="theme-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#" @click.prevent="$router.push({name:'Home'})">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">{{ $route.query.category }}</li>
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
                <div class="container-fluid">
                    <div class="row px-4">
                        <div class="collection-content col">
                            <div class="page-main-content">
                                <div class="collection-product-wrapper">
                                    <div class="product-wrapper-grid">
                                        <div class="row margin-res" v-show="!isEmpty($data.sub_categories)">
                                            <div class="col-xl-3 col-6 col-grid-box mb-4" v-for="(sub_category,index) in $data.sub_categories" :key="index">
                                                <a href="#" @click.prevent="viewProducts(sub_category)">
                                                    <div class="product-box">
                                                        <div class="img-wrapper">
                                                            <div class="front">                                                    
                                                                <img style="object-fit: cover !important;" v-if="!isEmpty(sub_category.image)" :src="sub_category.image.urls[0].url" :alt="sub_category.categoryName" height="300">
                                                            </div>
                                                        </div>
                                                        <div class="product-detail">
                                                            <h4>{{ sub_category.categoryName }}</h4>
                                                        </div>
                                                    </div>
                                                </a>
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
import { useRoute, useRouter } from 'vue-router';
import { inject, onBeforeMount, reactive, watch } from 'vue';
import { useStore } from 'vuex';

// Magic variables
const $api    = inject('$api');
const $route  = useRoute();
const $router = useRouter();
const $store  = useStore();
const $data   = reactive({
    products_count: Number(),
    sub_categories: Array()
});

// Methods
const fetch = () => {
    const { query: { category } } = $route;
    $store.commit('loader',true);
    $api.put(`/categories/${btoa(category)}/sub_categories`)
        .then( ({ data: { products_count, sub_categories } }) => {
            $data.sub_categories = cloneDeep(sub_categories);
            $data.products_count = products_count;
        })
        .catch( () => {
            $store.commit('loader',false);            
        })
        .finally( () => {
            $store.commit('loader',false);
        })
}
const viewProducts = (sub_category) => {
    $router.push({ name: 'Products', query: { category: $route.query.category, sub_category: sub_category.categoryName }})
}

// Initialize component
onBeforeMount( () => fetch());

// Watch variables
watch( 
    () => $route.query,
    () => {
        fetch();
    },
    {
        deep: true
    }
)
</script>

<style>
    .card-body img {
        width: 100%;
        height: 100%;
        object-fit: fill;
        position: relative;
        top: 0;
        transition: 0.5s ease-in-out;
    }
</style>