<template>
    <div>

    <!-- Home slider -->
    <section class="p-0">
        <div class="slide-1 home-slider">
            <div>
                <div class="home  text-center">
                    <img src="/assets/home/images/home-banner/1.jpg" alt="" class="bg-img blur-up lazyload">
                    <div class="container">
                        <div class="row">
                            <div class="col">
                                <div class="slider-contain">
                                    <div>
                                        <h4>welcome to fashion</h4>
                                        <h1>men fashion</h1>
                                        <a href="#" class="btn btn-solid">shop now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="home text-center">
                    <img src="/assets/home/images/home-banner/2.jpg" alt="" class="bg-img blur-up lazyload">
                    <div class="container">
                        <div class="row">
                            <div class="col">
                                <div class="slider-contain">
                                    <div>
                                        <h4>welcome to fashion</h4>
                                        <h1>women fashion</h1>
                                        <a href="#" class="btn btn-solid">shop now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
import { inject, onBeforeMount, onMounted, reactive } from 'vue';
import { cloneDeep } from 'lodash';
import { useStore } from 'vuex';

const $api   = inject('$api');
const $store = useStore();
const $data  = reactive({ categories: Array(), brands: Array() });

const fetch = () => {
    $store.commit('loader',true);
    $api.get('/home')
        .then( ({ data: { brands, categories }}) => {
            $data.brands     = cloneDeep(brands);
            $data.categories = cloneDeep(categories);
        })
        .catch( () => {
            $store.commit('loader',false);
        })
        .finally( () => {
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
            $store.commit('loader',false);
        })
};

const navigateTo = (item,key) => {
    return { name: 'Products',params: { category: btoa(item[key].toLowerCase()) } }
}

onBeforeMount( () => fetch() );

onMounted( () => {

    $('.home-slider-center').slick({
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 5000,
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
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    centerMode: true,
                    centerPadding: '40px',
                    dots: false
                }
            },
            {
                breakpoint: 460,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    centerMode: true,
                    centerPadding: '30px',
                    dots: false
                }
            }
        ]
    });

});
</script>