<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h2>Products</h2>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <nav aria-label="breadcrumb" class="theme-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#" @click.prevent="$router.push({name:'Home'})">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Products</li>
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
                <div class="container">
                    <div class="row">
                        <div class="col-sm-3 collection-filter">
                            <!-- side-bar colleps block stat -->
                            <div class="collection-filter-block">
                                <!-- sub categories filter start -->
                                <div class="collection-collapse-block open">
                                    <h3 class="collapse-block-title">Sub Categories</h3>
                                    <div class="collection-collapse-block-content" id="sub_categories">
                                        <template v-if="$isEmpty(sub_categories) && loading">
                                            <div class="ssc">
                                                <div class="ssc-wrapper px-0">                  
                                                    <div class="ssc-line w-100 mbs"></div>
                                                    <div class="ssc-line w-90 mbs"></div>
                                                    <div class="ssc-line w-100 mbs"></div>
                                                    <div class="ssc-line w-90 mbs"></div>
                                                    <div class="ssc-line w-100 mbs"></div>
                                                    <div class="ssc-line w-100 mbs"></div>
                                                    <div class="ssc-line w-70 mbs"></div>
                                                    <div class="ssc-line w-100 mbs"></div>   
                                                    <div class="ssc-line w-90 mbs"></div>
                                                    <div class="ssc-line w-100 mbs"></div>
                                                    <div class="ssc-line w-70 mbs"></div>
                                                    <div class="ssc-line w-100 mbs"></div>
                                                    <div class="ssc-line w-70 mbs"></div>
                                                    <div class="ssc-line w-100 mbs"></div>
                                                    <div class="ssc-line w-70 mbs"></div>
                                                    <div class="ssc-line w-90 mbs"></div>
                                                    <div class="ssc-line w-70 mbs"></div>
                                                    <div class="ssc-line w-100 mbs"></div>
                                                    <div class="ssc-line w-70 mbs"></div>
                                                    <div class="ssc-line w-90 mbs"></div>
                                                    <div class="ssc-line w-70 mbs"></div>
                                                    <div class="ssc-line w-100 mbs"></div>
                                                    <div class="ssc-line w-70 mbs"></div>
                                                    <div class="ssc-line w-90 mbs"></div>
                                                </div>
                                            </div>
                                        </template>
                                        <template v-if="!$isEmpty(sub_categories) && !loading">
                                            <div class="collection-brand-filter">
                                                <div class="form-check collection-filter-checkbox align-items-center">
                                                    <input type="radio" class="form-check-input" value="all" name="sub_category" @change="selectSubCategory($event.target.value)" checked id="all" style="width: 1.5em; height: 1.5em;" >
                                                    <label class="form-check-label mb-0" for="all">All</label>
                                                </div>
                                            </div>
                                            <div class="collection-brand-filter" v-for="(category,index) in sub_categories" :key="index">
                                                <div class="form-check collection-filter-checkbox align-items-center justify-content-between">
                                                    <div>
                                                        <input type="radio" class="form-check-input" :value="category.categoryName" @change="selectSubCategory($event.target.value,category)" name="sub_category" :id="category.categoryName" style="width: 1.5em; height: 1.5em;" >
                                                        <label class="form-check-label mb-0" :for="category.categoryName">{{ category.categoryName }}</label>
                                                    </div>
                                                    <a class="text-end" v-if="!$isEmpty(category.children)" href="#" @click="showCollapsed($event,category)"><i class="fa fa-chevron-down"></i></a>
                                                </div>
                                                <div class="collapse" :id="category.categoryCode.toLowerCase()" :aria-labelledby="category.categoryCode.toLowerCase()" data-parent="#sub_categories" v-show="sub_category == toBase64(category.categoryName.toLowerCase())">
                                                    <ul class="list-group">
                                                        <li v-for="(child,child_index) in category.children" :key="child_index" class="list-group-item">
                                                            <div class="form-check collection-filter-checkbox align-items-center mt-0">
                                                                <input type="radio" class="form-check-input" :value="child.categoryName" @change="selectSubChildCategory($event.target.value)" name="sub_child_category" :id="child.categoryName">
                                                                <label class="form-check-label mb-0" :for="child.categoryName">{{ child.categoryName }}</label>
                                                            </div>                                                            
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <!-- silde-bar colleps block end here -->
                        </div>                        
                        <div class="collection-content col">
                            <div class="page-main-content">
                                <div class="collection-product-wrapper">
                                    <div class="product-top-filter">
                                        <div class="row">
                                            <div class="col-12">
                                                <div class="product-filter-content">
                                                    <div class="search-count">
                                                        <h5 v-show="!$isEmpty(products)">Showing Products 1-{{ products.total }}</h5>
                                                        <h5 v-show="$isEmpty(products)">Showing Products 0</h5>
                                                    </div>
                                                    <div class="collection-view">
                                                        <ul>
                                                            <li><i class="fa fa-th grid-layout-view"></i></li>
                                                            <li><i class="fa fa-list-ul list-layout-view"></i></li>
                                                        </ul>
                                                    </div>
                                                    <div class="product-page-per-view">
                                                        <select>
                                                            <option value="12">12 Products Per Page</option>
                                                            <option value="24">24 Products Per Page</option>
                                                            <option value="48">48 Products Per Page</option>
                                                            <option value="60">60 Products Per Page</option>
                                                        </select>
                                                    </div>
                                                    <div class="product-page-filter">
                                                        <select>
                                                            <option value="High to low">Sorting items</option>
                                                            <option value="Low to High">50 Products</option>
                                                            <option value="Low to High">100 Products</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="product-wrapper-grid">
                                        <CardLoader v-if="!$isEmpty(products.data)" />
                                        <div class="row margin-res p-2" v-show="$isEmpty(products.data) && loading">
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
                                        <div class="row margin-res" v-show="!$isEmpty(products.data) && !loading">
                                            <div class="col-xl-3 col-6 col-grid-box" v-for="(product,index) in products.data" :key="index">
                                                <div class="product-box">
                                                    <div class="img-wrapper">
                                                        <div v-if="!$isEmpty(product.images)">
                                                            <div class="front">
                                                                <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.fullCode }})">
                                                                    <img class="img-fluid blur-up lazyload bg-img" :src="product.images[0].urls[0].url" alt="">
                                                                </a>
                                                            </div>
                                                            <div class="back" v-if="product.images.length > 1">
                                                                <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.fullCode }})">
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
                                                                <h6>{{ product.productName }}</h6>
                                                            </a>
                                                            <p v-html="product.description"></p>
                                                            <h4>KSH {{ product.price }}</h4>
                                                            <ul class="color-variant p-0" v-show="!$isEmpty(product.colourImages)">
                                                                <li v-for="(colour,index) in product.colourImages" :key="index" :style="`background-color: ${ $convertToHex(colour.name) }; border: 1px solid #ededed;`"></li>
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
<script>
import { cloneDeep, isEmpty, isNull, has, times } from 'lodash';
import convertCssColorNameToHex from 'convert-css-color-name-to-hex';
import { CardLoader } from '../../components';

export default {
    /**
     * This method is called before the route is entered.
     * It fetches the data required for the view.
     * 
     * @param {Object} to - The destination route.
     * @param {Object} from - The source route.
     * @param {Function} next - The callback function to be called when the data is fetched.
     */
    beforeRouteEnter(to, from, next) {
        // Fetch the data required for the view
        next(vm => {
            vm.fetchData(),
            next(); // Call the next function to continue with the route change
        });
    },
    /**
     * This method is called when the route is updated.
     * It fetches the products required for the view.
     * 
     * @param {Object} to - The destination route.
     * @param {Object} from - The source route.
     * @param {Function} next - The callback function to be called when the data is fetched.
     */
    beforeRouteUpdate(to, from, next){
        // Fetch the products required for the view
        next(vm => {
            vm.fetchProducts(),
            next(); // Call the next function to continue with the route change
        });
    },
    components:{
        CardLoader
    },
    /**
     * Lifecycle hook called after the Vue instance is created
     */
    created(){
        this.$isEmpty = isEmpty;
        this.$times   = times;
        
        /**
         * Converts a CSS color name to its hexadecimal representation.
         *
         * @param {string} colour - The CSS color name to be converted.
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
            products: Array(),
            loading:            Boolean(true),
            sub_categories:     Array(),
            sub_category:       String(),
            sub_child_category: String()
        }
    },
    methods:{
        /**
         * Fetches the data from the server and updates the component state
         * @async
         * @function fetchData
         * @returns {Promise} A promise that resolves when the data is fetched and the component state is updated
         */
        fetchData(){
            // Reset the products array to empty
            this.products = cloneDeep({});
            
            // Fetch the products from the server
            this.fetchProducts();
        },
        /**
         * Fetch products based on the provided data
         * @param {Object} data - Object containing page, perPage, sub_category, and overwrite options
         */
        fetchProducts(data = { page: 1, perPage: 10, sub_category: String(), overwrite: false }){

            // Destructuring assignment for easier access
            let {  $route: { query } } = this, url = `/products`, { page, perPage, sub_category, sub_child_category, overwrite } = data;

            // Check if query contains category and append to URL
            if( !isEmpty(query) && has(query,'category') && !isEmpty(query.category) ){
                url = `${url}?category=${query.category}`;
            }

            // Check if query contains name and append to URL
            if( !isEmpty(query) && has(query,'name') && !isEmpty(query.name) ){
                url = `${url}?name=${query.name}`;
            }

            // Append sub_category to URL if not empty
            if( !isEmpty(sub_category) ){
                url += `&sub_category=${sub_category}`;
            }
            
            // Append sub_child_category to URL if not empty
            if( !isEmpty(sub_child_category) ){
                url += `&sub_child_category=${sub_child_category}`;
            }

            // Append page and perPage to URL
            url += `&page=${page}&perPage=${perPage}`;
            
            // Make API call to get products
            this.$api
                .get(url)
                .then( ({ data:{ products, sub_categories}}) => {
             
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
                    this.sub_categories = cloneDeep(sub_categories);

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
        toBase64(string){
            return window.btoa(string);
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
            if( !isEmpty(category.children) ){
                $(`#${category.categoryCode.toLowerCase()}`).collapse('show');
            }
        },
        selectSubChildCategory(value) {
            this.sub_child_category = btoa(value.toLowerCase());
        },
        showCollapsed(event,category){
            event.preventDefault();
            $(`#${category.categoryCode.toLowerCase()}`).collapse('show')
        }
    },
    watch:{
        "$route.params":{
            /**
             * Watch for changes in the route parameters and trigger the necessary
             * actions to update the data.
             *
             * @param {Object} newValue - The new value of the route parameters.
             */
            handler(){
                // Set loading to true to indicate that data is being fetched.
                this.loading = true;

                // Fetch the sub-categories.
                this.fetchSubCategories();

                // Fetch the data based on the updated route parameters.
                this.fetchData();
            },
            deep: true
        },
        /**
         * Watch for changes in sub_category and update the products accordingly.
         * If sub_child_category is not empty, set it to an empty string.
         * Then, commit a card_loader mutation to show the loader and fetch the products.
         *
         * @param {string} sub_category - The new sub_category value.
         */
        sub_category(sub_category){
            // If sub_child_category is not empty, set it to an empty string.
            if( !isEmpty(this.sub_child_category) ){
                this.sub_child_category = String();
            }

            // Commit a card_loader mutation to show the loader.
            this.$store.commit('card_loader',true);
            
            // Fetch the products with the new sub_category value.
            this.fetchProducts({ 
                page: 1, 
                perPage: 10, 
                sub_category, 
                overwrite: true 
            });
        },
        /**
         * Watch for changes in sub_child_category and update the products accordingly.
         * 
         * @param {string} sub_child_category - The new sub_child_category value.
         */
        sub_child_category(sub_child_category) {
            // Get the current sub_category value
            const { sub_category } = this;

            // Commit a card_loader mutation to show the loader.
            this.$store.commit('card_loader', true);

            // Fetch the products with the new sub_category and sub_child_category values.
            this.fetchProducts({ 
                page: 1, 
                perPage: 10, 
                sub_category, 
                sub_child_category, 
                overwrite: true 
            });
        }
    }
}
</script>