<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h2>{{ product.productName }}</h2>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <nav aria-label="breadcrumb" class="theme-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#" @click="$router.push({ name: 'Home' })">Home</a></li>
                                <li class="breadcrumb-item"><a href="#" @click="$router.go(-1)">Products</a></li>
                                <li class="breadcrumb-item active" aria-current="page">{{ product.productName }}</li>
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
                        <div class="col-lg-6">
                            <div class="product-slick">
                                <div v-for="(image,index) in product.images" :key="index">
                                    <img :src="image.urls[0].url" alt="" class="img-fluid blur-up lazyload image_zoom_cls-0">
                                </div>        
                            </div>
                            <div class="row">
                                <div class="col-12 p-0">
                                    
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 rtl-text">
                            <div class="product-right">
                                <h2>{{ product.productName }}</h2>
                                <h3 class="price-detail">KSH {{ product.price }}</h3>
                                <div class="border-product">
                                    <ul class="color-variant p-0" v-show="!$isEmpty(product.colourImages)">
                                        <template v-for="(colour,index) in product.colourImages">
                                            <li   
                                                v-if="colour.name == cartItem.colour"                                       
                                                :key="`active_${index}`" 
                                                class="active"
                                                :ref="colour.code"                     
                                                :style="`background-color: ${ $convertToHex(colour.name) }`"                       
                                                @click="($event) => selectColour(colour,$event)"                        
                                            ></li>
                                            <li   
                                                v-if="colour.name != cartItem.colour"                                
                                                :key="`inactive_${index}`" 
                                                :style="`background-color: ${ $convertToHex(colour.name) }`" 
                                                :ref="colour.code"                   
                                                @click="($event) => selectColour(colour,$event)"                        
                                            ></li>
                                        </template>
                                    </ul>
                                    <h6> 
                                        Selected colour: 
                                        <span v-if="$has(errors,'colour')" class="text-danger">{{errors.colour}}</span>
                                        <span v-if="!$isEmpty(form.colour)"><strong>{{ form.colour }}</strong></span>
                                    </h6>	
                                </div>
                                <div id="selectSize" class="addeffect-section product-description border-product">
                                    <template v-if="isVariant && !$isEmpty(groupedSizeVariants)">
                                        <div class="row pb-2">
                                            <div class="col-12">
                                                <h6>
                                                    Selected size: 
                                                    <span v-if="$has(errors,'sizes')" class="text-danger mr-0">{{errors.sizes}}</span>
                                                    <span v-if="!$isEmpty(form.sizes)" class="mr-0"><strong>{{ form.sizes.map( size => size.name ).join(',') }}</strong></span>
                                                </h6>
                                            </div>                                            
                                            <div class="col-md-6 py-2" v-for="(variant,sizeName) of groupedSizeVariants" :key="sizeName">
                                                <div class="quantity-box">
                                                    <div class="input-group">
                                                        <span class="input-group-prepend">
                                                            <button class="btn" @click="selectSize(variant,sizeName,$event)" :disabled="stock[sizeName] == 0 || $isEmpty(selections.colour)">{{ sizeName }}</button>
                                                        </span>
                                                        <input type="number" :name="`quantity_${sizeName}`" class="form-control input-number" :disabled="stock[sizeName] == 0 || $isEmpty(selections.colour)" v-if="!$has(sizeKeys,sizeName)" value="0"> 
                                                        <input type="number" :name="`quantity_${sizeName}`" class="form-control input-number" :disabled="stock[sizeName] == 0 || $isEmpty(selections.colour)" v-if="$has(sizeKeys,sizeName)" v-model="form.sizes[sizeKeys[sizeName]].quantity" value="0"> 
                                                    </div>
                                                </div>
                                                <div class="text-center">
                                                    <h6 v-if="!$isEmpty(selections.colour)" class="mb-0">Stock Available: {{ stock[sizeName] }}</h6>
                                                </div>                                
                                            </div>
                                        </div>
                                    </template>
                                    <template v-if="!isVariant">
                                        <h6 class="product-title">quantity</h6>
                                        <div class="qty-box">
                                            <div class="input-group">
                                                <span class="input-group-prepend">
                                                    <button type="button" class="btn quantity-left-minus" data-type="minus" data-field="" @click="() => descreaseQuantity()">
                                                        <i class="ti-angle-left"></i>
                                                    </button> 
                                                </span>
                                                <input type="text" :name="`quantity_${product.fullCode}`" class="form-control input-number" :value="form.quantity"> 
                                                <span class="input-group-prepend">
                                                    <button type="button" class="btn quantity-right-plus" data-type="plus" data-field="" @click="() => increaseQuantity()">
                                                        <i class="ti-angle-right"></i>
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <div class="product-buttons">
                                    <div class="d-flex">
                                        <div>
                                            <button class="btn btn-solid hover-solid btn-animation" :disabled="isDisabled || !$isEmpty(cartItem)" @click="addToCart">
                                                <i class="fa fa-shopping-cart me-1" aria-hidden="true"></i>
                                                <span v-show="!$isEmpty(cartItem) == false">add to cart</span>
                                                <span v-show="!$isEmpty(cartItem) == true">already in cart</span> 
                                            </button>                                             
                                        </div>
                                        <div class="px-4">
                                            <template v-if="$isEmpty($store.getters.auth)">
                                                <button class="btn btn-solid btn-animation" :disabled="isDisabled" data-toggle="tooltip" data-placement="top" title="You need to login.">
                                                    <i class="fa fa-bookmark fz-16 me-2" aria-hidden="true"></i>
                                                    wishlist
                                                </button>    
                                            </template>
                                            <template v-else>
                                                <button class="btn btn-solid btn-animation" :disabled="isDisabled || !$isEmpty(favourite)" @click="addToFavourites()">
                                                    <i v-show="!loading.wishlist" class="fa fa-bookmark fz-16 me-2" aria-hidden="true"></i>
                                                    <i v-show="loading.wishlist" class="fa fa-spinner fa-spin"></i>
                                                    <span v-show="$isEmpty(favourite)">Wishlist</span>
                                                    <span v-show="!$isEmpty(favourite)">Already in wishlist</span>
                                                </button>    
                                            </template>                                        
                                        </div>
                                    </div>
                                </div>
                                <div class="border-product">
                                    <div class="slider-nav">
                                        <div v-for="(image,index) in product.images" :key="index">
                                            <img :src="image.urls[0].url" alt="" class="img-fluid blur-up lazyload">
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
                            <li class="nav-item"><a class="nav-link" id="profile-top-tab" data-bs-toggle="tab"
                                    href="#top-profile" role="tab" aria-selected="false"><i
                                        class="icofont icofont-man-in-glasses"></i>Specification</a>
                                <div class="material-border"></div>
                            </li>
                            <li class="nav-item"><a class="nav-link" id="review-top-tab" data-bs-toggle="tab"
                                    href="#top-review" role="tab" aria-selected="false"><i
                                        class="icofont icofont-contacts"></i>Write Review</a>
                                <div class="material-border"></div>
                            </li>
                        </ul>
                        <div class="tab-content nav-material" id="top-tabContent">
                            <div class="tab-pane fade show active" id="top-home" role="tabpanel"
                                aria-labelledby="top-home-tab">
                                <div class="product-tab-discription">
                                    <div class="part" v-html="product.description">
                                    </div>
                                    <div class="part">
                                        <h5 class="inner-title">fabric:</h5>
                                        <p>Art silk is manufactured by synthetic fibres like rayon. It's light in weight and
                                            is soft on the skin for comfort in summers.Art silk is manufactured by synthetic
                                            fibres like rayon. It's light in weight and is soft on the skin for comfort in
                                            summers.</p>
                                    </div>
                                    <div class="part">
                                        <h5 class="inner-title">size & fit:</h5>
                                        <p>The model (height 5'8") is wearing a size S</p>
                                    </div>
                                    <div class="part">
                                        <h5 class="inner-title">Material & Care:</h5>
                                        <p>Top fabric: pure cotton</p>
                                        <p>Bottom fabric: pure cotton</p>
                                        <p>Hand-wash</p>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="top-profile" role="tabpanel" aria-labelledby="profile-top-tab">
                                <p>The Model is wearing a white blouse from our stylist's collection, see the image for a
                                    mock-up of what the actual blouse would look like.it has text written on it in a black
                                    cursive language which looks great on a white color.</p>
                                <div class="single-product-tables">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Sleeve Length</td>
                                                <td>Sleevless</td>
                                            </tr>
                                            <tr>
                                                <td>Neck</td>
                                                <td>Round Neck</td>
                                            </tr>
                                            <tr>
                                                <td>Occasion</td>
                                                <td>Sports</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Fabric</td>
                                                <td>Polyester</td>
                                            </tr>
                                            <tr>
                                                <td>Fit</td>
                                                <td>Regular Fit</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="top-review" role="tabpanel" aria-labelledby="review-top-tab">
                                <form class="theme-form">
                                    <div class="form-row row">
                                        <div class="col-md-12">
                                            <div class="media">
                                                <label>Rating</label>
                                                <div class="media-body ms-3">
                                                    <div class="rating three-star"><i class="fa fa-star"></i> <i
                                                            class="fa fa-star"></i> <i class="fa fa-star"></i> <i
                                                            class="fa fa-star"></i> <i class="fa fa-star"></i></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="name">Name</label>
                                            <input type="text" class="form-control" id="name" placeholder="Enter Your name"
                                                required>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="email">Email</label>
                                            <input type="text" class="form-control" id="email" placeholder="Email" required>
                                        </div>
                                        <div class="col-md-12">
                                            <label for="review">Review Title</label>
                                            <input type="text" class="form-control" id="review"
                                                placeholder="Enter your Review Subjects" required>
                                        </div>
                                        <div class="col-md-12">
                                            <label for="review">Review Title</label>
                                            <textarea class="form-control" placeholder="Wrire Your Testimonial Here"
                                                id="exampleFormControlTextarea1" rows="6"></textarea>
                                        </div>
                                        <div class="col-md-12">
                                            <button class="btn btn-solid" type="submit">Submit YOur
                                                Review</button>
                                        </div>
                                    </div>
                                </form>
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
                    <div class="col-xl-2 col-md-4 col-6">
                        <div class="product-box">
                            <div class="img-wrapper">
                                <div class="front">
                                    <a href="#"><img src="/assets/home/images/pro3/33.jpg"
                                            class="img-fluid blur-up lazyload bg-img" alt=""></a>
                                </div>
                                <div class="back">
                                    <a href="#"><img src="/assets/home/images/pro3/34.jpg"
                                            class="img-fluid blur-up lazyload bg-img" alt=""></a>
                                </div>
                                <div class="cart-info cart-wrap">
                                    <button data-bs-toggle="modal" data-bs-target="#addtocart" title="Add to cart"><i
                                            class="ti-shopping-cart"></i></button> <a href="javascript:void(0)"
                                        title="Add to Wishlist"><i class="ti-heart" aria-hidden="true"></i></a> <a href="#"
                                        data-bs-toggle="modal" data-bs-target="#quick-view" title="Quick View"><i
                                            class="ti-search" aria-hidden="true"></i></a> <a href="compare.html"
                                        title="Compare"><i class="ti-reload" aria-hidden="true"></i></a>
                                </div>
                            </div>
                            <div class="product-detail">
                                <div class="rating"><i class="fa fa-star"></i> <i class="fa fa-star"></i> <i
                                        class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i>
                                </div>
                                <a href="product-page(no-sidebar).html">
                                    <h6>Slim Fit Cotton Shirt</h6>
                                </a>
                                <h4>$500.00</h4>
                                <ul class="color-variant">
                                    <li class="bg-light0"></li>
                                    <li class="bg-light1"></li>
                                    <li class="bg-light2"></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- product section end -->


    </div>
</template>

<script>
import { cloneDeep, debounce, each, groupBy, isEmpty, isNull, keys, has, omit, set, min } from 'lodash';
import * as yup from "yup";
import convertCssColorNameToHex from 'convert-css-color-name-to-hex';
export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fetchProduct(),
            next();
        });
    },
    computed:{
        cart:{
            get(){
                return this.$store.getters.cart;
            },
            set(value){
                this.$store.commit('cart',value);
            }
        },
        cartItem(){
            return this.cart.find( val => val.code == this.product.fullCode ) ?? {};
        },
        groupedSizeVariants(){
            return groupBy(this.product.variants,'codeSizeName');
        },
        isVariant(){
            return !isEmpty(this.product) ? !isEmpty(this.product.variants.filter( val => !isNull(val.codeSizeName) )) : false
        }
    },
    created(){
        this.$isEmpty      = isEmpty;
        this.$isNull       = isNull;
        this.$has          = has;
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
            errors:      Object(),
            favourite:   Object(),
            form:        Object(),
            isDisabled:  Boolean(),
            loading:     {
                wishlist: Boolean()
            },
            product:     Object(),
            stock:       Object(),
            schemaShape: Object(),
            sizeKeys:    Object(),
            selections:  {
                colour: Object(),
                size:   Object()
            }
        }
    },
    methods:{
        addToCart(){
            let { isVariant, product, selections } = this;
            let data     = cloneDeep(this.form);
            let selected = product.variants.find( value => selections.colour.code == value.codeColour );

            data.price = product.price;
            data.name  = product.productName;

            if( has(selections,'colour') && !isEmpty(selections.colour.images) ){
                data.image = selections.colour.images[0].urls[0].url;
            }

            if( isEmpty(selections.colour.images) && !isEmpty(this.product.images) ){
                let image  = this.product.images.find( val => val.name == selected.fullCode || `${this.$route.params.code}_default`)
                console.log(image);
                data.image = image.urls[0].url;
            }

            this.cart.push(cloneDeep(data));
        },
        addQuantity(event){
            this.form.sizes[this.sizeKeys[sizeName]].quantity = event.target.value;
        },
        addToFavourites(){
            this.loading.wishlist = true; // Set loader
            let form = cloneDeep({ product_code: this.product.fullCode,content: this.form }); // Refactor form data
            // Add this product to wishlist
            this.$api
                .post('favourites',form)
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
            let isVariant = !isEmpty(product) ? !isEmpty(product.variants.filter( val => !isNull(val.codeSizeName) )) : false;
            
            this.product  = cloneDeep(product);

            $(`input[name="quantity_${product.fullCode}"]`).val(1);

            set(this.form,'code',String());
            set(this.form,'price',String());
            set(this.form,'colour',String());

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
                    set(this.selections,'size',Object());
                    set(this.form,'sizes',Array());
                break;
                case false:
                    // Check if product has variants and add validation of quantity if empty
                    this.schemaShape.quantity = yup.number().required("*Quantity is required.");       
                    set(this.form,'quantity',Number(1));
                break;
            }
            
            this.schemaShape.code     = yup.string().required("*Product code is required."); // validate product code   
            this.schemaShape.colour   = yup.string().required("*Colour is required."); // validate product colour
            this.schemaShape.price    = yup.number().required("*Price is required."); // validate product price

            set(this.selections,'colour',Object()); // Initialize colour selection
            
            this.formSchema           = yup.object().shape(this.schemaShape);  // Initialize validation
            this.form.code            = product.fullCode;
            this.form.price           = product.price;

            // this.fetchColourStock(product); // Fetch colour stock           
        },        
        descreaseQuantity(){
            let quantity = parseInt($(`input[name="quantity_${this.product.fullCode}"]`).val());
            if( quantity != 1 ){
                const total  = quantity -= 1;   
                $(`input[name="quantity_${this.product.fullCode}"]`).val(total);
                this.form.quantity = total;
            }
        },
        increaseQuantity(){
            let quantity = parseInt($(`input[name="quantity_${this.product.fullCode}"]`).val());
            const total  = quantity += 1;
            $(`input[name="quantity_${this.product.fullCode}"]`).val(total);          
            this.form.quantity = total;
        },
        // Fetch colour stock
        // Requires product 
        fetchColourStock(product){
            // Promise call for all colour images
            Promise.all( product.colourImages.map( colour => this.fetchStock(`${this.product.fullCode}-${colour.code}`)) )
                   .then( (colours) => {
                        colours.forEach( ({ data:{ stock }}) => {
                            this.stock[stock.colourCode] = stock.stock;
                            console.log(this.stock[stock.colourCode]);
                            if( stock.stock == 0 ){
                                this.$refs[stock.colourCode][0].classList.add('inactive');
                            }
                        });
                   });
        },
        fetchProduct(){
            this.$store.commit('loader',true); // Set loader
            const { $route: { params: { product } } } = this; // Destructor route params
            // Fetch product details
            this.$api.put(`/products/${product}`)
                .then( ({ data:{ product, favourite }}) => {
                    this.favourite = cloneDeep(favourite);
                    this.initView(product);
                })
                .catch( ({ response }) => {
                    this.$store.commit('loader',false);
                })
                .finally( () => {
                    this.initScripts();
                });            
        },
        fetchStock(code){
            return this.$api.put(`/products/stock/${code}`); // Fetch stock from an item full code
        },
        selectColour(colour,event){
            let variant = window.document.querySelector('.color-variant li.active');
            if( !isNull(variant) ){ variant.classList.remove('active'); }
            event.target.classList.add('active');
            this.selections.colour = colour;      
            this.form.colour       = colour.name;  
        },
        selectSize(variants, size, event){
            // Check if colour has been selected
            if( has(this.errors,'colour') ){
                this.$toast.warning('Select colour.');
            }

            if( !has(this.errors,'colour') ){
                let { selections: { colour } } = this;
                let selectedVariant            = variants.find( variant => variant.codeColour == colour.code );
                
                if( isEmpty( this.form.sizes.find( size => size.name == selectedVariant.codeSize) ) ){
                    this.form.sizes.push({
                        name:     selectedVariant.codeSize,
                        quantity: Number(1)
                    })
                    $(event.target).parent().addClass('active');
                    this.sizeKeys[size] = (this.form.sizes.length - 1);
                } else {
                    this.form.sizes = this.form.sizes.filter( size => size.name != selectedVariant.codeSize );
                    $(event.target).parent().removeClass('active');
                    this.sizeKeys = omit(this.sizeKeys,[size]);
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
        "selections.colour": {
            /**
             * Watches for changes in the 'selections.colour' property and fetches stock for all variants of the selected colour.
             *
             * @param {Object} value - The selected colour object.
             */
            async handler(value){
                // If a colour is selected, fetch stock for all variants of the selected colour
                if( !isEmpty(value) && !isEmpty(this.groupedSizeVariants) ){         
                    
                    try {
                        // Fetch stock for all variants of the selected colour
                        let variants = await Promise.all(keys(this.groupedSizeVariants).map( async (variant) => await this.fetchStock(`${this.product.fullCode}-${value.code}-${variant}`) ));

                        // Update the stock object with the fetched stock for each variant
                        variants.forEach( ({ data: { code, stock }}) => {
                            set(this.stock,code.replace(`${this.product.fullCode}-${value.code}-`,''),stock.stock);
                        });

                    } catch(error) {

                    }
                }
            },
            deep: true
        }
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