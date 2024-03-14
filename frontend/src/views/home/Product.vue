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
                                <div class="rating-section">
                                    <div class="rating"><i class="fa fa-star"></i> <i class="fa fa-star"></i> <i
                                            class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i>
                                    </div>
                                </div>
                                <h3 class="price-detail">KSH {{ product.price }}</h3>
                                <ul class="color-variant p-0" v-show="!$isEmpty(product.colourImages)">
                                    <template v-for="(colour,index) in product.colourImages">
                                        <li   
                                            v-if="colour.name == cartItem.colour"                                       
                                            :key="`active_${index}`" 
                                            class="active"
                                            :style="`background-color: ${ $convertToHex(colour.name) }`"                       
                                            @click="($event) => selectColour(colour,$event)"                        
                                        ></li>
                                        <li   
                                            v-else                                  
                                            :key="`inactive_${index}`" 
                                            :style="`background-color: ${ $convertToHex(colour.name) }`"                       
                                            @click="($event) => selectColour(colour,$event)"                        
                                        ></li>
                                    </template>
                                </ul>
								<h6> 
                                    Selected colour: 
                                    <span v-if="$has(errors,'colour')" class="text-danger">{{errors.colour}}</span>
                                    <span v-if="!$isEmpty(form.colour)"><strong>{{ form.colour }}</strong></span>
                                </h6>	
                                <div id="selectSize" class="addeffect-section product-description border-product">
                                    <!-- <h6 class="product-title size-text">select size <span><a href="" data-bs-toggle="modal"
                                                data-bs-target="#sizemodal">size
                                                chart</a></span></h6>
                                    <div class="modal fade" id="sizemodal" tabindex="-1" role="dialog"
                                        aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="exampleModalLabel">Sheer
                                                        Straight Kurta</h5>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                        aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                                </div>
                                                <div class="modal-body"><img src="/assets/images/size-chart.jpg" alt=""
                                                        class="img-fluid blur-up lazyload"></div>
                                            </div>
                                        </div>
                                    </div> -->
                                    <!-- <h6 class="error-message">please select size</h6> -->
                                    <!-- <div class="size-box">
                                        <ul>
                                            <li><a href="javascript:void(0)">s</a></li>
                                            <li><a href="javascript:void(0)">m</a></li>
                                            <li><a href="javascript:void(0)">l</a></li>
                                            <li><a href="javascript:void(0)">xl</a></li>
                                        </ul>
                                    </div> -->
                                    <template v-if="isVariant && !$isEmpty(groupedVariants)">
                                        <div class="size-box">
                                            <ul>
                                                <li v-for="(variant,sizeName) of groupedVariants" :key="sizeName" class="my-2 p-2">
                                                    <a href="#" @click.prevent="console.log(sizeName)">{{ sizeName }}</a>
                                                </li>
                                            </ul>
                                            <p class="text-danger col col-12 mt-0" v-if="$has(errors,'size')">{{errors.size}}</p>								
                                        </div>    
                                    </template>                               
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
                                </div>
                                <div class="product-buttons">
                                    <button id="cartEffect" class="btn btn-solid hover-solid btn-animation" :disabled="isDisabled || !$isEmpty(cartItem)" @click="addToCart">
                                        <i class="fa fa-shopping-cart me-1" aria-hidden="true"></i>
                                        <span v-show="!$isEmpty(cartItem) == false">add to cart</span>
                                        <span v-show="!$isEmpty(cartItem) == true">already in cart</span> 
                                    </button> 
                                    <a href="#" class="btn btn-solid">
                                        <i class="fa fa-bookmark fz-16 me-2" aria-hidden="true"></i>
                                        wishlist
                                    </a>
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
                                    <a href="#"><img src="/assets/images/pro3/33.jpg"
                                            class="img-fluid blur-up lazyload bg-img" alt=""></a>
                                </div>
                                <div class="back">
                                    <a href="#"><img src="/assets/images/pro3/34.jpg"
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
                    <div class="col-xl-2 col-md-4 col-6">
                        <div class="product-box">
                            <div class="img-wrapper">
                                <div class="front">
                                    <a href="#"><img src="/assets/images/pro3/1.jpg"
                                            class="img-fluid blur-up lazyload bg-img" alt=""></a>
                                </div>
                                <div class="back">
                                    <a href="#"><img src="/assets/images/pro3/2.jpg"
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
                    <div class="col-xl-2 col-md-4 col-6">
                        <div class="product-box">
                            <div class="img-wrapper">
                                <div class="front">
                                    <a href="#"><img src="/assets/images/pro3/27.jpg"
                                            class="img-fluid blur-up lazyload bg-img" alt=""></a>
                                </div>
                                <div class="back">
                                    <a href="#"><img src="/assets/images/pro3/28.jpg"
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
                    <div class="col-xl-2 col-md-4 col-6">
                        <div class="product-box">
                            <div class="img-wrapper">
                                <div class="front">
                                    <a href="#"><img src="/assets/images/pro3/35.jpg"
                                            class="img-fluid blur-up lazyload bg-img" alt=""></a>
                                </div>
                                <div class="back">
                                    <a href="#"><img src="/assets/images/pro3/36.jpg"
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
                    <div class="col-xl-2 col-md-4 col-6">
                        <div class="product-box">
                            <div class="img-wrapper">
                                <div class="front">
                                    <a href="#"><img src="/assets/images/pro3/2.jpg"
                                            class="img-fluid blur-up lazyload bg-img" alt=""></a>
                                </div>
                                <div class="back">
                                    <a href="#"><img src="/assets/images/pro3/1.jpg"
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
                    <div class="col-xl-2 col-md-4 col-6">
                        <div class="product-box">
                            <div class="img-wrapper">
                                <div class="front">
                                    <a href="#"><img src="/assets/images/pro3/28.jpg"
                                            class="img-fluid blur-up lazyload bg-img" alt=""></a>
                                </div>
                                <div class="back">
                                    <a href="#"><img src="/assets/images/pro3/27.jpg"
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
import { cloneDeep, debounce, each, groupBy, isEmpty, isNull, has } from 'lodash';
import * as yup from "yup";
import convertCssColorNameToHex from 'convert-css-color-name-to-hex';
export default {
    beforeMount(){
        this.initView();               
    }, 
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
        groupedVariants(){
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
    },
    data(){
        return{
            errors:      {},
            form:        {},
            isDisabled:  false,
            product:     {},
            schemaShape: {},
            selections:  {},
        }
    },
    methods:{
        addToCart(){
            let { product, selections } = this, data = cloneDeep(this.form);
            if( has(selections,'colour') ){
                data.image = selections.colour.images[0].urls[0].url;
                data.price = product.price;
                data.name  = product.productName;
            }
            this.cart.push(cloneDeep(data));
        },
        close(){
            this.initView();
        },
        initView(){
            $(`input[name="quantity_${this.product.fullCode}"]`).val(1);
            if( this.isVariant ){
                this.form.size        = String();        
                this.schemaShape.size = yup.string().required("*Size is required.");  
                this.selections.size  = {};      
            }
            this.form.colour          = String();
            this.form.code            = String();
            this.form.quantity        = 1;
            this.schemaShape.code     = yup.string().required("*Product code is required.");       
            this.schemaShape.colour   = yup.string().required("*Colour is required.");       
            this.schemaShape.quantity = yup.number().required("*Quantity is required.");       
            this.schemaShape.price    = yup.number().required("*Price is required.");       
            this.selections.colour    = {};      
            this.formSchema           = yup.object().shape(this.schemaShape); 
            this.validateForm = (field) => {
                this.formSchema.validateAt(field, this.form)
                    .then((value,key) => {
                        delete this.errors[field];
                    })
                    .catch((err) => {
                        this.errors[err.path] = err.message;
                    })
                    .finally(() => {
                        this.isDisabled = !isEmpty(this.errors);
                    })
            }  
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
        fetchProduct(){
            this.$store.commit('loader',true);
            const { $route: { params: { product } } } = this;
            this.$api.put(`/products/${product}`)
                .then( ({ data:{ product }}) => {
                    this.form.code  = product.fullCode;
                    this.form.price = product.price;
                    this.product    = cloneDeep(product);
                })
                .catch( ({ response }) => {
                    this.$store.commit('loader',false);
                })
                .finally( () => {
                    this.$store.commit('loader',false);
                    this.initScripts();
                });            
        },
        selectColour(colour,event){
            let variant = window.document.querySelector('.color-variant li.active');
            if( !isNull(variant) ){ variant.classList.remove('active'); }
            event.target.classList.add('active');
            this.selections.colour = colour;      
            this.form.colour       = colour.name;  
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

            $('.product-right-slick').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                fade: true,
                asNavFor: '.slider-right-nav'
            });

            if ($(window).width() > 575) {
                $('.slider-right-nav').slick({
                    vertical: true,
                    verticalSwiping: true,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    asNavFor: '.product-right-slick',
                    arrows: false,
                    infinite: true,
                    dots: false,
                    centerMode: false,
                    focusOnSelect: true
                });
            } else {
                $('.slider-right-nav').slick({
                    vertical: false,
                    verticalSwiping: false,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    asNavFor: '.product-right-slick',
                    arrows: false,
                    infinite: true,
                    centerMode: false,
                    dots: false,
                    focusOnSelect: true,
                    responsive: [{
                        breakpoint: 576,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1
                        }
                    }]
                });
            }

            $('.center-slider-slick').slick({
                slidesToShow: 4,
                infinite: false,
                responsive: [{
                        breakpoint: 768,
                        settings: {
                            arrows: false,
                            centerMode: true,
                            centerPadding: '40px',
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            arrows: false,
                            centerMode: true,
                            centerPadding: '40px',
                            slidesToShow: 1
                        }
                    }
                ]
            });

            $('.animated-nav').slick({
                vertical: false,
                slidesToShow: 3,
                slidesToScroll: 1,
                asNavFor: '.product-slick-animated',
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
                },
                500
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
        }
    }
}
</script>