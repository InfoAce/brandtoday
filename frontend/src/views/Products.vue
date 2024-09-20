<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container-fluid">
                <div class="row px-4">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h2 class="text-theme">Products - {{ $data.products_count }}</h2>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <nav aria-label="breadcrumb" class="theme-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#" @click.prevent="$router.push({name:'Home'})">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page"><a href="#" @click.prevent="$router.push({name:'Category',query: { category: $data.category.id }})">{{ $data.category.name }}</a></li>
                                <li class="breadcrumb-item active" aria-current="page">{{ $data.sub_category.name }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <!-- breadcrumb end -->


        <!-- section start -->
        <section class="section-b-space ratio_asos" ref="products">
            <div class="collection-wrapper">
                <div class="container-fluid">
                    <div class="row px-4">     
                        <div class="col-sm-3 collection-filter">
                            <!-- side-bar colleps block stat -->
                            <div class="collection-filter-block" style="position: sticky; top:0;">
                                <!-- brand filter start -->
                                <div class="collection-mobile-back">
                                    <span class="filter-back">
                                        <i class="fa fa-angle-left" aria-hidden="true"></i> 
                                        back
                                    </span>
                                </div>
                                <div class="collection-collapse-block border-0 mb-0 pb-0">
                                    <h3 class="collapse-block-title">Search By Name</h3>
                                    <div class="form-group mt-2">
                                        <input type="text" class="form-control" id="name" placeholder="Name" v-model="$data.filter.name" required="">
                                    </div>
                                </div>
                                <!-- price filter start here -->
                                <div class="collection-collapse-block border-0 open">
                                    <h3 class="collapse-block-title">Price Range ( in {{ currency }} )</h3>
                                    <div class="col-12 px-2">
                                        <VueSlider v-model="$data.filter.price" min="0" max="5000" tooltip="hover" tooltipPlacement="left" :enableCross="true" :processStyle="processStyle" :tooltipStyle="tooltipStyle"/>
                                    </div>
                                </div>
                            </div>
                            <!-- silde-bar colleps block end here -->
                        </div>                
                        <div class="col collection-product-wrapper">
                            <div class="product-wrapper-grid">
                                <CardLoader v-if="!isEmpty($data.products)" />
                                <PlaceholderLoader v-if="isEmpty($data.products) && $store.getters.loaders.card" :count="10"/>                        
                                <div class="row" >
                                    <div class="col-xl-3 col-6 mb-4" v-for="(product,index) in $data.products" :key="index">
                                        <div class="product-box">
                                            <div class="img-wrapper">
                                                <div v-if="!isEmpty(product.images)">
                                                    <div class="front">
                                                        <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.id }})">
                                                            <img class="img-fluid blur-up lazyload bg-img" :src="product.images[0].urls[0].url" alt="">
                                                        </a>
                                                    </div>
                                                    <div class="back" v-if="product.images.length > 1">
                                                        <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.id }})">
                                                            <img :src="product.images[1].urls[0].url" class="img-fluid blur-up lazyload bg-img" alt="" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="product-detail">
                                                <div>
                                                    <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.fullCode }})">
                                                        <h6>{{ product.name }}</h6>
                                                    </a>
                                                    <p v-html="product.description"></p>
                                                    <h4>{{ currency }} {{ first(get(first(product.variants),'price')).amount }}</h4>
                                                    <ul class="color-variant p-0" v-if="!isEmpty(product.colour_images) && !isNull(product.colour_images)">
                                                        <li v-for="(colour,index) in product.colour_images.map( color => color.hex).flat()" :key="index" :style="`background-color: ${colour}; border: 1px solid #cdcdcd;`"></li>
                                                    </ul>
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
<script setup >

</script>
<script setup >
import { cloneDeep, debounce, first, get,isEmpty, isNull, has, times, toPlainObject } from 'lodash';
import { CardLoader, PlaceholderLoader, PlaceholderText } from '../components';
import VueSlider from "vue-3-slider-component";
import { computed, inject, reactive, onBeforeMount, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const $api    = inject('$api');
const $toast  = inject('$toast');
const $store  = useStore();
const $route  = useRoute();
const $data   = reactive({
    category:         Object(),
    filter:{
        page:         Number(1),
        per_page:     Number(10),
        price:        Array(0,500),
        sort_pricing: String('descending'),
        colour:       String()
    },
    products:           Array(),
    loading:            Boolean(),
    product_count:      Number(),
    brands:             Array(),
    colours:            Array(),
    sub_category:       Object(),
    sub_child_category: String()
});
const currency = computed( () => $store.getters.home.company.currency );

const fetchFilters = async() =>{
    try {
        $data.loading = Boolean(true);

        // Make API call to get brands
        const { data: { brands } }  = await $api.get('/products/brands');
        const { data: { colours } } = await $api.get('/products/colours');

        /**
         * Clones the brands object and assigns it to the $data.brands property.
         * @type {Object}
         */
        $data.brands   = cloneDeep(brands);

        /**
         * Clones the brands object and assigns it to the $data.brands property.
         * @type {Object}
         */
        $data.colours  = cloneDeep(colours);                
        $data.loading  = Boolean();
        
    } catch(error) {
        $data.loading        = Boolean();
        $toast.error('Something went wrong with fetching brands.')
    } finally {
        $data.loading        = Boolean();
    }
};

/**
 * Fetch products based on the provided data
 * @peram {Object} data - Object containing page, perPage, sub_category, and overwrite options
 */
const fetchProducts = async (append = false) => {

    // Destructuring assignment for easier access
    let { params } = $route;
    let { filter: { sort_pricing , per_page, page, price, name } } = $data;
    let url        = `/products/${params.category}/${params.sub_category}?page=${page}&perPage=${per_page}&sort_pricing=${sort_pricing}`;

    if( !isEmpty(name) ){
        url += `&name=${name}`;
    }

    if( price[0] != 0 || price[1] != 500 ){
        url += `&price_range=${price.join('~')}`;
    }

    $store.commit('card_loader',true);
    
    try {
        // Make API call to get products
        const { data:{ products, category, sub_category, products_count } } = await $api.get(url);
        /**
         * Clones the category object and assigns it to the this.category property.
         * @type {Object}
         */
        $data.category      = cloneDeep(category);

        /**
         * Clones the sub_category object and assigns it to the $data.sub_category property.
         * @type {Object}
         */
        $data.sub_category   = cloneDeep(sub_category);

        if( append ){
            $data.products = $data.products.concat(products);
        }
        if( !append ){
            $data.products = cloneDeep(products);
        }

        $data.products_count = products_count;
    } catch({ response }){
        $store.commit('card_loader',false);
        if( !isEmpty(response.data) && response.data.statusCode == 400 ){
            response.data.message.forEach( (value) => {
                toast.info(value);
            });
        }
    } finally{
        setTimeout(() => {
            $store.commit('card_loader',false); 
        },1000);
        $store.commit('loader',false);
    }            

};

const selectColour = (colour) => {
    $data.filter.colour = colour;
}

/**
 * Handles the click event of the load more button.
 * 
 * @param {Event} event - The event object.
 * @returns {void} - Nothing.
 */
const loadMore = (event) => { 
    
    // Increment the page number
    $data.filter.page = $data.filter.page + 1;

    // Show the card loader
    $store.commit('card_loader',true);

    // Fetch the products
    fetchProducts(true);

};


const selectSubCategory = (value,category) => {
    $data.sub_category = btoa(value.toLowerCase());
    $('div[data-perent="#sub_categories"].show').collapse('hide');
    $('input[name="sub_child_category"]').prop('checked',false);
    if( !isEmpty(category.children) ){
        $data.sub_child_category = String();
        $(`#${category.categoryName.toLowerCase().replaceAll(' ','')}`).collapse('show');
    }
};

const selectSubChildCategory = (category) => {
    $data.sub_child_category = btoa(category.categoryName.toLowerCase());
};

const showCollapsed = (event,category) => {
    event.preventDefault();
    $(`#${category.categoryName.toLowerCase().replaceAll(' ','')}`).collapse('show')
};

const openFilter = () => {
    $(".filter-bottom-content").slideToggle("");
}

onBeforeMount(fetchFilters(),fetchProducts());

onMounted(
    debounce(
        () => {
            /**
             * Window scroll event listener that triggers loading of products
             * when the user has scrolled to the bottom of the page and the
             * loader is not already active.
             */
            window.addEventListener(
                'scroll',
                debounce(
                    () =>{
                        const { scrollTop, clientHeight } = document.documentElement;
                        const { scrollHeight: targetHeight } = document.querySelector('.collection-wrapper')

                        if((clientHeight + scrollTop >= targetHeight ) && ($data.products_count > $data.products.length) && !$store.getters.loaders.card) {
                            loadMore();
                        }

                    },200
                )
            );      
        },2000
    )
)

watch(
    () => $data.filter.sort_pricing,
    () => {
        $store.commit('card_loader',true);
        fetchProducts({ page: 1, perPage: $data.filter.per_page, overwrite: true });
    }
)

watch(
    () => $data.filter.colour,
    () => {
        $store.commit('card_loader',true);
        fetchProducts();
    }
)

watch(
    () => $data.filter.name,
    debounce(() => {
        $store.commit('card_loader',true);
        fetchProducts();
    },500)
)

watch(
    () => $data.filter.price,
    debounce(() => {
        $store.commit('card_loader',true);
        fetchProducts();
    },500),
    {
        deep: true
    }
)

watch(
    () => $route.query,
    () => {
        // Set loading to true to indicate that data is being fetched.
        $data.loading = true;

        $data.products = {};

        // Commit a card_loader mutation to show the loader.
        $store.commit('loader',true);

        // Fetch the data based on the updated route perameters.
        fetchProducts();
    },
    {
        deep: true
    }
)
</script>