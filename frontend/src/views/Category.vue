<template>
        <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container-fluid">
                <div class="row px-4">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h4 class="text-theme">Sub Categories - {{ $data.products_count }} results</h4>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <nav aria-label="breadcrumb" class="theme-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#" @click.prevent="$router.push({name:'Home'})">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">{{ $data.category.name }}</li>
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
                                        <PlaceholderLoader v-if="isEmpty($data.sub_categories) && $data.loader || !isEmpty($data.sub_categories) && $data.loader" :count="10"/>
                                        <div class="row margin-res" v-if="!isEmpty($data.sub_categories) && !$data.loader">
                                            <div class="col-xl-3 col-6 col-grid-box mb-4" v-for="(sub_category,index) in $data.sub_categories" :key="index">
                                                <div class="card">
                                                    <div class="card-body product-card">
                                                        <a href="#" @click.prevent="viewProducts(sub_category)">
                                                            <div class="product-box">
                                                                <div class="img-wrapper">
                                                                    <div class="front">                                                    
                                                                        <img style="object-fit: cover !important;" v-if="!isEmpty(sub_category.image)" :src="sub_category.image.urls[0].url" :alt="sub_category.categoryName" height="300">
                                                                    </div>
                                                                </div>
                                                                <div class="product-detail">
                                                                    <h4>{{ sub_category.name }}</h4>
                                                                    <h6 class="text-muted">{{ sub_category.products_count }} products</h6>
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
import { PlaceholderLoader } from '../components';

// Magic variables
const $api    = inject('$api');
const $route  = useRoute();
const $router = useRouter();
const $store  = useStore();
const $data   = reactive({
    category:       Object(),
    loader:         Boolean(true),
    products_count: Number(),
    sub_categories: Array()
});

// Methods
const fetch = () => {
    const { params: { category } } = $route;
    $data.loader =  true;
    $api.put(`/categories/${category}/sub_categories`)
        .then( ({ data: { products_count, sub_categories, category } }) => {
            $data.sub_categories = cloneDeep(sub_categories).filter( sub => sub.products_count > 0 );
            $data.products_count = products_count;
            $data.category       = cloneDeep(category);
        })
        .catch( () => {
            $data.loader =  false           
        })
        .finally( () => {
            $data.loader =  false           
        })
}
const viewProducts = (sub_category) => {
    $router.push({ name: 'Products', params: { category: $route.params.category, sub_category: sub_category.id }})
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
</style>../../src/components