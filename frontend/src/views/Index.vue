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
                :autoplay="5000" :wrap-around="false"
                class="p-0"
                :settings="$data.settings.banners" 
            >
                <slide v-for="(image,index) in $data.banners" :key="index" > 
                    <img :src="`${$store.getters.assetsUrl}${image.path}`" class="" width="100%"/>
                </slide>
                <template #addons>
                    <pagination />
                </template>
            </carousel>        
        </section>
        <!-- Home slider end -->

                <!-- Paragraph-->
                <div class="title1 section-t-space">
            <h2>What Our Clients Say About Us</h2>
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
                            <div class="col p-4">
                                <div class="rating">
                                    <i class="fa fa-star"></i> 
                                    <i class="fa fa-star"></i> 
                                    <i class="fa fa-star"></i> 
                                    <i class="fa fa-star"></i> 
                                    <i class="fa fa-star"></i>
                                </div>
                                <h6>{{ testimonial.description }}</h6>
                            </div>
                            <!-- <div class="carousel__item">
                                <div class="media">
                                    <div class="media-body">
                                        <h4>{{ testimonial.name }} <span>( {{ testimonial.date  }} )</span></h4>
                                        <p>{{ testimonial.description }}</p>                    
                                    </div>
                                </div>              
                            </div> -->
                        </slide>
                    </carousel>              
                </div>
            </div>
        </section>
        <!-- Paragraph end -->  

        <!-- Paragraph-->
        <div class="title1 section-t-space">
            <h2>View products by category</h2>
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
                <div class="row px-2">
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
                        :wrapAround="true" 
                        :breakpoints="$data.breakpoints.categories"
                        :autoplay="5000"
                    >
                        <slide class="col-md-4" v-for="(category,index) in $data.categories" :key="index">
                            <div class="card m-2">
                                <div class="card-body">
                                    <img :src="category.image"  :alt="category.name" width="100%" style="object-fit: cover !important;"/>
                                    <div class="row">
                                        <div class="col p-4"><h5 class="m-0 text-theme text-center"><strong>{{ category.name }}</strong></h5></div>
                                    </div>
                                </div>
                            </div>
                        </slide>
                        <template #addons>
                            <pagination />
                        </template>
                    </carousel>
                </div>
            </div>
        </section>
        <!-- Product slider end -->

        <!-- Paragraph-->
        <div class="title1 section-t-space">
            <h2>Brands</h2>
        </div>
        <!-- Paragraph end -->

        <!--  logo section -->
        <section class="section-b-space py-0">
            <div class="container-fluid">
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
                        :autoplay="5000" :wrap-around="false"
                        class="p-0"
                        :settings="$data.settings.banners" 
                    >
                        <slide v-for="(image,index) in $data.brands" :key="index" > 
                            <img :src="`${$store.getters.assetsUrl}${image.path}`" class="" width="100%"/>
                        </slide>
                        <template #addons>
                            <pagination />
                        </template>
                    </carousel>                                    
                </div>
            </div>
        </section>
        <!--  logo section end-->

        <!-- Paragraph-->
        <div class="title1 section-t-space pb-3">
            <h2>Recommended For You</h2>
            <h5>Looking for the latest trends in clothing, shoes and accessories? <br> Welcome to our 'Latest Drops' edit, bringing you all the latest styles from all your favourite brands.</h5>
        </div>
        <!-- Paragraph end -->

        <section class="section-b-space py-0">
            <div class="container">
                <div class="row px-2">
                    <template v-if="isEmpty($data.recommended) && $data.loading">
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
                        v-show="!isEmpty($data.products) && !$data.loading" 
                        :settings="$data.settings.categories" 
                        :wrapAround="true" 
                        :breakpoints="$data.breakpoints.categories"
                        :autoplay="5000"
                    >
                        <slide class="col-md-4" v-for="(product,index) in $data.products" :key="index">
                            <div class="card m-2">
                                <div class="card-body p-2">
                                    <img :src="product.images[0].urls[0].url" width="100%" style="object-fit: cover !important;"/>
                                    <div class="row">
                                        <div class="col-12 py-2"><h6 class="m-0 text-theme"><strong>{{ product.name }}</strong></h6></div>
                                        <div class="col-12">
                                            <ul class="color-variant p-0" v-if="!isEmpty(product.colour_images) && !isNull(product.colour_images)">
                                                <li v-for="(colour,index) in product.colour_images.map( color => color.hex).flat()" :key="index" :style="`background-color: ${colour}; border: 1px solid #1c1c1c;`"></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="price-tag"><p class="m-0"><strong>{{ $store.getters.home.company.currency }}</strong> {{ first(get(first(product.variants),'price')).amount }}</p></div>
                                </div>
                            </div>
                        </slide>
                        <template #addons>
                            <pagination />
                        </template>
                    </carousel>            
                </div>
            </div>
        </section>
          
    </div>
</template>
<script setup>
import { computed, inject, nextTick, onBeforeMount, onMounted, reactive, watch } from 'vue';
import { cloneDeep, debounce, isEmpty, isNull, first,get} from 'lodash';
import { useStore } from 'vuex';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import moment from 'moment';
import { VueMarqueeSlider } from 'vue3-marquee-slider';
import '^/vue3-marquee-slider/dist/style.css'

const $api   = inject('$api');
const $store = useStore();
const $data  = reactive({ 
    categories:   Array(), 
    brands:       Array(), 
    banners:      Array(),
    products:     Array(),
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
            1080: {
                itemsToShow: 3,
                snapAlign: 'center',
            },
            // 1024 and up
            1920: {
                itemsToShow: 4,
                snapAlign: 'start',
            },
        },
        testimonials: {
            1080: {
                itemsToShow: 3,
                snapAlign: 'center',
            },
            // 1024 and up
            1920: {
                itemsToShow: 4,
                snapAlign: 'start',
            },
        }
    },
    settings: {
        banners: {
            itemsToShow: 1,
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
        description: `We are simply blown away and spoilt for choice by the variety of products Brand Today provides. We’ll keep buying from them.`
    },
    {
        description: `The gifts from Brand Today were the highlight for our end of year company event! We cannot wait for the next gifting season for the excellent delivery and customer Service!`
    },
    {
        description: `The quality is great and delivered on time! Brand Today knows how to keep us delighted!`
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
        const { data: { brands, categories, banners, products} } = await $api.get('/home');

        // Update component's data
        $data.brands     = cloneDeep(brands);
        $data.categories = cloneDeep(categories);
        $data.banners    = cloneDeep(banners);  
        $data.products    = cloneDeep(products);  

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
    // Generate and return the route object for navigating to the 'Products' view
    return { name: 'Category', params: { category: item[key] } };
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
<style>
.slide_image {
  min-height: 200px;
  width: 100%;
  background-color: var(--vc-clr-primary);
  color: var(--vc-clr-white);
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>