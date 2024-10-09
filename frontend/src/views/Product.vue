<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container-fluid">
                <div class="row px-4">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h2>{{ product.name }}</h2>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <nav aria-label="breadcrumb" class="theme-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#" @click="$router.push({ name: 'Home' })">Home</a></li>
                                <li class="breadcrumb-item"><a href="#" @click="$router.go(-1)">Products</a></li>
                                <li class="breadcrumb-item active" aria-current="page">{{ product.name }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <!-- breadcrumb End -->


        <!-- section start -->
        <section>
            <div class="collection-wrapper">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-6 col-xs-12 p-2">
                            <template v-if="$isEmpty(product) && loading.product">
                                <div class="ssc">
                                    <div class="ssc-wrapper">
                                        <div class="ssc-square"></div>                               
                                        <div class="ssc-square"></div>                               
                                        <div class="ssc-square"></div>                               
                                    </div>
                                </div>                                  
                            </template>
                            <template v-if="!$isEmpty(product) && !loading.product">
                                <Carousel  
                                    v-if="!$isEmpty(product.images)"
                                    :settings="settings.images" 
                                    :itemsToShow="1" 
                                    :wrapAround="true" 
                                >
                                    <Slide v-for="(image,index) in product.images" :key="index" :style="`height:${$store.getters.banner_height}`">
                                        <div class="p-4">
                                            <InnerImageZoom :src="image.urls[0].url" :zoomScale="2" /> 
                                        </div>                                    
                                    </Slide>
                                </Carousel>
                                <div class="col-12 pt-4">
                                    <Carousel
                                        id="thumbnails"
                                        :itemsToShow="3"
                                        :wrap-around="true"
                                        ref="carousel"
                                    >
                                        <Slide v-for="(image,index) in product.images" :key="index">
                                            <div class="card col-12">
                                                <div class="card-body">
                                                    <img :src="image.urls[0].url" alt="" width="100%" height="200">
                                                </div>
                                            </div>
                                        </Slide>
                                        <template #addons>
                                            <navigation />
                                            <pagination />
                                        </template>
                                    </Carousel> 
                                </div>
                            </template>                        
                        </div>
                        <div class="col-lg-6">
                            <div class="card">
                                <div class="card-body product-right">
                                    <h2 class="text-theme">{{ product.full_code }}</h2>
                                    <h2 class="text-theme">{{ product.name }}</h2>
                                    <h3 class="price-detail">{{ currency }} {{ $get($first($get($first(product.__variants__),'price')),'amount') }}</h3>
                                    <div class="border-product">
                                        <h5> 
                                            Selected colour: 
                                            <span v-if="$has(errors,'colour')" class="text-danger">{{errors.colour}}</span>
                                            <span v-if="!$isEmpty(form.colour)"><strong>{{ form.colour }}</strong></span>
                                        </h5>	
                                        <ul class="color-variant p-0">
                                            <template v-for="(hex,index) in colour_images">
                                                <li   
                                                    v-if="selections.hex.includes(hex)"                                       
                                                    :key="`active_${index}`" 
                                                    class="active"
                                                    :ref="hex"                     
                                                    :style="`background-color: ${hex}`"                       
                                                    @click="($event) => selectColour(hex,$event)"                        
                                                ></li>
                                                <li   
                                                    v-if="!selections.hex.includes(hex)"                                
                                                    :key="`inactive_${index}`" 
                                                    :style="`background-color: ${hex}`"                       
                                                    :ref="hex"                   
                                                    @click="($event) => selectColour(hex,$event)"                        
                                                ></li>
                                            </template>
                                            <template v-if="$isEmpty(colour_images)">
                                                <h5 class="text-danger">No colour options found.</h5>
                                            </template>
                                        </ul>
                                    </div>
                                    <div id="selectSize" class="addeffect-section product-description border-product">
                                        <template v-if="isVariant">
                                            <div class="row pb-2">
                                                <div class="col-12">
                                                    <h5>
                                                        Selected size: 
                                                        <span v-if="$has(errors,'sizes')" class="text-danger mr-0">{{errors.sizes}}</span>
                                                        <span v-if="!$isEmpty(form.sizes)" class="mr-0"><strong>{{ form.sizes.map( size => size.name ).join(',') }}</strong></span>
                                                    </h5>
                                                </div>                                    
                                                <div class="col-md-6 py-2" v-for="(variant,index) of variants" :key="index">
                                                    <div class="quantity-box">
                                                        <div class="input-group">
                                                            <span :class="$has(selections.sizes,variant.code_size) ? `input-group-prepend active` : `input-group-prepend` ">
                                                                <button 
                                                                    class="btn" 
                                                                    @click="selectSize(variant,$event)" 
                                                                    :disabled="($first(variant.stocks).stock.quantity - $first(variant.stocks).stock.reserved_quantity) <= 0 || $isEmpty(selections.colour)"
                                                                >{{ variant.code_size_name }}</button>
                                                            </span>
                                                            <input 
                                                                type="number" 
                                                                :name="`quantity_${variant.full_code}`" 
                                                                class="form-control input-number" 
                                                                :disabled="($first(variant.stocks).stock.quantity - $first(variant.stocks).stock.reserved_quantity) <= 0 || $isEmpty(selections.colour) || !$has(selections.sizes,variant.code_size)"
                                                                v-if="!$has(selections.sizes,variant.code_size)"
                                                                value="0"
                                                            > 
                                                            <input 
                                                                type="number" 
                                                                :name="`quantity_${variant.full_code}`" 
                                                                class="form-control input-number" 
                                                                :disabled="($first(variant.stocks).stock.quantity - $first(variant.stocks).stock.reserved_quantity) <= 0 || $isEmpty(selections.colour) || !$has(selections.sizes,variant.code_size)"
                                                                v-if="$has(selections.sizes,variant.code_size)" 
                                                                v-model="form.sizes[selections.sizes[variant.code_size]].quantity" 
                                                                value="0"
                                                            > 
                                                        </div>
                                                    </div>
                                                    <div class="text-center">
                                                        <h6 class="mb-0">Stock Available: {{ $first(variant.stocks).stock.quantity - $first(variant.stocks).stock.reserved_quantity }}</h6>
                                                    </div>                                
                                                </div>
                                            </div>
                                        </template>
                                        <template v-if="!isVariant">
                                            <h5 class="product-title">Quantity</h5>
                                            <div class="qty-box">
                                                <div class="input-group">
                                                    <span class="input-group-prepend">
                                                        <button type="button" class="btn quantity-left-minus" data-type="minus" data-field="" @click="() => descreaseQuantity()">
                                                            <i class="fa fa-angle-left"></i>
                                                        </button> 
                                                    </span>
                                                    <input type="text" :name="`quantity_${product.full_code}`" class="form-control input-number" :value="form.quantity"> 
                                                    <span class="input-group-prepend">
                                                        <button type="button" class="btn quantity-right-plus" data-type="plus" data-field="" @click="() => increaseQuantity()">
                                                            <i class="fa fa-angle-right"></i>
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                    <div class="product-buttons">
                                        <div class="d-flex">
                                            <div>
                                                <button class="btn btn-solid hover-solid btn-animation text-white" :disabled="isDisabled || !$isEmpty(cartItem)" @click="addToCart">
                                                    <i class="fa fa-shopping-cart me-1" aria-hidden="true"></i>
                                                    <span v-if="$isEmpty(cartItem)">add to cart</span>
                                                    <span v-if="!$isEmpty(cartItem)">already in cart</span> 
                                                </button>                                             
                                            </div>
                                            <div class="px-4">
                                                <template v-if="$isEmpty($store.getters.auth)">
                                                    <button class="btn btn-solid btn-animation text-white" :disabled="isDisabled" data-toggle="tooltip" data-placement="top" title="You need to login.">
                                                        <i class="fa fa-bookmark fz-16 me-2" aria-hidden="true"></i>
                                                        wishlist
                                                    </button>    
                                                </template>
                                                <template v-else>
                                                    <button class="btn btn-solid hover-solid btn-animation text-white" :disabled="!$isEmpty(favourite)" @click="addToFavourites()">
                                                        <i v-show="!loading.wishlist" class="fa fa-bookmark fz-16 me-2" aria-hidden="true"></i>
                                                        <i v-show="loading.wishlist" class="fa fa-spinner fa-spin"></i>
                                                        <span v-show="$isEmpty(favourite)">Wishlist</span>
                                                        <span v-show="!$isEmpty(favourite)">Already in wishlist</span>
                                                    </button>    
                                                </template>                                        
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
        <!-- Section ends -->

        <!-- product-tab starts -->
        <section class="tab-product m-0">
            <div class="container">
                <div class="row">
                    <div class="col-sm-12 col-lg-12">
                        <ul class="nav nav-tabs nav-material" id="top-tab" role="tablist">
                            <li class="nav-item"><a class="nav-link active" id="top-home-tab" data-bs-toggle="tab"
                                    href="#top-home" role="tab" aria-selected="true"><i
                                        class="icofont icofont-ui-home"></i>Details</a>
                                <div class="material-border"></div>
                            </li>
                            <li class="nav-item" v-if="!$isEmpty(auth)"><a class="nav-link" id="review-top-tab" data-bs-toggle="tab"
                                    href="#top-review" role="tab" aria-selected="false"><i
                                        class="icofont icofont-contacts"></i>Write Review</a>
                                <div class="material-border"></div>
                            </li>
                        </ul>
                        <div class="tab-content nav-material" id="top-tabContent">
                            <div class="tab-pane fade show active" id="top-home" role="tabpanel"
                                aria-labelledby="top-home-tab">
                                <div class="product-tab-discription">
                                    <div class="part" v-html="product.description"></div>                                
                                </div>
                            </div>                        
                            <div class="tab-pane fade" id="top-review" role="tabpanel" aria-labelledby="review-top-tab" v-if="!$isEmpty(auth)">
                                <ProductRatingForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- product-tab ends -->

        <!-- product section start -->
        <section class="section-b-space ratio_asos">
            <div class="container">
                <div class="row">
                    <div class="col-12 product-related">
                        <h2>related products</h2>
                    </div>
                </div>
                <div class="row search-product">
                    <template v-if="$isEmpty(related_products) && loading.product">
                        <div class="col-xl-3">
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
                        <div class="col-xl-3">
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
                        <div class="col-xl-3">
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
                        <div class="col-xl-3">
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
                    </template>
                    <template v-if="$isEmpty(related_products) && !loading.product">
                        <div class="col-12">
                            <h4>Nothing Found Here</h4>
                        </div>
                    </template>
                    <template v-if="!$isEmpty(related_products) && !loading.product">
                        <RelatedProduct v-for="(product, index) in related_products" :key="index" :data="product" />
                    </template>
                </div>
            </div>
        </section>
        <!-- product section end -->


    </div>
</template>

<script>
import { clone, cloneDeep, debounce, each, first, get, groupBy, isEmpty, isNull, keys, has, omit, set, min, uniq } from 'lodash';
import * as yup from "yup";
import convertCssColorNameToHex from 'convert-css-color-name-to-hex';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { ProductRatingForm, RelatedProduct } from '../components';
import InnerImageZoom from 'vue-inner-image-zoom';
import 'vue-inner-image-zoom/lib/vue-inner-image-zoom.css'
export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fetchProduct(),
            next();
        });
    },
    components:{
        Carousel, InnerImageZoom, Slide, Pagination, Navigation, ProductRatingForm, RelatedProduct
    },
    computed:{
        auth(){
            return this.$store.getters.auth;
        },
        cart:{
            get(){
                return this.$store.getters.cart;
            },
            set(value){
                this.$store.commit('cart',value);
            }
        },
        cartItem(){
            return this.cart.find( val => val.product_id == this.product.id ) ?? {};
        },
        colour_images(){
            return !isEmpty(this.product) && !isEmpty(this.product.colour_images) ? uniq(this.product.colour_images.map( image => image.hex ).flat()) : [];
        },
        currency(){
            return this.$store.getters.home.company.currency
        },
        variants(){
            return !isEmpty(this.product) && !isEmpty(this.product.colour_images)  ? 
                        !isEmpty(this.selections.colour) ? 
                            this.product.__variants__.filter( variant => variant.code_colour.includes(this.selections.colour.code) ) :
                                this.product.__variants__.filter( variant => variant.code_colour.includes(first(this.product.colour_images).code) ): 
                    [];
        },
        isVariant(){
            return !isEmpty(this.product) ? !isEmpty(this.product.__variants__.filter( val => !isNull(val.code_size) )) : false
        }
    },
    created(){
        this.$isEmpty      = isEmpty;
        this.$isNull       = isNull;
        this.$has          = has;
        this.$first        = first;
        this.$get          = get;
        this.$convertToHex = (colour) =>  convertCssColorNameToHex(colour.toLowerCase().split(' ').join(""));

        /**
         * Validates a form field based on the provided field name.
         * Uses the formSchema to validate the field and updates the errors object accordingly.
         * Updates the isDisabled property based on the presence of errors.
         *
         * @param {string} field - The name of the field to validate.
         */
        this.validateForm = (field) => {
            // Validate the field using the formSchema
            this.formSchema.validateAt(field, this.form)
                .then((value,key) => {
                    // If the field is valid, delete the corresponding error from the errors object
                    delete this.errors[field];
                })
                .catch((err) => {
                    // If the field is invalid, update the errors object with the error message
                    this.errors[err.path] = err.message;
                })
                .finally(() => {
                    // Update the isDisabled property based on the presence of errors
                    this.isDisabled = !isEmpty(this.errors);
                })
        }         
    },
    data(){
        return{
            breakpoints: {
                gallery: {
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
            },
            errors:      Object(),
            favourite:   Object(),
            form:        Object(),
            isDisabled:  Boolean(),
            loading:     {
                product: Boolean(true),
                wishlist: Boolean()
            },
            product:     Object(),
            related_products: Array(),
            stock:       Object(),
            schemaShape: Object(),
            selections:  {
                colour: Object(),
                hex:    String(),
                sizes:  Object()
            },
            settings:{
                images:{
                    itemsToShow: 1,
                    snapAlign: 'center',
                }
            }
        }
    },
    methods:{
        addToCart(){
            let { isVariant, product, selections } = this;
            let data     = cloneDeep(this.form);
            let selected = product.__variants__.find( variant => selections.colour.code == variant.code_colour );

            if( has(selections,'colour') && !isEmpty(selections.colour.images) ){
                data.image = selections.colour.images[0].urls[0].url;
            }

            if( isEmpty(selections.colour.images) && !isEmpty(this.product.images) ){
                let image  = this.product.images.find( val => val.name == selected.full_code || `${product.full_code}_default`)
                data.image = image.urls[0].url;
            }

            this.cart.push(cloneDeep(data));
        },
        addQuantity(event){
            this.form.sizes[this.selections.sizes[sizeName]].quantity = event.target.value;
        },
        addToFavourites(){
            this.loading.wishlist = true; // Set loader
            // Add this product to wishlist
            this.$api
                .put(`favourites/${this.$route.params.product}`)
                .then( ({ data: { favourite } }) => {
                    this.favourite = cloneDeep(favourite);
                    this.$toast.info('This product has been added to your wishlist.');
                })
                .catch( () => {
                    this.loading.wishlist = false; // Set loader
                })
                .finally( () => {
                    this.loading.wishlist = false; // Set loader
                });  
        },
        close(){
            this.initView();
        },
        initView(product){
            let isVariant = !isEmpty(product) ? !isEmpty(product.__variants__.filter( val => !isNull(val.code_size_name) )) : false;
            
            this.product  = cloneDeep(product);

            $(`input[name="quantity_${product.full_code}"]`).val(1);

            set(this.form,'product_id', String());
            set(this.form,'price',      String());
            set(this.form,'colour',     String());
            set(this.form,'name',       String(product.name));

            switch( isVariant ){   
                case true: 
                    // Check if product has variants and add validation of sizes
                    this.schemaShape.sizes = yup.array().of(
                        yup.object({
                            name:     yup.string().required("*Size name is required."),
                            quantity: yup.number().min(1).required("*Size quantity is required."),
                        })
                    )
                    .min(1)
                    .required("*Size is required");  

                    set(this.selections,'sizes',Object());
                    set(this.form,'sizes',Array());
                    set(this.form,'price',first(first(product.__variants__).price).amount);
                break;
                case false:
                    // Check if product has variants and add validation of quantity if empty
                    this.schemaShape.quantity = yup.number().required("*Quantity is required.");       
                    set(this.form,'quantity',Number(1));
                break;
            }
            
            this.schemaShape.product_id = yup.string().required("*Product is required."); // validate product code   
            this.schemaShape.colour     = yup.string().required("*Select a colour."); // validate product colour
            this.schemaShape.price      = yup.number().required("*Price is required."); // validate product price
            this.schemaShape.hex        = yup.string(); // validate product hex colour
            this.schemaShape.name       = yup.string(); // validate product hex colour

            set(this.selections,'colour',Object()); // Initialize colour selection
            
            this.formSchema           = yup.object().shape(this.schemaShape);  // Initialize validation
            this.form.product_id      = product.id;

            if( !isEmpty(this.cartItem) ){
                this.form.sizes        = cloneDeep(this.cartItem.sizes);
                this.selections.colour = this.product.colour_images.find( colour => colour.hex.includes(this.cartItem.hex) );
                this.selections.sizes  = this.cartItem.sizes.reduce((a, v) => { a[v.name] = this.cartItem.sizes.findIndex( val => val.name == v.name) ; return a; }, {});
                this.selections.hex    = clone(this.cartItem.hex);
            }
            // this.fetchColourStock(product); // Fetch colour stock           
        },        
        descreaseQuantity(){
            let quantity = parseInt($(`input[name="quantity_${this.product.full_code}"]`).val());
            if( quantity != 1 ){
                const total  = quantity -= 1;   
                $(`input[name="quantity_${this.product.full_code}"]`).val(total);
                this.form.quantity = total;
            }
        },
        increaseQuantity(){
            let quantity = parseInt($(`input[name="quantity_${this.product.full_code}"]`).val());
            const total  = quantity += 1;
            $(`input[name="quantity_${this.product.full_code}"]`).val(total);          
            this.form.quantity = total;
        },
        // Fetch colour stock
        // Requires product 
        fetchColourStock(product){
            // Promise call for all colour images
            Promise.all( product.colourImages.map( colour => this.fetchStock(`${this.product.full_code}-${colour.code}`)) )
                   .then( (colours) => {
                        colours.forEach( ({ data:{ stock }}) => {
                            this.stock[stock.colourCode] = stock.stock;
                            if( stock.stock == 0 ){
                                this.$refs[stock.colourCode][0].classList.add('inactive');
                            }
                        });
                   });
        },
        /**
         * Fetches the product details from the server and initializes the view.
         * @returns {Promise} A promise that resolves when the product details and related products are fetched and the view is initialized.
         */
        fetchProduct(){
            this.$store.commit('loader',true); // Set loader
            
            // Destructure route params
            const { $route: { params: { product } } } = this;
            
            // Fetch product details
            this.$api.put(`/products/${product}`)
                .then( ({ data:{ product, favourite,related_products }}) => {
                    // Update state with fetched data
                    this.favourite = cloneDeep(favourite);
                    this.related_products = cloneDeep(related_products)
                    
                    // Initialize view
                    this.initView(product);
                })
                .catch( ({ response }) => {
                    this.$store.commit('loader',false);
                })
                .finally( () => {
                    this.loading.product = Boolean();
                    // this.initScripts();
                });            
        },
        fetchStock(code){
            return this.$api.put(`/products/stock/${code}`); // Fetch stock from an item full code
        },
        selectColour(hex,event){
            let variant = window.document.querySelector('.color-variant li.active');
            let colour  = this.product.colour_images.find( colour => colour.hex.includes(hex) );

            if( !isNull(variant) ){ variant.classList.remove('active'); }
            event.target.classList.add('active');

            this.selections.colour = colour;      
            this.selections.hex    = hex;      
            this.form.hex          = hex;      
            this.form.colour       = colour.name;  

            if( !this.isVariant ){
                let variant     = this.product.__variants__.find( (variant) => variant.code_colour_name.includes(colour.name.toUpperCase()) )
                this.form.price = first(variant.price).amount;
            }

            if( !isEmpty(this.selections.sizes) ){
                this.selections.sizes = Object();
            }

            if( !isEmpty(this.form.sizes) ){
                this.form.sizes.splice(0);
            }

        },
        selectSize(variant,event){
            console.log(variant)
            // Check if colour has been selected
            if( has(this.errors,'colour') ){
                this.$toast.warning('Select colour.');
            }
            
            if( !has(this.errors,'colour') ){

                let { form, selections: { colour } } = this;
                let select_variant                   = form.sizes.find( size => size.name == variant.code_size );

                if( isEmpty(select_variant) ){
                    this.form.sizes.push({
                        name:     variant.code_size,
                        quantity: Number(1)
                    });
                    this.selections.sizes[variant.code_size] = (this.form.sizes.length - 1);
                } 

                if( !isEmpty(select_variant) ) {
                    this.form.sizes = this.form.sizes.filter( size => size.name != variant.code_size );
                    delete this.selections.sizes[variant.code_size];
                }

            }
        },
        initScripts(){

            $('.product-slick').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                fade: true,
                asNavFor: '.slider-nav'
            });

            $('.slider-nav').slick({
                vertical: false,
                slidesToShow: 3,
                slidesToScroll: 1,
                asNavFor: '.product-slick',
                arrows: false,
                dots: false,
                focusOnSelect: true
            });
             
        },
    },
    mounted(){
        this.$nextTick( 
            debounce(
                () => {
                    if( !isEmpty(this.cartItem) ){
                        this.form = cloneDeep(this.cartItem);
                    }    
                    $('[data-toggle="tooltip"]').tooltip()                                 
                },
                200
            )
        );
    },
    watch:{
        form:{
            handler(form){
                each(form,(value,key) => {
                    this.validateForm(key);
                });                
            },
            deep: true,
            immediate: false
        },
        product:{
            handler(value){
                if( !isEmpty(value) && this.$store.getters.loader ){
                    this.$store.commit('loader',false);
                }
            },
            deep: true
        },
        "$route.params":{
            handler(){
                this.product.loading = true;
                this.$store.commit('loader',true);
                this.fetchProduct();
            },
            deep: true
        },
    }
}
</script>

<style scoped>
.quantity-box .input-group span {
    background: #fff !important;
    border: 1px solid #ced4da !important;
    width: 60px;
    background-color: transparent;
    border: 0;
    color: #777;
    cursor: pointer;
    font-size: 12px;
    font-weight: 900;
    line-height: 1;
    justify-content: center;
    align-items: center;
    font-weight: 900;
    color: #222
}
.quantity-box .input-group span button {
    width: 100% !important;
}
.quantity-box .input-group span.active {
    background: #222 !important;
}
.quantity-box .input-group span.active button {
    color: #fff !important;
}
.quantity-box .input-group span.active .form-control {
    color:  #222 !important;
}
</style>