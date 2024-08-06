<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container-fluid">
                <div class="row px-4">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h2 class="text-theme">Products - {{ products_count }}</h2>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <nav aria-label="breadcrumb" class="theme-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#" @click.prevent="$router.push({name:'Home'})">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page"><a href="#" @click.prevent="$router.push({name:'Category',query: { category: category.id }})">{{ category.name }}</a></li>
                                <li class="breadcrumb-item active" aria-current="page">{{ sub_category.name }}</li>
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
                        <div class="collection-content col-12">
                            <div class="page-main-content">
                                <div class="collection-product-wrapper">
                                    <div class="product-top-filter">
                                        <div class="row">
                                            <div class="col-12">
                                                <div class="product-filter-content">
                                                    <div class="search-count">
                                                        <h5 class="filter-bottom-title" @click="openFilter">filter-panel</h5>
                                                    </div>
                                                    <div class="collection-view">
                                                        <ul>
                                                            <li><i class="fa fa-th grid-layout-view"></i></li>
                                                            <li><i class="fa fa-list-ul list-layout-view"></i></li>
                                                        </ul>
                                                    </div>
                                                    <div class="product-page-per-view">
                                                        <select v-model="filter.per_page">
                                                            <option value="">Per Page</option>
                                                            <option value="10">10</option>
                                                            <option value="20">20</option>
                                                            <option value="50">50</option>
                                                            <option value="100">100</option>
                                                        </select>
                                                    </div>
                                                    <div class="product-page-filter">
                                                        <select v-model="filter.sort_pricing">
                                                            <option value="">Sorting by pricing</option>
                                                            <option value="descending">Lowest to Highest</option>
                                                            <option value="ascending">Highest to Lowest</option>
                                                        </select>
                                                    </div>
                                                </div>          
                                                <div class="collection-filter container-fluid top-filter filter-bottom-content">
                                                    <!-- side-bar colleps block stat -->
                                                    <div class="collection-filter-block row m-0">
                                                        <!-- brand filter start -->
                                                        <div class="collection-mobile-back col-12">
                                                            <span class="filter-back"><i class="fa fa-angle-left" aria-hidden="true"></i> back</span>
                                                        </div>
                                                        <div class="collection-collapse-block open col-lg-3">
                                                            <h3 class="collapse-block-title">brand</h3>
                                                            <div class="collection-collapse-block-content">
                                                            <div class="collection-brand-filter">
                                                                    <div class="form-check collection-filter-checkbox" v-for="(brand,index) in brands" :key="index">
                                                                        <input type="checkbox" class="form-check-input" :id="brand.name.toLowerCase()">
                                                                        <label class="form-check-label" for="zara">{{brand.name}}</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>                                                    
                                                        <!-- price filter start here -->
                                                        <div class="collection-collapse-block border-0 open col-lg-3">
                                                            <h3 class="collapse-block-title">price</h3>
                                                            <VueSlider v-model="price" min="0" max="10000" tooltip="hover" tooltipPlacement="left" :enableCross="true" :processStyle="processStyle" :tooltipStyle="tooltipStyle"/>
                                                        </div>
                                                        <div class="col-12">
                                                            <div class="text-end button_bottom">
                                                                <a href="javascript:void(0)"
                                                                    class="btn btn-solid btn-xs me-2">apply</a>
                                                                <a href="javascript:void(0)"
                                                                    class="btn btn-solid btn-xs close-filter-bottom">close
                                                                    filter</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!-- silde-bar colleps block end here -->
                                                </div>                                                                               
                                            </div>
                                        </div>
                                    </div>
                                    <div class="product-top-filter">
                                        <div class="row m-0 w-100">
                                            <div class="col-xl-4">
                                                <div class="filter-panel">
                                                    <h6 class="ldr-text"></h6>
                                                </div>
                                            </div>
                                            <div class="col-xl-4 col-lg-4 col-6">
                                                <div class="filter-panel">
                                                    <h6 class="ldr-text"></h6>
                                                </div>
                                            </div>
                                            <div class="col-xl-2 col-lg-4 col-6">
                                                <div class="filter-panel">
                                                    <h6 class="ldr-text"></h6>
                                                </div>
                                            </div>
                                            <div class="col-xl-2 col-lg-4 d-none d-lg-block">
                                                <div class="filter-panel">
                                                    <h6 class="ldr-text"></h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>                                
                                    <div class="product-wrapper-grid">
                                        <CardLoader v-if="!$isEmpty(products.data)" />
                                        <div class="row margin-res p-2" v-show="$isEmpty(products) && loading">
                                            <div class="col-xl-3 col-6 col-grid-box mt-4" >
                                                <div class="ssc ssc-card">
                                                    <div class="ssc-wrapper">
                                                        <div class="ssc-square mb"></div>
                                                        <div class="flex align-center justify-between">
                                                            <div class="w-40">
                                                                <div class="ssc-line w-70 mbs"></div>
                                                                <div class="ssc-line w-100 mbs"></div>
                                                            </div>
                                                            <div class="ssc-head-line w-50"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>   
                                            <div class="col-xl-3 col-6 col-grid-box mt-4" >
                                                <div class="ssc ssc-card">
                                                    <div class="ssc-wrapper">
                                                        <div class="ssc-square mb"></div>
                                                        <div class="flex align-center justify-between">
                                                            <div class="w-40">
                                                                <div class="ssc-line w-70 mbs"></div>
                                                                <div class="ssc-line w-100 mbs"></div>
                                                            </div>
                                                            <div class="ssc-head-line w-50"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>   
                                            <div class="col-xl-3 col-6 col-grid-box mt-4" >
                                                <div class="ssc ssc-card">
                                                    <div class="ssc-wrapper">
                                                        <div class="ssc-square mb"></div>
                                                        <div class="flex align-center justify-between">
                                                            <div class="w-40">
                                                                <div class="ssc-line w-70 mbs"></div>
                                                                <div class="ssc-line w-100 mbs"></div>
                                                            </div>
                                                            <div class="ssc-head-line w-50"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>   
                                            <div class="col-xl-3 col-6 col-grid-box mt-4" >
                                                <div class="ssc ssc-card">
                                                    <div class="ssc-wrapper">
                                                        <div class="ssc-square mb"></div>
                                                        <div class="flex align-center justify-between">
                                                            <div class="w-40">
                                                                <div class="ssc-line w-70 mbs"></div>
                                                                <div class="ssc-line w-100 mbs"></div>
                                                            </div>
                                                            <div class="ssc-head-line w-50"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>  
                                            
                                            <div class="col-xl-3 col-6 col-grid-box mt-4" >
                                                <div class="ssc ssc-card">
                                                    <div class="ssc-wrapper">
                                                        <div class="ssc-square mb"></div>
                                                        <div class="flex align-center justify-between">
                                                            <div class="w-40">
                                                                <div class="ssc-line w-70 mbs"></div>
                                                                <div class="ssc-line w-100 mbs"></div>
                                                            </div>
                                                            <div class="ssc-head-line w-50"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>   
                                            <div class="col-xl-3 col-6 col-grid-box mt-4" >
                                                <div class="ssc ssc-card">
                                                    <div class="ssc-wrapper">
                                                        <div class="ssc-square mb"></div>
                                                        <div class="flex align-center justify-between">
                                                            <div class="w-40">
                                                                <div class="ssc-line w-70 mbs"></div>
                                                                <div class="ssc-line w-100 mbs"></div>
                                                            </div>
                                                            <div class="ssc-head-line w-50"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>   
                                            <div class="col-xl-3 col-6 col-grid-box mt-4" >
                                                <div class="ssc ssc-card">
                                                    <div class="ssc-wrapper">
                                                        <div class="ssc-square mb"></div>
                                                        <div class="flex align-center justify-between">
                                                            <div class="w-40">
                                                                <div class="ssc-line w-70 mbs"></div>
                                                                <div class="ssc-line w-100 mbs"></div>
                                                            </div>
                                                            <div class="ssc-head-line w-50"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>   
                                            <div class="col-xl-3 col-6 col-grid-box mt-4" >
                                                <div class="ssc ssc-card">
                                                    <div class="ssc-wrapper">
                                                        <div class="ssc-square mb"></div>
                                                        <div class="flex align-center justify-between">
                                                            <div class="w-40">
                                                                <div class="ssc-line w-70 mbs"></div>
                                                                <div class="ssc-line w-100 mbs"></div>
                                                            </div>
                                                            <div class="ssc-head-line w-50"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-xl-3 col-6 col-grid-box mt-4" >
                                                <div class="ssc ssc-card">
                                                    <div class="ssc-wrapper">
                                                        <div class="ssc-square mb"></div>
                                                        <div class="flex align-center justify-between">
                                                            <div class="w-40">
                                                                <div class="ssc-line w-70 mbs"></div>
                                                                <div class="ssc-line w-100 mbs"></div>
                                                            </div>
                                                            <div class="ssc-head-line w-50"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>   
                                            <div class="col-xl-3 col-6 col-grid-box mt-4" >
                                                <div class="ssc ssc-card">
                                                    <div class="ssc-wrapper">
                                                        <div class="ssc-square mb"></div>
                                                        <div class="flex align-center justify-between">
                                                            <div class="w-40">
                                                                <div class="ssc-line w-70 mbs"></div>
                                                                <div class="ssc-line w-100 mbs"></div>
                                                            </div>
                                                            <div class="ssc-head-line w-50"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> 
                                            <div class="col-xl-3 col-6 col-grid-box mt-4" >
                                                <div class="ssc ssc-card">
                                                    <div class="ssc-wrapper">
                                                        <div class="ssc-square mb"></div>
                                                        <div class="flex align-center justify-between">
                                                            <div class="w-40">
                                                                <div class="ssc-line w-70 mbs"></div>
                                                                <div class="ssc-line w-100 mbs"></div>
                                                            </div>
                                                            <div class="ssc-head-line w-50"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> 
                                            <div class="col-xl-3 col-6 col-grid-box mt-4" >
                                                <div class="ssc ssc-card">
                                                    <div class="ssc-wrapper">
                                                        <div class="ssc-square mb"></div>
                                                        <div class="flex align-center justify-between">
                                                            <div class="w-40">
                                                                <div class="ssc-line w-70 mbs"></div>
                                                                <div class="ssc-line w-100 mbs"></div>
                                                            </div>
                                                            <div class="ssc-head-line w-50"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>                                                                                     
                                        </div>
                                        <div class="row margin-res" v-show="!$isEmpty(products) && !loading">
                                            <div class="col-xl-3 col-6 col-grid-box" v-for="(product,index) in products" :key="index">
                                                <div class="product-box">
                                                    <div class="img-wrapper">
                                                        <div v-if="!$isEmpty(product.images)">
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
                                                        <div class="cart-info cart-wrap">
                                                            <button data-bs-toggle="modal" data-bs-target="#addtocart" title="Add to cart">
                                                                <i class="ti-shopping-cart"></i>
                                                            </button> 
                                                            <a href="javascript:void(0)" title="Add to Wishlist">
                                                                <i class="ti-heart" aria-hidden="true"></i>
                                                            </a> 
                                                            <a href="#" data-bs-toggle="modal" :data-bs-target="`#${product.fullCode}`" title="Quick View">
                                                                <i class="ti-search" aria-hidden="true"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div class="product-detail">
                                                        <div>
                                                            <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.fullCode }})">
                                                                <h6>{{ product.name }}</h6>
                                                            </a>
                                                            <p v-html="product.description"></p>
                                                            <h4>KSH {{ product.price }}</h4>
                                                            <ul class="color-variant p-0" v-if="!$isEmpty(product.colour_images) && !$isNull(product.colour_images)">
                                                                <li v-for="(colour,index) in product.colour_images.map( color => color.hex).flat()" :key="index" :style="`background-color: ${colour}; border: 1px solid #cdcdcd;`"></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- <QuickView :data="product" /> -->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="load-more-sec">
                                        <a href="#" @click.prevent="loadMore($event)">
                                            <span v-if="$store.getters.loaders.card"><i class="fa fa-spinner fa-spin"></i></span>
                                            <span v-if="!$store.getters.loaders.card" id="text">Load More</span>
                                        </a>
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
<style scoped>
@import '/assets/home/css/vendors/price-range.css';
</style>
<script>
import { cloneDeep, isEmpty, isNull, has, times } from 'lodash';
import convertCssColorNameToHex from 'convert-css-color-name-to-hex';
import { CardLoader } from '../../components';
import VueSlider from "vue-3-slider-component";

export default {
    /**
     * This method is called before the route is entered.
     * It fetches the data required for the view.
     * 
     * @peram {Object} to - The destination route.
     * @peram {Object} from - The source route.
     * @peram {Function} next - The callback function to be called when the data is fetched.
     */
    beforeRouteEnter(to, from, next) {
        // Fetch the data required for the view
        next(vm => {
            vm.fetchProducts(),
            next(); // Call the next function to continue with the route change
        });
    },
    /**
     * This method is called when the route is updated.
     * It fetches the products required for the view.
     * 
     * @peram {Object} to - The destination route.
     * @peram {Object} from - The source route.
     * @peram {Function} next - The callback function to be called when the data is fetched.
     */
    beforeRouteUpdate(to, from, next){
        // Fetch the products required for the view
        next(vm => {
            vm.fetchProducts(),
            next(); // Call the next function to continue with the route change
        });
    },
    components:{
        CardLoader,
        VueSlider
    },

    computed: {
        processStyle(){
            return {
                backgroundColor: '#7e1414'
            }
        },
        tooltipStyle(){
            return {
                backgroundColor: '#7e1414',
                color: '#fff'
            }
        }
    },
    /**
     * Lifecycle hook called after the Vue instance is created
     */
    created(){
        this.$isNull  = isNull;
        this.$isEmpty = isEmpty;
        this.$times   = times;
        
        /**
         * Converts a CSS color name to its hexadecimal representation.
         *
         * @peram {string} colour - The CSS color name to be converted.
         * @return {string} The hexadecimal representation of the color.
         */
        this.$convertToHex = (colour) => {
            // Convert the color name to lowercase and remove any spaces.
            const formattedColour = colour.toLowerCase().split(' ').join("");
            
            // Convert the formatted color name to its hexadecimal representation.
            return convertCssColorNameToHex(formattedColour);
        }
    },
    
    /**
     * Data function to initialize component data
     *
     * @returns {Object} The initial data object
     */
    data(){
        return{
            category:         Object(),
            filter:{
                per_page:     String(10),
                sort_pricing: String('descending')
            },
            products:           Array(),
            loading:            Boolean(true),
            price:              Array(0,1000),
            product_count:      Number(),
            brands:             Array(),
            sub_category:       Object(),
            sub_child_category: String()
        }
    },
    methods:{
        /**
         * Fetch products based on the provided data
         * @peram {Object} data - Object containing page, perPage, sub_category, and overwrite options
         */
        fetchProducts(data = { page: 1, perPage: 10, sub_category: String(), overwrite: false }){

            // Destructuring assignment for easier access
            let {  $route: { query, params }, filter: { sort_pricing } } = this, url = `/products/${params.category}/${params.sub_category}`, { page, perPage, overwrite } = data;

            // Check if query contains name and append to URL
            if( !isEmpty(query) && has(query,'name') && !isEmpty(query.name) ){
                url += `?${url}?name=${query.name}&page=${page}&perPage=${perPage}&sort_pricing=${sort_pricing}`;
            } else {
                // Append page and perPage to URL
                url += `?page=${page}&perPage=${perPage}&sort_pricing=${sort_pricing}`;
            }
            
            // Make API call to get products
            this.$api
                .get(url)
                .then( ({ data:{ products, brands, category, sub_category, products_count }}) => {
                    /**
                     * Clones the category object and assigns it to the this.category property.
                     * @type {Object}
                     */
                    this.category     = cloneDeep(category);
                    
                    /**
                     * Clones the sub_category object and assigns it to the this.sub_category property.
                     * @type {Object}
                     */
                    this.sub_category = cloneDeep(sub_category);

                    // Update products based on overwrite option
                    if( !isEmpty(this.products) ){
                        if( overwrite ){
                            this.products = cloneDeep(products);
                        }

                        if( !overwrite ){
                            this.products.data = cloneDeep(this.products.data.concat(products.data));
                        }

                        this.products.currentPage = products.currentPage;
                    }

                    // Set products if it's empty
                    if( isEmpty(this.products) ){
                        this.products = cloneDeep(products);            
                    }

                    // Update sub_categories
                    this.brands = cloneDeep(brands);

                    this.products_count = products_count;
                }) 
                .catch( ({ response }) => {
                    this.loading = false;
                    if( !isEmpty(response.data) && response.data.statusCode == 400 ){
                        response.data.message.forEach( (value) => {
                            toast.info(value);
                        });
                    }
                })
                .finally( () => {
                    this.loading = false;
                    this.$store.commit('loader',false);
                    this.$store.commit('card_loader',false); 
                });            

        },
        toBase64(string,reverse = true){
            return reverse ? window.btoa(string) : window.atob(string);
        },  
        loadMore(event){

            let { products: { currentPage, perPage, totalPages }, sub_category } = this, 
            page = currentPage < totalPages ? currentPage + 1 : null;

            if( !isNull(page) ){
                this.$store.commit('card_loader',true);
                this.fetchProducts({ page, perPage, sub_category });
            }

            if( isNull(page) ){
                $(event.target).text('No more products.');
            }

        },
        selectSubCategory(value,category){
            this.sub_category = btoa(value.toLowerCase());
            $('div[data-perent="#sub_categories"].show').collapse('hide');
            $('input[name="sub_child_category"]').prop('checked',false);
            if( !isEmpty(category.children) ){
                this.sub_child_category = String();
                $(`#${category.categoryName.toLowerCase().replaceAll(' ','')}`).collapse('show');
            }
        },
        selectSubChildCategory(category) {
            this.sub_child_category = btoa(category.categoryName.toLowerCase());
        },
        showCollapsed(event,category){
            event.preventDefault();
            $(`#${category.categoryName.toLowerCase().replaceAll(' ','')}`).collapse('show')
        },
        openFilter(){
            $(".filter-bottom-content").slideToggle("");
        }
    },
    watch:{
        "filter.per_page"(value){
            this.$store.commit('card_loader',true);
            this.fetchProducts({ page: 1, perPage: value, overwrite: true });
        },
        "filter.sort_pricing"(value){
            this.$store.commit('card_loader',true);
            this.fetchProducts({ page: 1, perPage: this.filter.per_page, overwrite: true });
        },
        "$route.query":{
            /**
             * Watch for changes in the route perameters and trigger the necessary
             * actions to update the data.
             *
             * @peram {Object} newValue - The new value of the route perameters.
             */
            handler(){
                // Set loading to true to indicate that data is being fetched.
                this.loading = true;

                this.products = {};

                // Commit a card_loader mutation to show the loader.
                this.$store.commit('loader',true);

                // Fetch the data based on the updated route perameters.
                this.fetchProducts();
            },
            deep: true
        },
    }
}
</script>