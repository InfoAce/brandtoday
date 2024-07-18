<template>
    <div>

        <!-- Home slider -->
        <section class="p-0">
            <template v-if="isEmpty($data.banners) && $data.loading || isEmpty($data.banners) && !$data.loading">
                <div class="ssc">
                    <div class="ssc-wrapper">
                        <div class="ssc-square"></div>                               
                        <div class="ssc-square"></div>                               
                        <div class="ssc-square"></div>                               
                    </div>
                </div>             
            </template>
            <carousel  
                v-show="!isEmpty($data.categories) && !$data.loading" 
                :transition="10000"
                class="p-0"
                :settings="$data.settings.banners" 
            >
                <slide v-for="(image,index) in $data.banners" :key="index" :style="`height:${$store.getters.banner_height}px;`">
                    <img :src="image.path" alt="" class="bg-img blur-up lazyload" style="position:absolute !important;">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-12 px-0 d-flex align-items-center" :style="`height:${$store.getters.banner_height}px;`">
                                <div class="slider-contain container">
                                    <div class="row">
                                        <div class="col-12 text-left d-flex flex-column align-items-start">
                                            <h4 class="text-white">{{ image.description }}</h4>
                                            <h1 class="text-white">{{ image.title }}</h1>
                                            <a href="#" class="btn btn-solid">shop now</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </slide>
                <template #addons>
                    <pagination />
                </template>
            </carousel>        
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
        <section class="section-b-space py-0 ratio_asos">
            <div class="container">
                <div class="row">
                    <template v-if="isEmpty($data.categories) && $data.loading || isEmpty($data.categories) && !$data.loading">
                        <div class="col-xl-3 col-6">
                            <div class="ssc">
                                <div class="ssc-wrapper">
                                    <div class="ssc-square mb"></div>                               
                                </div>
                            </div>    
                        </div>
                        <div class="col-xl-3 col-6">
                            <div class="ssc">
                                <div class="ssc-wrapper">
                                    <div class="ssc-square mb"></div>                               
                                </div>
                            </div>    
                        </div>
                        <div class="col-xl-3 col-6">
                            <div class="ssc">
                                <div class="ssc-wrapper">
                                    <div class="ssc-square mb"></div>                               
                                </div>
                            </div>    
                        </div>         
                        <div class="col-xl-3 col-6">
                            <div class="ssc">
                                <div class="ssc-wrapper">
                                    <div class="ssc-square mb"></div>                               
                                </div>
                            </div>    
                        </div>                             
                    </template>
                    <carousel  
                        v-show="!isEmpty($data.categories) && !$data.loading" 
                        :settings="$data.settings.categories" 
                        :itemsToShow="3" 
                        :wrapAround="true" 
                        :transition="10000"
                        :breakpoints="$data.breakpoints.categories"
                        :autoplay="true"
                    >
                        <slide v-for="(category,index) in $data.categories" :key="index">
                            <div class="carousel__item">
                                <router-link :to="navigateTo(category,'categoryPath')">
                                    <div class="classic-effect">
                                        <div>
                                            <img :src="category.image"  :alt="category.categoryName" width="100%" height="250" />
                                        </div>
                                        <span></span>
                                    </div>
                                </router-link>
                                <div class="blog-details">
                                    <router-link :to="navigateTo(category,'categoryPath')">
                                        <p>{{ category.categoryName }}</p>
                                    </router-link>
                                </div>
                            </div>
                        </slide>
                        <template #addons>
                            <navigation />
                            <pagination />
                        </template>
                    </carousel>
                </div>
            </div>
        </section>
        <!-- Product slider end -->

        <!-- Paragraph-->
        <div class="title1 section-t-space">
            <h2 class="title-inner1">Brands</h2>
        </div>
        <!-- Paragraph end -->

        <!--  logo section -->
        <section class="section-b-space py-0">
            <div class="container">
                <div class="row">
                    <template v-if="isEmpty($data.brands) && $data.loading">
                        <div class="col-xl-3 col-6">
                            <div class="ssc">
                                <div class="ssc-wrapper">
                                    <div class="ssc-square mb"></div>                               
                                </div>
                            </div>    
                        </div>
                        <div class="col-xl-3 col-6">
                            <div class="ssc">
                                <div class="ssc-wrapper">
                                    <div class="ssc-square mb"></div>                               
                                </div>
                            </div>    
                        </div>
                        <div class="col-xl-3 col-6">
                            <div class="ssc">
                                <div class="ssc-wrapper">
                                    <div class="ssc-square mb"></div>                               
                                </div>
                            </div>    
                        </div>         
                        <div class="col-xl-3 col-6">
                            <div class="ssc">
                                <div class="ssc-wrapper">
                                    <div class="ssc-square mb"></div>                               
                                </div>
                            </div>    
                        </div>                             
                    </template>
                    <carousel  
                        v-show="!isEmpty($data.brands) && !$data.loading"
                        :settings="$data.settings.brands" 
                        :itemsToShow="3" 
                        :wrapAround="true" 
                        :transition="5000"
                        :breakpoints="$data.breakpoints.brands"
                        :autoplay="true"
                    >
                        <slide v-for="(brand,index) in $data.brands" :key="index">
                            <div class="carousel__item">
                                <a href="javascript::void"><img :src="brand.image" :alt="brand.name" width="450"></a>
                            </div>
                        </slide>
                    </carousel>               
                </div>
            </div>
        </section>
        <!--  logo section end-->

        <!-- Paragraph-->
        <div class="title1 section-t-space">
            <h2 class="title-inner1">Testimonials</h2>
        </div>
        <section class="section-b-space py-0">
            <div class="container">
                <div class="row">
                    <template v-if="isEmpty($data.testimonials) && $data.loading">
                        <div class="col-xl-3 col-6">
                            <div class="ssc">
                                <div class="ssc-wrapper">
                                    <div class="ssc-square mb"></div>                               
                                </div>
                            </div>    
                        </div>
                        <div class="col-xl-3 col-6">
                            <div class="ssc">
                                <div class="ssc-wrapper">
                                    <div class="ssc-square mb"></div>                               
                                </div>
                            </div>    
                        </div>
                        <div class="col-xl-3 col-6">
                            <div class="ssc">
                                <div class="ssc-wrapper">
                                    <div class="ssc-square mb"></div>                               
                                </div>
                            </div>    
                        </div>         
                        <div class="col-xl-3 col-6">
                            <div class="ssc">
                                <div class="ssc-wrapper">
                                    <div class="ssc-square mb"></div>                               
                                </div>
                            </div>    
                        </div>                             
                    </template>
                    <carousel  
                        v-show="isEmpty($data.testimonials) && !$data.loading"
                        :settings="$data.settings.testimonials" 
                        :itemsToShow="3" 
                        :wrapAround="true" 
                        :transition="5000"
                        :breakpoints="$data.breakpoints.testimonials"
                    >
                        <slide v-for="(testimonial,index) in dummyTestimonials" :key="index">
                            <div class="carousel__item">
                                <div class="media">
                                    <div class="media-body">
                                        <h4>{{ testimonial.name }} <span>( {{ testimonial.date  }} )</span></h4>
                                        <p>{{ testimonial.description }}</p>                    
                                    </div>
                                </div>              
                            </div>
                        </slide>
                    </carousel> 
                    <carousel  
                        v-if="!isEmpty($data.testimonials) && !$data.loading"
                        :settings="$data.settings.testimonials" 
                        :itemsToShow="3" 
                        :wrapAround="true" 
                        :transition="10000"
                        :breakpoints="$data.breakpoints.testimonials"
                    >
                        <slide v-for="(testimonial,index) in $data.testimonials" :key="index">
                            <div class="carousel__item">
                                <div class="media">
                                    <div class="media-body">
                                        <h6>{{ testimonial.name }} <span>( {{ testimonial.created_at  }} )</span></h6>
                                        <p>{{ testimonial.description }}</p>                    
                                    </div>
                                </div>              
                            </div>
                        </slide>
                    </carousel>               
                </div>
            </div>
        </section>
        <!-- Paragraph end -->    
    </div>
</template>
<script setup>
import { computed, inject, nextTick, onBeforeMount, onMounted, reactive, watch } from 'vue';
import { cloneDeep, debounce, isEmpty } from 'lodash';
import { useStore } from 'vuex';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import moment from 'moment';

const $api   = inject('$api');
const $store = useStore();
const $data  = reactive({ 
    categories:   Array(), 
    brands:       Array(), 
    banners:      Array(),
    loading:      Boolean(true),
    testimonials: Array(),
    breakpoints: {
        brands: {
            720: {
                itemsToShow: 4,
                snapAlign: 'center',
            },
            // 1024 and up
            1920: {
                itemsToShow: 5,
                snapAlign: 'start',
            },
        },
        categories: {
            720: {
                itemsToShow: 4,
                snapAlign: 'center',
            },
            // 1024 and up
            1920: {
                itemsToShow: 5,
                snapAlign: 'start',
            },
        },
        testimonials: {
            720: {
                itemsToShow: 4,
                snapAlign: 'center',
            },
            // 1024 and up
            1920: {
                itemsToShow: 5,
                snapAlign: 'start',
            },
        }
    },
    settings: {
        banners: {
            itemsToShow: 2,
            snapAlign: 'center',
        },
        brands: {
            itemsToShow: 1,
            snapAlign: 'center',
        },
        categories: {
            itemsToShow: 1,
            snapAlign: 'center',
        },
        testimonials: {
            itemsToShow: 1,
            snapAlign: 'center',
        }
    }
});

const dummyTestimonials = computed( () => Array(
    {
        date:        moment().subtract(1,'day').format('Do MMMM, Y'),
        name:        'Lucas Doe',
        description: `Donec rhoncus massa quis nibh imperdiet dictum. Vestibulum id est sit amet felis
                        fringilla bibendum at at leo. Proin molestie ac nisi eu laoreet. Integer
                        faucibus enim nec ullamcorper tempor. Aenean nec felis dui. Integer tristique
                        odio mi, in volutpat metus posuere eu. Aenean suscipit ipsum nunc, id volutpat
                        lorem hendrerit ac. Sed id elit quam. In ac mauris arcu. Praesent eget lectus
                        sit amet diam vestibulum varius. Suspendisse dignissim mattis leo, nec facilisis
                        erat tempor quis. Vestibulum eu vestibulum ex.`
    },
    {
        date:        moment().subtract(2,'day').format('Do MMMM, Y'),
        name:        'Mark Masai',
        description: `Donec rhoncus massa quis nibh imperdiet dictum. Vestibulum id est sit amet felis
                        fringilla bibendum at at leo. Proin molestie ac nisi eu laoreet. Integer
                        faucibus enim nec ullamcorper tempor. Aenean nec felis dui. Integer tristique
                        odio mi, in volutpat metus posuere eu. Aenean suscipit ipsum nunc, id volutpat
                        lorem hendrerit ac. Sed id elit quam. In ac mauris arcu. Praesent eget lectus
                        sit amet diam vestibulum varius. Suspendisse dignissim mattis leo, nec facilisis
                        erat tempor quis. Vestibulum eu vestibulum ex.`
    },
    {
        date:        moment().subtract(3,'day').format('Do MMMM, Y'),
        name:        'Jane Foster',
        description: `Donec rhoncus massa quis nibh imperdiet dictum. Vestibulum id est sit amet felis
                        fringilla bibendum at at leo. Proin molestie ac nisi eu laoreet. Integer
                        faucibus enim nec ullamcorper tempor. Aenean nec felis dui. Integer tristique
                        odio mi, in volutpat metus posuere eu. Aenean suscipit ipsum nunc, id volutpat
                        lorem hendrerit ac. Sed id elit quam. In ac mauris arcu. Praesent eget lectus
                        sit amet diam vestibulum varius. Suspendisse dignissim mattis leo, nec facilisis
                        erat tempor quis. Vestibulum eu vestibulum ex.`
    },
    {
        date:        moment().subtract(4,'day').format('Do MMMM, Y'),
        name:        'Dean Sean',
        description: `Donec rhoncus massa quis nibh imperdiet dictum. Vestibulum id est sit amet felis
                        fringilla bibendum at at leo. Proin molestie ac nisi eu laoreet. Integer
                        faucibus enim nec ullamcorper tempor. Aenean nec felis dui. Integer tristique
                        odio mi, in volutpat metus posuere eu. Aenean suscipit ipsum nunc, id volutpat
                        lorem hendrerit ac. Sed id elit quam. In ac mauris arcu. Praesent eget lectus
                        sit amet diam vestibulum varius. Suspendisse dignissim mattis leo, nec facilisis
                        erat tempor quis. Vestibulum eu vestibulum ex.`
    },
));

/**
 * Fetches the home data from the API and updates the component's data.
 *
 * @return {Promise} A promise that resolves when the data is fetched and the component's data is updated.
 */
const fetch = async () => {
    try {
        // Fetch data from API
        const { data: { brands, categories, banners } } = await $api.get('/home');

        // Update component's data
        $data.brands     = cloneDeep(brands);
        $data.categories = cloneDeep(categories);
        $data.banners    = cloneDeep(banners);  

    } catch (error) {
        // Handle error
        $data.loading = false;
    } finally {
        $data.loading = false;
    }
};

/**
 * Generates a route object for navigating to the 'Products' view
 * with the category parameter set to the base64 encoded lowercase 
 * value of the specified item's key
 *
 * @param {Object} item - The item object containing the key
 * @param {string} key - The key to use for generating the category parameter
 * @return {Object} - The route object for navigating to the 'Products' view
 */
const navigateTo = (item,key) => {
    // Generate the base64 encoded lowercase value of the specified item's key
    const category = btoa(item[key].toLowerCase());

    // Generate and return the route object for navigating to the 'Products' view
    return { name: 'Products', params: { category } };
}

onBeforeMount( () => fetch() );

// watch(
//     () => $data.banners,
//     (banners) =>{
//         nextTick( () => {
//             if( !isEmpty(banners) && !$data.loading ){
//                 $(document).ready( () => {
//                     $('.home-slider').slick({
//                         infinite: true,
//                         speed: 300,
//                         slidesToShow: 1,
//                     });
//                 });
//             }
//         });
//     },
//     {
//         deep: true
//     }
// )

</script>