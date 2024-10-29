<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container-fluid">
                <div class="row px-4">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h4 class="text-theme">Products - {{ $data.products_count }}</h4>
                        </div>
                    </div>
                    <div class="col-sm-6" v-if="!isEmpty($data.category) && !isEmpty($data.sub_category)">
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
                        <div class="col px-0 collection-product-wrapper">
                            <div class="product-wrapper-grid">
                                <CardLoader v-if="!isEmpty($data.products)" />
                                <PlaceholderLoader v-if="isEmpty($data.products) && $store.getters.loaders.card" :count="10"/>                        
                                <div class="row" >
                                    <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4" v-for="(product,index) in $data.products" :key="index">
                                        <div class="card">
                                            <div class="card-body">
                                                <div class="product-box">
                                                    <div class="img-wrapper">
                                                        <div v-if="!isEmpty(product.images)">
                                                            <div class="front">
                                                                <a href="#" @click.prevent="viewProduct(product)">
                                                                    <img class="img-fluid blur-up lazyload bg-img" :src="product.images[0].urls[0].url" alt="">
                                                                </a>
                                                            </div>
                                                            <div class="back" v-if="product.images.length > 1">
                                                                <a href="#" @click.prevent="viewProduct(product)">
                                                                    <img :src="product.images[1].urls[0].url" class="img-fluid blur-up lazyload bg-img" alt="" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-12 px-0 pt-3 ">
                                                        <p class="text-wrap p-0 m-0 text-theme">{{ product.full_code }}</p>
                                                        <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.id }})" class="text-theme">
                                                            <h5 class="text-wrap p-0 m-0"> {{ product.name }} </h5>
                                                        </a>
                                                        <h6 class="m-0 p-0">{{ currency }} {{ product.price.toFixed(2) }}</h6>                                                    
                                                        <p class="m-0 p-0">Excl. VAT & Excl. Branding</p>
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
            </div>
        </section>
        <!-- section End -->        
    </div>
</template>
<script setup >

</script>
<script setup >
import { cloneDeep, debounce, first, isEmpty, isNull, get } from 'lodash';
import { CardLoader, PlaceholderLoader, PlaceholderText } from '../components';
import VueSlider from "vue-3-slider-component";
import { computed, inject, reactive, onBeforeMount, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const $api    = inject('$api');
const $toast  = inject('$toast');
const $store  = useStore();
const $route  = useRoute();
const $router = useRouter();
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
    let { query, params } = $route;
    let { filter: { sort_pricing , per_page, page, price, name } } = $data;
    let url        = `/products`;
    
    if( !isEmpty(params) ){

        url += `?category_code=${params.category}&sub_category_code=${params.sub_category}&page=${page}&perPage=${per_page}&sort_pricing=${sort_pricing}`
    }

    if( !isEmpty(query) ){
        url += `?name=${query.name}&page=${page}&perPage=${per_page}`;
    }
    
    if( !isEmpty(name) ){
        url += `&name=${name}`;
    }

    if( price[0] != 0 || price[1] != 500 ){
        url += `&price_range=${price.join('~')}`;
    }

    $store.commit('card_loader',true);
    
    try {
        if( !isEmpty(params) ){
            // Make API call to get category and sub category
            const { data:{ category, sub_category, products_count } } = await $api.get(`/categories/${params.category}/${params.sub_category}`);

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

            $data.products_count = products_count;

            document.querySelector('meta[name="keywords"]')
                    .setAttribute(
                        'content',
                        `${document.querySelector('meta[name="keywords"]').attributes.content.value}, ${category.name}, ${category.code}, ${sub_category.name}, ${sub_category.code}`
                    );
        }


        // Make API call to get products
        const { data } = await $api.get(url);
        
        if( append ){
            $data.products = $data.products.concat(data.products);
        }

        if( !append ){
            $data.products = cloneDeep(data.products);
        }

        if( !isEmpty(query) ){
            $data.products_count = data.products_count;
        }

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

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Selects a sub child category based on the provided category object.
 * @param {Object} category - The category object to select.
 * @returns {void} - Nothing.
 */
/******  6cb6fd7d-b553-4c82-a531-6430d184a89f  *******/const selectSubChildCategory = (category) => {
    $data.sub_child_category = btoa(category.categoryName.toLowerCase());
};

const showCollapsed = (event,category) => {
    event.preventDefault();
    $(`#${category.categoryName.toLowerCase().replaceAll(' ','')}`).collapse('show')
};

const openFilter = () => {
    $(".filter-bottom-content").slideToggle("");
}

const viewProduct = (product) => {
    window.removeEventListener('scroll', () => {});
    return $router.push({ name: 'Product', params: { product: product.full_code }});
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
        $data.filter.page = 1;
        fetchProducts();
    },500)
)

watch(
    () => $data.filter.price,
    debounce(() => {
        $store.commit('card_loader',true);
        $data.filter.page = 1;
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

        $data.products_count = 0;
        $data.products       = Array();

        // Commit a card_loader mutation to show the loader.
        $store.commit('loader',true);

        $data.filter = {
            page:         Number(1),
            per_page:     Number(10),
            price:        Array(0,500),
            sort_pricing: String('descending'),
            colour:       String()
        };

        // Fetch the data based on the updated route perameters.
        fetchProducts();
    },
    {
        deep: true
    }
)
</script>