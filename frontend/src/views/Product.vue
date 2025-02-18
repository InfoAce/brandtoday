<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container-fluid">
                <div class="row px-4">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h4 class="m-0">{{ product.name }}</h4>
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
                <div class="container-fluid">
                    <div class="row px-4">
                        <div class="col-lg-8 col-md-6 col-xs-12 px-4">
                            <div class="favourite px-4 col-12">
                                <h1 class="text-theme text-right">
                                    <i class="far fa-heart" v-if="$isEmpty(favourite)" @click="addToFavourites()"></i>
                                    <i class="fa fa-heart" v-if="!$isEmpty(favourite)"></i>
                                </h1>
                            </div>
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
                                    :itemsToShow="1" 
                                    :wrap-around="false" 
                                    v-model="currentSlide"
                                >
                                    <Slide v-for="(image,index) in product.images" :key="index">
                                        <div class="p-4">
                                            <InnerImageZoom :src="image.urls[0].url" :zoomScale="2" /> 
                                        </div>                                    
                                    </Slide>
                                </Carousel>
                                <div class="col-12 pb-4">
                                    <Carousel
                                        id="thumbnails"
                                        :itemsToShow="3"
                                        :wrap-around="true"
                                        ref="carousel"
                                        v-model="currentSlide"
                                    >
                                        <Slide v-for="(image,index) in product.images" :key="index">
                                            <img :src="image.urls[0].url" alt="" width="70%">
                                        </Slide>
                                        <template #addons>
                                            <navigation />
                                            <pagination />
                                        </template>
                                    </Carousel> 
                                </div>
                            </template>  
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
                                    <div class="tab-pane fade show active p-4" id="top-home" role="tabpanel" aria-labelledby="top-home-tab">
                                        <div class="product-tab-discription">
                                            <div class="part" v-html="product.description"></div>                                
                                        </div>
                                        <div class="col-12 py-2" v-if="!$isEmpty(product.full_branding_guide)">
                                            <h4>Branding</h4>
                                            <a :href="product.full_branding_guide" target="_blank">View Branding Guide</a>
                                        </div>
                                    </div>                        
                                    <div class="tab-pane fade" id="top-review" role="tabpanel" aria-labelledby="review-top-tab" v-if="!$isEmpty(auth)">
                                        <ProductRatingForm />
                                    </div>
                                </div>
                            </div>                                                  
                        </div>
                        <div class="col-lg-4 col-md-6 col-12 product-details">
                            <div class="product-right px-2 py-4">
                                <h5 class="text-theme m-0">{{ product.full_code }}</h5>
                                <h2 class="text-theme">{{ product.name }}</h2>
                                <p>Price</p>
                                <h3 class="price-detail" v-if="!$isEmpty(product)">{{ currency }} {{ product.price.toFixed(2) }}</h3>
                                <p class="m-0 p-0">Excl. VAT & Excl. Branding</p>
                                <div class="border-product my-2" v-if="isColourVariant">
                                    <h5> 
                                        Selected colour: 
                                        <span v-if="$has(errors,'colour')" class="text-danger">{{errors.colour}}</span>
                                        <span v-if="!$isEmpty(form.colour)"><strong>{{ form.colour }}</strong></span>
                                    </h5>	
                                    <ul class="color-variant p-0 m-0">
                                        <template v-for="(colour,index) in colour_images" :key="`colour_image_${index}`">
                                            <li   
                                                v-if="selections.code == colour.code"    
                                                class="text-center"                                    
                                                :ref="`colour_image_${index}`"                     
                                                :style="`color: ${colour.tick_colour}; background: ${ colour.hex.length > 1 ? `linear-gradient(to right, ${colour.hex.map( hex => `${hex} ${100/colour.hex.length}%` ).join(',')} )`: colour.hex.map( hex => `${hex}` ).join(',') }`"                       
                                                @click="($event) => selectColour(colour,$event)"                        
                                            ><i class="fa fa-check"></i></li>
                                            <li    
                                                v-if="selections.code != colour.code"                                                
                                                :style="`background: ${ colour.hex.length > 1 ? `linear-gradient(to right, ${colour.hex.map( hex => `${hex} ${100/colour.hex.length}%` ).join(',')} )`: colour.hex.map( hex => `${hex}` ).join(',') }`"                                     
                                                :ref="`colour_image_${index}`"
                                                @click="($event) => selectColour(colour,$event)"                        
                                            ></li>
                                        </template>
                                        <template v-if="$isEmpty(product.colour_images)">
                                            <h5 class="text-danger">No colour options found.</h5>
                                        </template>
                                    </ul>
                                </div>
                                <div id="selectSize" class="addeffect-section product-description border-product">
                                    <template v-if="isSizeVariant">
                                        <div class="row pb-2">
                                            <div class="col-12">
                                                <h5>
                                                    Selected size: 
                                                    <span v-if="$has(errors,'sizes')" class="text-danger mr-0">{{errors.sizes}}</span>
                                                    <span v-if="!$isEmpty(form.sizes)" class="mr-0"><strong>{{ form.sizes.map( size => size.name ).join(',') }}</strong></span>
                                                </h5>
                                            </div>                                    
                                            <div class="col-md-6 col-12 py-2" v-for="(variant,index) of variants" :key="index">
                                                <div class="quantity-box">
                                                    <div class="input-group">
                                                        <span :class="$has(selections.sizes,variant.code_size) ? `input-group-prepend active` : `input-group-prepend` ">
                                                            <button 
                                                                class="btn" 
                                                                @click="selectSize(variant,$event)" 
                                                                :disabled="(variant.stock.quantity - variant.stock.reserved_quantity) <= 0 || $isEmpty(selections.colour)"
                                                            >{{ variant.code_size_name }}</button>
                                                        </span>
                                                        <input 
                                                            type="number" 
                                                            min="1"
                                                            :name="`quantity_${variant.full_code}`" 
                                                            class="form-control input-number" 
                                                            :disabled="(variant.stock.quantity - variant.stock.reserved_quantity) <= 0  || $isEmpty(selections.colour) || !$has(selections.sizes,variant.code_size)"
                                                            v-if="!$has(selections.sizes,variant.code_size)"
                                                            value="0"
                                                        > 
                                                        <input 
                                                            type="number" 
                                                            min="1"
                                                            :name="`quantity_${variant.full_code}`" 
                                                            class="form-control input-number" 
                                                            :disabled="(variant.stock.quantity - variant.stock.reserved_quantity) <= 0  || $isEmpty(selections.colour) || !$has(selections.sizes,variant.code_size)"
                                                            v-if="$has(selections.sizes,variant.code_size)" 
                                                            v-model="form.sizes[selections.sizes[variant.code_size]].quantity" 
                                                            value="0"
                                                        > 
                                                    </div>
                                                </div>
                                                <div class="text-center">
                                                    <h6 class="mb-0">Stock Available: {{ variant.stock.quantity - variant.stock.reserved_quantity }}</h6>
                                                </div>                                
                                            </div>
                                        </div>
                                    </template>
                                    <template v-if="!isSizeVariant">
                                        <h5 class="product-title">Quantity</h5>
                                        <div class="qty-box">
                                            <div class="input-group">
                                                <span class="input-group-prepend">
                                                    <button type="button" class="btn quantity-left-minus" data-type="minus" data-field="" @click="() => descreaseQuantity()">
                                                        <i class="fa fa-angle-left"></i>
                                                    </button> 
                                                </span>
                                                <input type="text" :name="`quantity_${product.full_code}`" class="form-control input-number" :value="form.quantity" v-if="!$isEmpty(selectedColourVariant)" :max="selectedColourVariant.stock.quantity"> 
                                                <input type="text" :name="`quantity_${product.full_code}`" class="form-control input-number" :value="form.quantity" v-if="$isEmpty(selectedColourVariant)"  :max="product.stock"> 
                                                <span class="input-group-prepend">
                                                    <button type="button" class="btn quantity-right-plus" data-type="plus" data-field="" @click="() => increaseQuantity()">
                                                        <i class="fa fa-angle-right"></i>
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                        <h5 class="my-2" v-if="!$isEmpty(selectedColourVariant)">
                                            Stock Available: {{ selectedColourVariant.stock.quantity }} 
                                        </h5>
                                        <h5 class="my-2" v-if="$isEmpty(selectedColourVariant)">
                                            Stock Available: {{ product.stock }} 
                                        </h5>
                                    </template>
                                </div>
                                <div class="product-buttons border-product m-0">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <button class="btn btn-theme btn-lg w-100" :disabled="isDisabled || !$isEmpty(cartItem)" @click="addToCart">
                                                <i class="fa fa-shopping-cart me-1" aria-hidden="true"></i>
                                                <span v-if="$isEmpty(cartItem)">add to cart</span>
                                                <span v-if="!$isEmpty(cartItem)">already in cart</span> 
                                            </button>                                             
                                        </div>
                                        <!-- <div class="col-md-6" v-if="!$isEmpty($data.product.__branding__)">
                                            <button class="btn btn-theme btn-lg w-100" :disabled="isDisabled || !$isEmpty(cartItem) || loading.quote" @click="buyBranded">
                                                <i v-if="!loading.quote" class="fas fa-file-alt"></i>
                                                <i v-if="loading.quote" class="fa fa-spinner fa-spin"></i>
                                                Buy Branded
                                            </button>                                             
                                        </div> -->
                                    </div>
                                </div>
                            </div>                                
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- Section ends -->


        <!-- product section start -->
        <!-- <section class="section-b-space ratio_asos">
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
        </section> -->
        <!-- product section end -->


    </div>
</template>

<script>
import { clone, cloneDeep, debounce, each, first, get, groupBy, isEmpty, isNull, keys, has, omit, set, min, transform, uniq } from 'lodash';
import * as yup from "yup";
import convertCssColorNameToHex from 'convert-css-color-name-to-hex';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { ProductRatingForm, RelatedProduct } from '../components';
import InnerImageZoom from 'vue-inner-image-zoom';
import 'vue-inner-image-zoom/lib/vue-inner-image-zoom.css'
import { sortSizes } from '../helpers'
import { saveAs } from "file-saver";
import moment from 'moment';

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
        branded:{
            get(){
                return this.$store.getters.branded;
            },
            set(value){
                this.$store.commit('branded',value);
            }
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
            return this.cart.find( val => val.full_code == this.product.full_code ) ?? {};
        },
        colour_images(){
            return !isEmpty(this.product) && !isEmpty(this.product.colour_images) ? this.product.colour_images : [];
        },
        currency(){
            return this.$store.getters.home.company.currency
        },
        variants(){
            return !isEmpty(this.product) && !isEmpty(this.product.colour_images)  ? 
                        !isEmpty(this.selections.colour) ? 
                            sortSizes(this.product.__variants__.filter( variant => variant.code_colour.includes(this.selections.colour.code) )) :
                                sortSizes(this.product.__variants__.filter( variant => variant.code_colour.includes(first(this.product.colour_images).code) )): 
                    [];
        },
        selectedColourVariant(){
            return !isEmpty(this.product) && !isEmpty(this.product.colour_images) && !isEmpty(this.selections.colour) ? 
                        transform(
                            this.product.__variants__
                                .find( variant => variant.code_colour.includes(this.selections.colour.code) ),
                            (result, value, key) => {
                                result[key] = value;
                                return result;
                            },
                            {}
                        ) : 
                    {}
        },
        isColourVariant(){
            return !isEmpty(this.product.colour_images);
        },
        isSizeVariant(){
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


        this.downloadFile = (pdf, fileName) => {
            const link = document.createElement('a');
            // create a blobURI pointing to our Blob
            link.href     = `data:application/pdf;base64,${pdf}`;
            link.download = fileName;
            // some browser needs the anchor to be in the doc
            document.body.append(link);
            link.click();
            link.remove();
            // // in case the Blob uses a lot of memory
            // setTimeout(() => URL.revokeObjectURL(link.href), 7000);
        };

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
            currentSlide: 1,
            errors:      Object(),
            favourite:   Object(),
            form:        Object(),
            isDisabled:  Boolean(),
            loading:     {
                quote:   Boolean(),
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
            let { isSizeVariant, product, selections } = this;
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

            this.$toast.success('This product has been added to your cart.');
        },
        addQuantity(event){
            this.form.sizes[this.selections.sizes[sizeName]].quantity = event.target.value;
        },
        addToFavourites(){
            // Check if authenticated
            if( isEmpty(this.auth) ){
                this.$router.push({ name: 'Login', query: { redirect: btoa(this.$route.path) } }); // Redirect to login
                return;
            }
            
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
        buyBranded(){
            let { isSizeVariant, product, selections } = this;

            let data     = cloneDeep(this.form);
            let selected = product.__variants__.find( variant => selections.colour.code == variant.code_colour );

            if( has(selections,'colour') && !isEmpty(selections.colour.images) ){
                data.image = selections.colour.images[0].urls[0].url;
            }

            if( isEmpty(selections.colour.images) && !isEmpty(this.product.images) ){
                let image  = this.product.images.find( val => val.name == selected.full_code || `${product.full_code}_default`)
                data.image = image.urls[0].url;
            }

            this.branded = cloneDeep(data);

            this.$router.push({ name: 'BuyBranded', params:{ full_code: product.full_code }})
        },
        close(){
            this.initView();
        },
        initView(product){
            
            this.product  = cloneDeep(product);

            let form      = Object();

            $(`input[name="quantity_${product.full_code}"]`).val(1);

            set(form,'full_code',  String(product.full_code));
            set(form,'image',      String());
            set(form,'name',       String(product.name));
            set(form,'price',      parseFloat(product.price.toFixed(2)));

            if( !isEmpty(product.colour_images) && this.isSizeVariant  ){
                set(form,'colour',  String());
                set(form,'hex',     Array());
                set(form,'sizes',   Array());

                set(this.selections,'sizes', Object());
                set(this.selections,'colour',Object()); // Initialize colour selection

                this.schemaShape.hex        = yup.array(); // validate product hex colour
                this.schemaShape.colour     = yup.string().required("*Select a colour."); // validate product colour

                // Check if product has variants and add validation of sizes
                this.schemaShape.sizes = yup.array().of(
                    yup.object({
                        name:     yup.string().required("*Size name is required."),
                        quantity: yup.number().min(1).required("*Size quantity is required."),
                    })
                )
                .min(1)
                .required("*Size is required");  
            }

            if( !isEmpty(product.colour_images) && !this.isSizeVariant  ){
                this.schemaShape.hex        = yup.array(); // validate product hex colour
                this.schemaShape.colour     = yup.string().required("*Select a colour."); // validate product colour

                // Check if product has variants and add validation of quantity if empty
                this.schemaShape.quantity = yup.number().required("*Quantity is required."); 

                set(form,'colour',  String());
                set(form,'hex',     Array());
                set(form,'quantity',Number(1));      

                set(this.selections,'colour',Object()); // Initialize colour selection
            }

            if( isEmpty(product.colour_images) && !this.isSizeVariant  ){
                this.schemaShape.quantity = yup.number().required("*Quantity is required.");       
                set(form,'quantity',Number(1));                
                set(form,'image',   String(first(product.images.find( image => image.isDefault ).urls).url));
            }

            // switch( this.isSizeVariant ){   
            //     case true: 
            //         // Check if product has variants and add validation of sizes
            //         this.schemaShape.sizes = yup.array().of(
            //             yup.object({
            //                 name:     yup.string().required("*Size name is required."),
            //                 quantity: yup.number().min(1).required("*Size quantity is required."),
            //             })
            //         )
            //         .min(1)
            //         .required("*Size is required");  

            //         set(this.selections,'sizes',Object());
            //         set(form,'sizes',Array());
            //     break;
            //     case false:
            //     break;
            // }

            
            // if( !isEmpty(this.cartItem) ){
            //     this.selections.colour = this.product.colour_images.find( colour => colour.hex.includes(this.cartItem.hex) );
            //     this.selections.sizes  = this.cartItem.sizes.reduce((a, v) => { a[v.name] = this.cartItem.sizes.findIndex( val => val.name == v.name) ; return a; }, {});
            //     this.selections.hex    = clone(this.cartItem.hex);
            //     each(
            //         this.cartItem,
            //         (value,key) => {
            //             set(this.form,key,value);
            //         }
            //     );
            //     this.alreadyInCart();
            // }

            this.schemaShape.full_code  = yup.string().required("*Product is required."); // validate product code   
            this.schemaShape.price      = yup.number().required("*Price is required."); // validate product price
            this.schemaShape.image      = yup.string(); // validate product image
            this.schemaShape.name       = yup.string(); // validate product image

            this.formSchema             = yup.object().shape(this.schemaShape);  // Initialize validation

            this.form                   = cloneDeep(form); // Assign form data
        
        },   
        async alreadyInCart(){
            const { isConfirmed } = await this.$swal.fire({
                icon:  'question', // Set the icon to a question mark
                title: 'Shopping Cart', // Set the title of the dialog to 'Logout'
                text:  'This product has already been added to the shopping cart. Do you want to view the shopping cart?', // Set the text of the dialog
                showCancelButton: true, // Show a cancel button in the dialog
                confirmButtonText: 'Yes',
                cancelButtonText:  'No'
            });

            if( isConfirmed ){
                this.$router.push({ name: 'Cart' });
            }

            if( !isConfirmed ){
                this.$swal.close();
            }

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
                    
                    document.querySelector('meta[name="keywords"]')
                            .setAttribute(
                                'content',
                                `${document.querySelector('meta[name="keywords"]').attributes.content.value}, ${product.full_code}, ${product.name}`
                            );

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
        async getQuote(){
            try {
                this.loading.quote = Boolean(true);

                let { isSizeVariant, product, selections } = this;
                let data     = cloneDeep(this.form);
                let selected = product.__variants__.find( variant => selections.colour.code == variant.code_colour );

                if( has(selections,'colour') && !isEmpty(selections.colour.images) ){
                    data.image = selections.colour.images[0].urls[0].url;
                }

                if( isEmpty(selections.colour.images) && !isEmpty(this.product.images) ){
                    let image  = this.product.images.find( val => val.name == selected.full_code || `${product.full_code}_default`)
                    data.image = image.urls[0].url;
                }

                const { data:{ pdf } } = await this.$api.post(`/quotes`,data);

                this.downloadFile(pdf,`${moment().unix()}.pdf`);

                this.$toast.success('This product has been added to your cart.');

            } catch(error) {
                this.loading.quote = Boolean();
            } finally {
                this.loading.quote = Boolean();
            }
        },
        selectColour(colour,event){
            let target  = event.target;
            
            switch(target.classList.contains('active')){
                case true:
                    event.target.classList.remove('active');

                    this.selections.colour = Object();      
                    this.selections.code   = String();      
                    this.form.hex          = String();      
                    this.form.colour       = String();  

                    if( this.isSizeVariant ){
                        this.form.sizes.splice(0);
                        this.selections.sizes = Object();
                    }
                break;
                case false:
                    event.target.classList.add('active');

                    let variant = window.document.querySelector('.color-variant li.active');

                    if( !isNull(variant) ){ variant.classList.remove('active'); }

                    this.selections.colour = colour;      
                    this.selections.code   = colour.code;      
                    this.form.hex          = colour.hex;      
                    this.form.colour       = colour.name;  

                    if( this.isSizeVariant ){
                        if( !isEmpty(this.selections.sizes) ){
                            this.selections.sizes = Object();
                        }

                        if( !isEmpty(this.form.sizes) ){
                            this.form.sizes.splice(0);
                        }
                    }

                    // if( !this.isSizeVariant ){
                    //     let variant     = this.product.__variants__.find( (variant) => variant.code_colour_name.includes(colour.name.toUpperCase()) )
                    //     this.form.price = this.product.price;
                    // }
                    
                break;
            }
        },
        selectSize(variant,event){

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