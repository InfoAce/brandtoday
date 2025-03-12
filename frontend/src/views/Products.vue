<template>
    <Layout>
        <template #breadcrumb>
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
        </template>

        <!-- section start -->
        <section class="pt-4 ratio_asos" ref="products">
            <div class="collection-wrapper">
                <div class="container-fluid">
                    <div class="row px-4">  
                        <div class="col-12 px-0">
                            <ul class="nav nav-tabs nav-material" id="top-tab" role="tablist">
                                <li class="nav-item">
                                    <a :class="`nav-link ${ $data.tab == 1 ? 'active' : '' }`" id="products" data-bs-toggle="tab" href="#products" role="tab" aria-selected="true" @click.prevent="$data.tab = 1">
                                        <i class="fas fa-border-all"></i>
                                        Products
                                    </a>
                                    <div class="material-border"></div>
                                </li>
                                <li class="nav-item" v-if="!isEmpty($data.child_sub_categories)">
                                    <a :class="`nav-link ${ $data.tab == 2 ? 'active' : '' }`" id="categories" data-bs-toggle="tab" href="#categories" role="tab" aria-selected="false" @click.prevent="$data.tab = 2">
                                        <i class="fa fa-list"></i>                                    
                                        Categories
                                    </a>
                                    <div class="material-border"></div>
                                </li>
                                <li class="nav-item" v-if="!isEmpty($data.brands)">
                                    <a :class="`nav-link ${ $data.tab == 3 ? 'active' : '' }`" id="categories" data-bs-toggle="tab" href="#brands" role="tab" aria-selected="false" @click.prevent="$data.tab = 3">
                                        <i class="fas fa-grip-vertical"></i>
                                        Brands
                                    </a>
                                    <div class="material-border"></div>
                                </li>
                            </ul>
                            <div class="tab-content nav-material" id="top-tabContent">
                                <div :class="`tab-pane fade col-12 ${ $data.tab == 1 ? 'show active' : '' } py-4`" id="products" role="tabpanel" aria-labelledby="products-tab">
                                    <div class="row">
                                        <div class="col-lg-3 col-md-12 col-xs-12 px-0">
                                            <ProductFilters
                                                :filters="$data.filter"
                                                :form="$data.form"
                                                @update:filters="$data.filters = $event"
                                                @update:form="$data.form = $event"
                                            />
                                        </div>
                                        <div class="col-lg-9 colcol-xs-12 collection-product-wrapper" style="overflow-y: scroll;">
                                            <div class="row px-2 vh-100">
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
                                                <div class="row">                                        
                                                    <Product 
                                                        :data="product"
                                                        @show="viewProduct"
                                                        v-for="(product,index) in $data.products"
                                                        :key="index"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>                        
                                <div :class="`tab-pane fade ${ $data.tab == 2 ? 'show active' : '' } py-4`" id="categories" role="tabpanel" aria-labelledby="categories-tab" v-if="!isEmpty($data.child_sub_categories)">
                                    <PlaceholderLoader v-if="isEmpty($data.child_sub_categories) && $data.loaders.categories" :count="10"/>                        
                                    <div class="row" v-else>
                                        <Category
                                            :key="`category_${index}`"
                                            :data="category"
                                            @show="viewCategory"
                                            v-for="(category,index) in $data.child_sub_categories"
                                        />
                                    </div>
                                </div>
                                <div :class="`tab-pane fade ${ $data.tab == 3 ? 'show active' : '' } py-4`" id="brands" role="tabpanel" aria-labelledby="brands-tab" v-if="!isEmpty($data.brands)">
                                    <PlaceholderLoader v-if="isEmpty($data.brands) && $data.loaders.brands" :count="10"/>                        
                                    <div class="row" v-else>
                                        <Brand
                                            :key="`brand_${index}`"
                                            :data="brand"
                                            @show="viewBrand"
                                            v-for="(brand,index) in $data.brands"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>         
                    </div>
                </div>
            </div>
        </section>
        <!-- section End -->        
    </Layout>
</template>
<script setup lang="ts">
import { cloneDeep, debounce, first, isEmpty, isNull, intersectionBy, get, uniq, has} from 'lodash';
import { Brand, Category, CardLoader, Layout, Product, ProductFilters, PlaceholderLoader, PlaceholderText } from '../components';
import { computed, inject, reactive, onBeforeMount, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const $api:    any = inject('$api');
const $toast:  any = inject('$toast');
const $store:  any = useStore();
const $route:  any = useRoute();
const $router: any = useRouter();
const $data:   any = reactive({
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
    tab:                Number(1),
    products:           Array(),
    loaders:            {
        brands:     false,
        categories: false
    },
    loading:            Boolean(),
    brands:             Array(),
    colours:            Array(),
    sub_category:       Object(),
    sub_child_category: String()
});

// const selected_brands = computed( () => cloneDeep($data.form.brands).map( val => ({ code: val })) );
// const filter_brands   = computed( () => intersectionBy($data.brands,selected_brands.value,'code').map( item => item.name ));

// const selected_child_sub_categories = computed( () => cloneDeep($data.form.child_sub_categories).map( val => ({ code: val })) );
// const filter_child_sub_categories   = computed( () => intersectionBy($data.child_sub_categories,selected_child_sub_categories.value,'code').map( item => item.name ));

const fetchFilters = async() =>{
    try {
        $data.loading = Boolean(true);

        let { query, params } = $route;

        // Make API call to get brands
        const { data: { colours } } = await $api.get('/products/colours');

        /**
         * Clones the brands object and assigns it to the $data.brands property.
         * @type {Object}
         */
        $data.colours  = cloneDeep(colours);   
        
        if( !isEmpty(params) ){

            // Make API call to get category and sub category
            const { data:{ category, sub_category, child_sub_categories } } = await $api.get(`/categories/${params.category}/${params.sub_category}`);
            
            $data.child_sub_categories = cloneDeep(child_sub_categories);

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

            document.querySelector('title').innerHTML = `Products | ${category.name} - ${sub_category.name} | ${$store.getters.env.VITE_APP_NAME}`;

            document.querySelector('meta[name="keywords"]')
                    .setAttribute(
                        'content',
                        `${document.querySelector('meta[name="keywords"]').attributes.content.value}, ${category.name}, ${category.code}, ${sub_category.name}, ${sub_category.code}`
                    );

        }

        if( !isEmpty(query) ){

            document.querySelector('title').innerHTML = `Products | ${$store.getters.env.VITE_APP_NAME}`;
            document.querySelector('meta[name="keywords"]')
                    .setAttribute(
                        'content',
                        `${document.querySelector('meta[name="keywords"]').attributes.content.value}, Search ${$store.getters.env.VITE_APP_NAME} Products`
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
     * Resets the selected brands to an empty array
     * @type {Array}
     */
     $data.form.child_sub_categories= [];    
    
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
const fetchProducts = async (append = false): Promise<void> => {

    // Destructuring assignment for easier access
    let { query, params } = $route;
    let { filter: { per_page, page, options, name, sort_pricing, clearance } } = $data;
    let url        = `/products`;
    
    if( !isEmpty(params) ){
        url += `?category_code=${params.category}&sub_category_code=${params.sub_category}&page=${page}&perPage=${per_page}`
    }

    if( !isEmpty(query) ){
        url += !isEmpty(params) ? `&page=${page}&perPage=${per_page}` : `?page=${page}&perPage=${per_page}`;
        // check if brand has been selected
        if( has(query,'name') ){
            url += `&name=${query.name}`;
        }        
        // check if brand has been selected
        if( has(query,'brand') ){
            url += `&brand=${query.brand}`;
        }
        // Check if category has been selected
        if( has(query,'category') ){
            url += `&child_sub_category_code=${query.category}`;
        }
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

/**
 * Fetches brands based on the provided data
 * @returns {Promise<void>}
 */
const fetchBrands = async (): Promise<void> => {
    if( !isEmpty($data.products) && !isEmpty($route.params) ){
        try {
            // Show the loader for brands
            $data.loaders.brands       = true;

            // Get the query and params from the route
            const { query, params }    = $route;

            // Get the unique brands from the products
            const unique_brands        = uniq(cloneDeep($data.products).map( (product:any) => product.brand )).filter( (brand:any) => !isNull(brand) );

            let data: any               = { brands: unique_brands, with_products: true, categorized: !isEmpty(params) };

            if( !isEmpty(params) ){
                data = { ...data, category: params.category, sub_category: params.sub_category }
            }

            // Make API call to get brands with products
            const { data: { brands } } = await $api.put('/products/brands',data);

            // Clone the brands and assign it to the data
            $data.brands               = cloneDeep(brands)

        } catch(error){
            // Hide the loader for brands
            $data.loaders.brands       = false;
        } finally {
            // Hide the loader for brands
            $data.loaders.brands       = false;
        }
    }
}

/**
 * Handles the click event of the view category button.
 * 
 * @param {Object} category - The category object.
 * @returns {void} - Nothing.
 */
const viewCategory = ({ code }: any) => {
    /**
     * Logs the category object to the console
     */
     $router.push({ 
        name: 'Products', 
        params: { 
            category: $route.params.category, 
            sub_category: $route.params.sub_category 
        }, 
        query: { 
            category: code 
        } 
    });
}

/**
 * Handles the click event of the view brand button.
 * 
 * @param {Object} brand - The brand object.
 * 
 * @returns {void} - Nothing.
 */
const viewBrand = ({ code }: any) => {
    /**
     * Logs the brand object to the console
     */
    $router.push({ 
        name:   !isEmpty($route.params) ? 'Products' : 'ViewProducts', 
        params: !isEmpty($route.params) ? $route.params: {}, 
        query:  { ...$route.query, brand: code } 
    });
}

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

onBeforeMount(
    async () => { 
        $data.loading = true;
        $store.commit('card_loader',true);
        await fetchFilters();
        await fetchProducts();
        await fetchBrands();
        $data.tab     = 1;
    }
);

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
    () => $data.form,
    debounce( 
        async() => {
            $store.commit('card_loader',true);
            $data.filter.page = 1;
            await fetchProducts();
        },
        1000
    ),
    {
        deep: true
    }
)

watch(
    () => $route,
    async () => {
        $store.commit('card_loader',true);

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

        $data.tab           = 1;

        // Fetch the data based on the updated route perameters.
        await fetchFilters();
        await fetchProducts();
        await fetchBrands();

    },
    {
        deep: true
    }
)
</script>