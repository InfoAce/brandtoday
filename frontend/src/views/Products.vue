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
                        <div class="col-12 px-0 mb-4 position-sticky">
                            <div class="card">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-3 col-xs-12">
                                            <label>Include Clearance Items</label> 
                                            <VueToggles v-model="$data.filter.clearance" checkedText="Yes" uncheckedText="No" checkedBg="#7e1414" />
                                        </div>
                                        <div class="col col-xs-12">
                                            <label>Search Name</label>
                                            <input class="form-control" v-model="$data.filter.name" placeholder="Search Name"/>
                                        </div>
                                        <div class="col col-xs-12 d-flex flex-column">
                                            <label>View Filters</label>
                                            <a arial-caret="true" data-toggle="collapse" data-target="#filterDropdown" aria-expanded="false" aria-controls="filterDropdown" class="form-control d-flex justify-content-between w-100">
                                                <span>Filter</span>
                                                <i class="fa fa-chevron-down"></i>
                                            </a>
                                        </div>
                                        <div class="col col-xs-12">
                                            <label>Sort Pricing</label>
                                            <select class="form-control" placeholder="Sort Pricing" v-model="$data.filter.sort_pricing">
                                                <option value="asc">Ascending</option>
                                                <option value="desc">Descending</option>
                                            </select>
                                        </div>
                                        <div class="col col-xs-12">
                                            <label>Per Page</label>
                                            <select class="form-control" placeholder="Per Page" v-model.number="$data.filter.per_page">
                                                <option value="10">10 Per Page</option>
                                                <option value="25">25 Per Page</option>
                                                <option value="50">50 Per Page</option>
                                                <option value="100">100 Per Page</option>
                                            </select>
                                        </div>
                                        <div class="col-12 mt-4">
                                            <h4>
                                                Filters:
                                                <span class="badge badge-primary mx-2" v-if="!isEmpty(filter_brands)">{{ filter_brandss.join(', ') }}</span>
                                                <span class="badge badge-primary mx-2" v-if="!isEmpty(filter_child_sub_categories)">{{ filter_child_sub_categories.join(', ') }}</span>
                                                <span class="badge badge-primary mx-2" v-if="isEmpty(filter_brands) && isEmpty(filter_child_sub_categories)">No Filters</span>
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>  
                            <div class="row mt-2">
                                <div class="col">
                                    <div class="collapse multi-collapse" id="filterDropdown">
                                        <div class="card card-body">
                                            <div class="row">
                                                <div class="col-12">
                                                    <h3>Brands</h3>
                                                    <div class="d-flex flex-wrap">
                                                        <template v-for="(brand,index) in $data.brands" :key="`${brand.id}_${index}`">
                                                            <div class="form-group text-nowrap mb-0 mr-3">
                                                                <input type="checkbox" :name="brand.id" :value="brand.code" v-model="$data.form.brands" />
                                                                {{ brand.name }}
                                                            </div>
                                                        </template>
                                                    </div>
                                                </div>
                                                <div class="col-12 mt-4">
                                                    <h3>Product Categories</h3>
                                                    <div class="d-flex flex-wrap">
                                                        <template v-for="(category,index) in $data.child_sub_categories" :key="`${category.id}_${index}`">
                                                            <div class="form-group text-nowrap mb-0 mr-3">
                                                                <input type="checkbox" :name="category.id" :value="category.code" v-model="$data.form.child_sub_categories" />
                                                                {{ category.name }}
                                                            </div>
                                                        </template>
                                                    </div>
                                                </div>
                                                <div class="col-12 mt-4">
                                                    <h3>Price Range</h3>
                                                    <VueSlider 
                                                        v-model="$data.form.price" 
                                                        :min="slider_options.min" 
                                                        :max="slider_options.max" 
                                                        :processStyle="slider_options.processStyle"
                                                        :tooltip="slider_options.tooltip"
                                                    />
                                                </div>
                                                <div class="col-md-12 d-flex justify-content-between mt-2">
                                                    <button class="btn btn-solid btn-sm" data-toggle="collapse" data-target="#filterDropdown" aria-expanded="false" aria-controls="filterDropdown" @click="fetchProducts(false)">Apply</button>
                                                    <button class="btn btn-solid btn-sm mx-2" data-toggle="collapse" data-target="#filterDropdown" aria-expanded="false" aria-controls="filterDropdown" @click="clearFilters">Clear Filter</button>
                                                    <button class="btn btn-solid btn-sm" data-toggle="collapse" data-target="#filterDropdown" aria-expanded="false" aria-controls="filterDropdown">Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>                                                      
                        </div>        
                        <div class="col px-0 collection-product-wrapper">
                            <div class="product-wrapper-grid">
                                <div class="col-12 px-0" v-if="isEmpty($data.products) && !$store.getters.loaders.card">
                                    <div class="card">
                                        <div class="card-body text-center">
                                            <h2 class="text-theme m-0">
                                                <i class="fa fa-exclamation-circle"></i>
                                                No product found here!
                                            </h2>
                                        </div>
                                    </div>
                                </div>
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
                                                        <h6 class="m-0 p-0">Stock: {{ product.stock }}</h6>
                                                        <ul class="color-variant p-0" v-if="!isEmpty(product.colour_images) && !isNull(product.colour_images)">
                                                            <li 
                                                                v-for="(colour,index) in product.colour_images" 
                                                                :key="index" 
                                                                :style="`border: 1px solid #cdcdcd; background: ${ colour.hex.length > 1 ? `linear-gradient(to right, ${colour.hex.map( hex => `${hex} ${100/colour.hex.length}%` ).join(',')} )`: colour.hex.map( hex => `${hex}` ).join(',') }`"
                                                            ></li>
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
import { cloneDeep, debounce, first, isEmpty, isNull, intersectionBy, get } from 'lodash';
import { CardLoader, PlaceholderLoader, PlaceholderText } from '../components';
import VueSlider from "vue-3-slider-component";
import { computed, inject, reactive, onBeforeMount, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import VueToggles from "vue-toggles";

const $api    = inject('$api');
const $toast  = inject('$toast');
const $store  = useStore();
const $route  = useRoute();
const $router = useRouter();
const $data   = reactive({
    category:             Object(),
    child_sub_categories: Array(),
    filter:{
        clearance:          Boolean(),
        page:               Number(1),
        per_page:           Number(10),
        name:               String(),
        sort_pricing:       String('asc'),
    },
    form: {
        brands:       ref(Array()),
        price:        Array(1,20000),
        child_sub_categories: ref(Array()),
    },
    products:           Array(),
    loading:            Boolean(),
    brands:             Array(),
    colours:            Array(),
    sub_category:       Object(),
    sub_child_category: String()
});
const currency = computed( () => $store.getters.home.company.currency );
const slider_options = computed( 
    () => ({
        tooltip:      "always",
        processStyle: { backgroundColor: "#7e1414" },
        min: 1,
        max: 20000
    }) 
);

const filter_brands = computed(() => intersectionBy($data.brands,$data.form.brands,'code'));

const filter_child_sub_categories = computed(() => intersectionBy($data.child_sub_categories,$data.form.child_sub_categories,'code').map( item => item.name ));

const fetchFilters = async() =>{
    try {
        $data.loading = Boolean(true);

        let { query, params } = $route;

        // Make API call to get brands
        const { data: { brands } }  = await $api.get('/products/brands');
        const { data: { colours } } = await $api.get('/products/colours');

        // Make API call to get category and sub category
        const { data:{ category, sub_category, products_count, child_sub_categories } } = await $api.get(`/categories/${params.category}/${params.sub_category}`);
        
        /**
         * Clones the brands object and assigns it to the $data.brands property.
         * @type {Object}
         */
        $data.brands   = cloneDeep(brands);

        $data.child_sub_categories = cloneDeep(child_sub_categories);

        /**
         * Clones the brands object and assigns it to the $data.brands property.
         * @type {Object}
         */
        $data.colours  = cloneDeep(colours);   
        
        if( !isEmpty(params) ){

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

            document.querySelector('title').innerHTML = `Products | ${category.name} - ${sub_category.name} | ${$store.getters.env.VITE_APP_NAME}`;

            document.querySelector('meta[name="keywords"]')
                    .setAttribute(
                        'content',
                        `${document.querySelector('meta[name="keywords"]').attributes.content.value}, ${category.name}, ${category.code}, ${sub_category.name}, ${sub_category.code}`
                    );

        }
        $data.loading  = Boolean();
        
    } catch(error) {
        $data.loading        = Boolean();
        $toast.error('Something went wrong with fetching filters.')
    } finally {
        $data.loading        = Boolean();
    }
};

/**
 * Clears all the filters and refetches the products
 */
const clearFilters = () => {
    /**
     * Resets the selected brands to an empty array
     * @type {Array}
     */
    $data.form.brands = [];
    
    /**
     * Resets the price filter to its default value
     * @type {Array}
     */
    $data.form.price  = [1,20000];

    /**
     * Refetches the products after clearing the filters
     * @function fetchProducts
     */
    fetchProducts();
}

/**
 * Fetch products based on the provided data
 * @peram {Object} data - Object containing page, perPage, sub_category, and overwrite options
 */
const fetchProducts = async (append = false) => {

    // Destructuring assignment for easier access
    let { query, params } = $route;
    let { filter: { per_page, page, options, name, sort_pricing, clearance } } = $data;
    let url        = `/products`;
    
    if( !isEmpty(params) ){
        url += `?category_code=${params.category}&sub_category_code=${params.sub_category}&page=${page}&perPage=${per_page}`
    }

    if( !isEmpty(query) ){
        url += `?name=${query.name}&page=${page}&perPage=${per_page}`;
    }
    
    if( !isEmpty(name) ){
        url += `&name=${name}`;
    }

    if( !isEmpty(sort_pricing) ){
        url += `&sort_pricing=${sort_pricing}`;
    }

    if( clearance ){
        url += `&clearance=${clearance}`;
    }
    

    $store.commit('card_loader',true);
    
    try {
        // Make API call to get products
        const { data: { products, products_count } } = await $api.put(url,$data.form);
        
        if( isEmpty(products) ){
            $data.products.splice(0)
        }

        if( !isEmpty(products) ){

            if( append ){
                $data.products = $data.products.concat(products);
            }

            if( !append ){
                $data.products = cloneDeep(products);
            }   
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

/**
 * Selects a sub child category based on the provided category object.
 * @param {Object} category - The category object to select.
 * @returns {void} - Nothing.
 */
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
    () => $data.filter.per_page,
    () => {
        $store.commit('card_loader',true);
        $data.filter.page = 1;
        fetchProducts();
    }
)

watch(
    () => $data.filter.sort_pricing,
    () => {
        $store.commit('card_loader',true);
        $data.filter.page = 1;
        fetchProducts();
    }
)

watch(
    () => $data.filter.name,
    debounce(() => {
        $store.commit('card_loader',true);
        $data.filter.page = 1;
        fetchProducts();
    },1000)
);

watch(
    () => $data.filter.clearance,
    debounce(() => {
        $store.commit('card_loader',true);
        $data.filter.page = 1;
        fetchProducts();
    },1000)
);

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
            options:     {
                brand:        String(),
                price:        Array(0,500),
            },
            name:         String(),
            sort_pricing: String('descending'),
        };


        // Fetch the data based on the updated route perameters.
        fetchFilters();
        fetchProducts();
    },
    {
        deep: true
    }
)
</script>