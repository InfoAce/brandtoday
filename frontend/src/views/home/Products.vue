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
                                                        <h5 v-show="!$isEmpty(products)">Showing Products 1-{{ products.total }}</h5>
                                                        <h5 v-show="$isEmpty(products)">Showing Products 0</h5>
                                                    </div>
                                                    <div class="collection-view">
                                                        <ul>
                                                            <li><i class="fa fa-th grid-layout-view"></i></li>
                                                            <li><i class="fa fa-list-ul list-layout-view"></i></li>
                                                        </ul>
                                                    </div>
                                                    <div class="collection-grid-view">
                                                        <ul>
                                                            <li><img src="/assets/home/images/icon/2.png" alt=""
                                                                    class="product-2-layout-view"></li>
                                                            <li><img src="/assets/home/images/icon/3.png" alt=""
                                                                    class="product-3-layout-view"></li>
                                                            <li><img src="/assets/home/images/icon/4.png" alt=""
                                                                    class="product-4-layout-view"></li>
                                                            <li><img src="/assets/home/images/icon/6.png" alt=""
                                                                    class="product-6-layout-view"></li>
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
                                        <div class="row margin-res" v-show="$isEmpty(products.data)">
                                            
                                        </div>
                                        <div class="row margin-res" v-show="!$isEmpty(products.data)">
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
                                        <a href="#" @click.prevent="loadMore($event)">load more</a>
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
export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fetchData(),
            next();
        });
    },
    beforeRouteUpdate(to, from, next){
        next(vm => {
            vm.fetchProducts(),
            next();
        });
    },
    created(){
        this.$isEmpty = isEmpty;
        this.$times   = times;
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
        fetchData(){
            this.products = cloneDeep({});
            this.fetchProducts();
        },
        fetchProducts(data = { page: 1, perPage: 10 }){
            let {  $route: { params } } = this, url = `/products`, { page, perPage } = data;
            console.log( atob(params.category) );
            this.$store.commit('loader',true);

            if( !isEmpty(params) && has(params,'category') && !isEmpty(params.category) ){
                url = `${url}?category=${params.category}`;
            }

            url += `&page=${page}&perPage=${perPage}`;
            
            this.$api.get(url)
                .then( ({ data:{ products }}) => {
                    if( !isEmpty(this.products) ){
                        this.products.data = cloneDeep(this.products.data.concat(products.data));
                        this.products.currentPage = products.currentPage;
                    }
                    if( isEmpty(this.products) ){
                        this.products = cloneDeep(products);            
                    }
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
        loadMore(event){

            let { products: { currentPage, perPage, totalPages } } = this, 
            page                          = currentPage < totalPages ? 
                                                currentPage + 1 : 
                                                    null;

            if( !isNull(page) ){
                this.fetchProducts({ page, perPage });
            }

            if( isNull(page) ){
                $(event.target).text('No more products.');
            }

        }
    },
    watch:{
        "$route.params":{
            handler(value){
                this.fetchData();
            },
            deep: true
        }
    }
}
</script>