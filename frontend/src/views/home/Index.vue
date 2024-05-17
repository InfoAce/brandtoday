<template>
    <div>

    <!-- Home slider -->
    <section class="p-0">
        <div class="slide-1 home-slider">
            <template  v-for="(image,key) in $data.banners" :key="key">
                <div class="home text-center">
                    <img :src="`${backendUri}${image.path}`" alt="" class="bg-img blur-up lazyload" style="position:absolute !important;">
                    <div class="container-fluid" >
                        <div class="row">
                            <div class="col-12 px-0" style="background-color: rgba(200,200,200,0.7) !important;">
                                <div class="slider-contain container">
                                    <div class="row">
                                        <div class="col-12 text-left">
                                            <h4>{{ image.description }}</h4>
                                            <h1>{{ image.title }}</h1>
                                            <a href="#" class="btn btn-solid">shop now</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </section>
    <!-- Home slider end -->

    <!-- Paragraph-->
    <div class="title1 section-t-space">
        <h2 class="title-inner1">View products by category</h2>
    </div>
    <div class="container">
        <div class="row">
            <div class="col-lg-6 offset-lg-3">
                <div class="product-para">
                    <p class="text-center">We have grouped the products into these categories. Try it out.</p>
                </div>
            </div>
        </div>
    </div>
    <!-- Paragraph end -->


    <!-- Product slider -->
    <section class="section-b-space pt-0 ratio_asos">
        <div class="container">
            <div class="row">
                <div class="col">
                    <div class="product-4 product-m no-arrow">
                        <div class="product-box" v-for="(category,index) in $data.categories" :key="index">
                            <div class="img-wrapper">
                                <div class="front">
                                    <router-link :to="navigateTo(category,'categoryPath')">
                                        <img :src="category.image" class="img-fluid blur-up lazyload bg-img" alt="">
                                    </router-link>
                                </div>
                                <div class="back">
                                    <router-link :to="navigateTo(category,'categoryPath')">
                                        <img :src="category.image" class="img-fluid blur-up lazyload bg-img" alt="">
                                    </router-link>
                                </div>
                            </div>
                            <div class="product-detail">
                                <router-link :to="navigateTo(category,'categoryPath')">
                                    <h4>{{ category.categoryName }}</h4>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Product slider end -->

    <!--  logo section -->
    <section class="section-b-space py-0">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="logo-list no-arrow">
                        <div v-for="(brand,index) in $data.brands" :key="index">
                            <div class="logo-block">
                                <a href="#"><img :src="brand.image" :alt="brand.name" width="300"></a>
                            </div>
                        </div>                       
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--  logo section end-->
</div>
</template>

<script setup>
import { computed, inject, nextTick, onBeforeMount, onMounted, reactive } from 'vue';
import { cloneDeep, debounce } from 'lodash';
import { useStore } from 'vuex';

const $api   = inject('$api');
const $store = useStore();
const $data  = reactive({ categories: Array(), brands: Array(), banners: Array() });

// Computed variables //
const backendUri = computed( () => $store.getters.env.VITE_API_BASE_URL.replace('api/v1','') );

// Methdos //
const fetch = () => {
    $store.commit('loader',true);
    $api.get('/home')
        .then( ({ data: { brands, categories, banners }}) => {
            $data.brands     = cloneDeep(brands);
            $data.categories = cloneDeep(categories);
            $data.banners    = cloneDeep(banners);       
        })
        .catch( () => {
            $store.commit('loader',false);
        })
        .finally( () => {
            $store.commit('loader',false);
            $('.product-4, .brand-list, .logo-list').slick({
                infinite: true,
                speed: 300,
                slidesToShow: 4,
                slidesToScroll: 4,
                autoplay: true,
                autoplaySpeed: 3000,
                responsive: [{
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                        }
                    },
                    {
                        breakpoint: 991,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    }
                ]
            });               
            $('.slide-1').slick({});
        })
};

const navigateTo = (item,key) => {
    return { name: 'Products',params: { category: btoa(item[key].toLowerCase()) } }
}

onBeforeMount( () => fetch() );

onMounted( () => {
    // $('.slide-1').slick({});

});
</script>