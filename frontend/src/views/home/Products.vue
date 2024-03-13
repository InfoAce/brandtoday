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
                        <div class="collection-content col">
                            <div class="page-main-content">
                                <div class="collection-product-wrapper">
                                    <div class="product-top-filter">
                                        <div class="row">
                                            <div class="col-12">
                                                <div class="product-filter-content">
                                                    <div class="search-count">
                                                        <h5>Showing Products 1-{{ products.total }}</h5>
                                                    </div>
                                                    <div class="collection-view">
                                                        <ul>
                                                            <li><i class="fa fa-th grid-layout-view"></i></li>
                                                            <li><i class="fa fa-list-ul list-layout-view"></i></li>
                                                        </ul>
                                                    </div>
                                                    <div class="collection-grid-view">
                                                        <ul>
                                                            <li><img src="/assets/images/icon/2.png" alt=""
                                                                    class="product-2-layout-view"></li>
                                                            <li><img src="/assets/images/icon/3.png" alt=""
                                                                    class="product-3-layout-view"></li>
                                                            <li><img src="/assets/images/icon/4.png" alt=""
                                                                    class="product-4-layout-view"></li>
                                                            <li><img src="/assets/images/icon/6.png" alt=""
                                                                    class="product-6-layout-view"></li>
                                                        </ul>
                                                    </div>
                                                    <div class="product-page-per-view">
                                                        <select>
                                                            <option value="High to low">24 Products Par Page</option>
                                                            <option value="Low to High">50 Products Par Page</option>
                                                            <option value="Low to High">100 Products Par Page</option>
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
                                        <div class="row margin-res">
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
                                                            <div class="rating">
                                                                <i class="fa fa-star"></i> 
                                                                <i class="fa fa-star"></i> 
                                                                <i class="fa fa-star"></i> 
                                                                <i class="fa fa-star"></i> 
                                                                <i class="fa fa-star"></i>
                                                            </div>
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
                                                <QuickView :data="product" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="product-pagination">
                                        <div class="theme-paggination-block">
                                            <div class="row">
                                                <div class="col-xl-6 col-md-6 col-sm-12">
                                                    <nav aria-label="Page navigation">
                                                        <ul class="pagination">
                                                            <li class="page-item"><a class="page-link" href="#"
                                                                    aria-label="Previous"><span aria-hidden="true"><i
                                                                            class="fa fa-chevron-left"
                                                                            aria-hidden="true"></i></span> <span
                                                                        class="sr-only">Previous</span></a></li>
                                                            <li class="page-item active"><a class="page-link" href="#">1</a>
                                                            </li>
                                                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                                                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                                                            <li class="page-item"><a class="page-link" href="#"
                                                                    aria-label="Next"><span aria-hidden="true"><i
                                                                            class="fa fa-chevron-right"
                                                                            aria-hidden="true"></i></span> <span
                                                                        class="sr-only">Next</span></a></li>
                                                        </ul>
                                                    </nav>
                                                </div>
                                                <div class="col-xl-6 col-md-6 col-sm-12">
                                                    <div class="product-search-count-bottom">
                                                        <h5>Showing Products 1-{{ products.total }}</h5>
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
<script>
import { cloneDeep, isEmpty, has } from 'lodash';
import { QuickView } from '../../components';
import convertCssColorNameToHex from 'convert-css-color-name-to-hex';
export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fetchProducts(),
            next();
        });
    },
    beforeRouteUpdate(to, from, next){
        next(vm => {
            vm.fetchProducts(),
            next();
        });
    },
    components:{
        QuickView
    },
    created(){
        this.$isEmpty = isEmpty;
        this.$convertToHex = (colour) => {
            return convertCssColorNameToHex(colour.toLowerCase().split(' ').join(""));
        }
    },
    data(){
        return{
            products: Array()
        }
    },
    methods:{
        fetchProducts(){
            let {  $route: { params } } = this, url = `/products`;

            this.$store.commit('loader',true);

            if( !isEmpty(params) && has(params,'category') && !isEmpty(params.category) ){
                url = `${url}?category=${params.category}`;
            }
            
            this.$api.get(url)
                .then( ({ data:{ products }}) => {
                    this.products = cloneDeep(products);
                })
                .catch( ({ response }) => {
                    this.$store.commit('loader',false);
                    if( !isEmpty(response.data) && response.data.statusCode == 400 ){
                        response.data.message.forEach( (value) => {
                            toast.info(value);
                        });
                    }
                })
                .finally( () => {
                    this.$store.commit('loader',false);
                });            
        },
        toBase64(string){
            return btoa(string);
        } 
    },
    watch:{
        "$route.params":{
            handler(){
                this.fetchProducts();
            },
            deep: true
        }
    }
}
</script>