<template>
    <div>
        <!-- loader start -->
        <div class="loader_skeleton" v-show="$store.getters.loader">
            <header>
                <div class="top-header d-none d-sm-block">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="header-contact">
                                    <ul>
                                        <li>Welcome to Our store Multikart</li>
                                        <li><i class="fa fa-phone" aria-hidden="true"></i>Call Us: 123 - 456 - 7890</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-lg-6 text-end">
                                <ul class="header-dropdown">
                                    <li class="mobile-wishlist"><a href="#"><i class="fa fa-heart"
                                                aria-hidden="true"></i></a>
                                    </li>
                                    <li class="onhover-dropdown mobile-account">
                                        <i class="fa fa-user" aria-hidden="true"></i> My Account
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="main-menu">
                                <div class="menu-left">
                                    <div class="navbar">
                                        <a href="javascript:void(0)">
                                            <div class="bar-style"><i class="fa fa-bars sidebar-bar" aria-hidden="true"></i>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="brand-logo">
                                        <a href="index.html"><img src="/assets/images/icon/logo.png"
                                                class="img-fluid blur-up lazyload" alt=""></a>
                                    </div>
                                </div>
                                <div class="menu-right pull-right">
                                    <div>
                                        <nav>
                                            <div class="toggle-nav"><i class="fa fa-bars sidebar-bar"></i></div>
                                            <ul class="sm pixelstrap sm-horizontal">
                                                <li>
                                                    <div class="mobile-back text-end">Back<i class="fa fa-angle-right ps-2"
                                                            aria-hidden="true"></i></div>
                                                </li>
                                                <li>
                                                    <a href="index.html">Home</a>
                                                </li>
                                                <li>
                                                    <a href="#">feature<div class="lable-nav">new</div></a>
                                                </li>
                                                <li>
                                                    <a href="#">shop</a>
                                                </li>
                                                <li>
                                                    <a href="#">product</a>
                                                </li>
                                                <li>
                                                    <a href="#">pages</a>
                                                </li>
                                                <li><a href="#">blog</a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                    <div>
                                        <div class="icon-nav d-none d-sm-block">
                                            <ul>
                                                <li class="onhover-div mobile-search">
                                                    <div><img src="/assets/images/icon/search.png" onclick="openSearch()"
                                                            class="img-fluid blur-up lazyload" alt=""> <i class="ti-search"
                                                            onclick="openSearch()"></i></div>
                                                </li>
                                                <li class="onhover-div mobile-setting">
                                                    <div><img src="/assets/images/icon/setting.png"
                                                            class="img-fluid blur-up lazyload" alt=""> <i
                                                            class="ti-settings"></i></div>
                                                </li>
                                                <li class="onhover-div mobile-cart">
                                                    <div><img src="/assets/images/icon/cart.png"
                                                            class="img-fluid blur-up lazyload" alt=""> <i
                                                            class="ti-shopping-cart"></i></div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div class="breadcrumb-section">
                <div class="container">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="page-title">
                                <h2>collection</h2>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <nav aria-label="breadcrumb" class="theme-breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a href="index.html">home</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">collection</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <section class="section-b-space ratio_asos">
                <div class="collection-wrapper">
                    <div class="container">
                        <div class="row">
                            <div class="col-sm-3 collection-filter">
                                <!-- side-bar colleps block stat -->
                                <div class="collection-filter-block">
                                    <div class="filter-block">
                                        <h4 class="title-ldr"></h4>
                                        <ul>
                                            <li></li>
                                            <li></li>
                                            <li></li>
                                            <li></li>
                                        </ul>
                                    </div>
                                    <div class="filter-block">
                                        <h4 class="title-ldr"></h4>
                                        <ul>
                                            <li></li>
                                            <li></li>
                                            <li></li>
                                            <li></li>
                                        </ul>
                                    </div>
                                    <div class="filter-block">
                                        <h4 class="title-ldr"></h4>
                                        <ul>
                                            <li></li>
                                            <li></li>
                                            <li></li>
                                            <li></li>
                                        </ul>
                                    </div>
                                </div>
                                <!-- silde-bar colleps block end here -->
                                <!-- side-bar single product slider start -->
                                <div class="theme-card">
                                    <h5 class="title-border"></h5>
                                    <div>
                                        <div class="product-box">
                                            <div class="media">
                                                <div class="img-wrapper"></div>
                                                <div class="media-body align-self-center">
                                                    <div class="product-detail">
                                                        <h4></h4>
                                                        <h6></h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="product-box">
                                            <div class="media">
                                                <div class="img-wrapper"></div>
                                                <div class="media-body align-self-center">
                                                    <div class="product-detail">
                                                        <h4></h4>
                                                        <h6></h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="product-box">
                                            <div class="media">
                                                <div class="img-wrapper"></div>
                                                <div class="media-body align-self-center">
                                                    <div class="product-detail">
                                                        <h4></h4>
                                                        <h6></h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- side-bar single product slider end -->
                                <!-- side-bar banner start here -->
                                <div class="collection-sidebar-banner"></div>
                                <!-- side-bar banner end here -->
                            </div>
                            <div class="collection-content col">
                                <div class="page-main-content">
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="top-banner-wrapper">
                                                <div class="img-ldr-top"></div>
                                                <div class="top-banner-content small-section">
                                                    <h4></h4>
                                                    <h5></h5>
                                                    <p></p>
                                                    <p></p>
                                                </div>
                                            </div>
                                            <div class="collection-product-wrapper">
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
                                                    <div class="row">
                                                        <div class="col-xl-3 col-md-6 col-grid-box">
                                                            <div class="product-box">
                                                                <div class="img-wrapper"></div>
                                                                <div class="product-detail">
                                                                    <h4></h4>
                                                                    <h5></h5>
                                                                    <h6></h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xl-3 col-md-6 col-grid-box">
                                                            <div class="product-box">
                                                                <div class="img-wrapper"></div>
                                                                <div class="product-detail">
                                                                    <h4></h4>
                                                                    <h5></h5>
                                                                    <h6></h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xl-3 col-md-6 col-grid-box">
                                                            <div class="product-box">
                                                                <div class="img-wrapper"></div>
                                                                <div class="product-detail">
                                                                    <h4></h4>
                                                                    <h5></h5>
                                                                    <h6></h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xl-3 col-md-6 col-grid-box">
                                                            <div class="product-box">
                                                                <div class="img-wrapper"></div>
                                                                <div class="product-detail">
                                                                    <h4></h4>
                                                                    <h5></h5>
                                                                    <h6></h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xl-3 col-md-6 col-grid-box">
                                                            <div class="product-box">
                                                                <div class="img-wrapper"></div>
                                                                <div class="product-detail">
                                                                    <h4></h4>
                                                                    <h5></h5>
                                                                    <h6></h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xl-3 col-md-6 col-grid-box">
                                                            <div class="product-box">
                                                                <div class="img-wrapper"></div>
                                                                <div class="product-detail">
                                                                    <h4></h4>
                                                                    <h5></h5>
                                                                    <h6></h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xl-3 col-md-6 col-grid-box">
                                                            <div class="product-box">
                                                                <div class="img-wrapper"></div>
                                                                <div class="product-detail">
                                                                    <h4></h4>
                                                                    <h5></h5>
                                                                    <h6></h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xl-3 col-md-6 col-grid-box">
                                                            <div class="product-box">
                                                                <div class="img-wrapper"></div>
                                                                <div class="product-detail">
                                                                    <h4></h4>
                                                                    <h5></h5>
                                                                    <h6></h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xl-3 col-md-6 col-grid-box">
                                                            <div class="product-box">
                                                                <div class="img-wrapper"></div>
                                                                <div class="product-detail">
                                                                    <h4></h4>
                                                                    <h5></h5>
                                                                    <h6></h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xl-3 col-md-6 col-grid-box">
                                                            <div class="product-box">
                                                                <div class="img-wrapper"></div>
                                                                <div class="product-detail">
                                                                    <h4></h4>
                                                                    <h5></h5>
                                                                    <h6></h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xl-3 col-md-6 col-grid-box">
                                                            <div class="product-box">
                                                                <div class="img-wrapper"></div>
                                                                <div class="product-detail">
                                                                    <h4></h4>
                                                                    <h5></h5>
                                                                    <h6></h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xl-3 col-md-6 col-grid-box">
                                                            <div class="product-box">
                                                                <div class="img-wrapper"></div>
                                                                <div class="product-detail">
                                                                    <h4></h4>
                                                                    <h5></h5>
                                                                    <h6></h6>
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
                    </div>
                </div>
            </section>
        </div>
        <!-- loader end -->
        <div v-show="!$store.getters.loader">
            <!-- breadcrumb start -->
            <div class="breadcrumb-section">
                <div class="container">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="page-title">
                                <h2>collection</h2>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <nav aria-label="breadcrumb" class="theme-breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a href="index.html">home</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">collection</li>
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
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="collection-product-wrapper">
                                                <div class="product-top-filter">
                                                    <div class="row">
                                                        <div class="col-xl-12">
                                                            <div class="filter-main-btn"><span
                                                                    class="filter-btn btn btn-theme"><i class="fa fa-filter"
                                                                        aria-hidden="true"></i> Filter</span></div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-12">
                                                            <div class="product-filter-content">
                                                                <div class="search-count">
                                                                    <h5>Showing Products 1-24 of 10 Result</h5>
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
                                                                        <option value="High to low">24 Products Par Page
                                                                        </option>
                                                                        <option value="Low to High">50 Products Par Page
                                                                        </option>
                                                                        <option value="Low to High">100 Products Par Page
                                                                        </option>
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
                                                <div class="product-wrapper-grid product-load-more">
                                                    <div class="row margin-res">
                                                        <div class="col-xl-3 col-6 col-grid-box" v-for="(item,index) in products" :key="index">
                                                            <div class="product-box">
                                                                <div class="img-wrapper">
                                                                    <div class="front" v-show="!$isEmpty(item.images)">
                                                                        <a href="#">
                                                                            <img :src="item.images[0].urls[0].url" class="img-fluid blur-up lazyload bg-img" alt="">
                                                                        </a>
                                                                    </div>
                                                                    <div class="back">
                                                                        <a href="#"><img src="/assets/images/pro3/36.jpg"
                                                                                class="img-fluid blur-up lazyload bg-img"
                                                                                alt=""></a>
                                                                    </div>
                                                                    <div class="cart-info cart-wrap">
                                                                        <button data-bs-toggle="modal"
                                                                            data-bs-target="#addtocart" title="Add to cart"><i
                                                                                class="ti-shopping-cart"></i></button> <a
                                                                            href="javascript:void(0)" title="Add to Wishlist"><i
                                                                                class="ti-heart" aria-hidden="true"></i></a> <a
                                                                            href="#" data-bs-toggle="modal"
                                                                            data-bs-target="#quick-view" title="Quick View"><i
                                                                                class="ti-search" aria-hidden="true"></i></a> <a
                                                                            href="compare.html" title="Compare"><i
                                                                                class="ti-reload" aria-hidden="true"></i></a>
                                                                    </div>
                                                                </div>
                                                                <div class="product-detail">
                                                                    <div>
                                                                        <div class="rating"><i class="fa fa-star"></i> <i
                                                                                class="fa fa-star"></i> <i
                                                                                class="fa fa-star"></i> <i
                                                                                class="fa fa-star"></i> <i
                                                                                class="fa fa-star"></i></div>
                                                                        <router :to="`products/${item.productName}`">
                                                                            <h6>{{ item.productName }}</h6>
                                                                        </router>
                                                                        <p v-html="item.description"></p>
                                                                        <h4>$45.00</h4>
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
                                                </div>
                                                <div class="load-more-sec"><a href="javascript:void(0)" class="loadMore">load
                                                        more</a></div>
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
    </div>
</template>

<script>
import { cloneDeep, debounce, isEmpty } from 'lodash';
export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fetchProducts(),
            next();
        });
    },
    beforeCreate: debounce( () => {
		[
            '/assets/js/lazysizes.min.js',
            '/assets/js/price-range.js'
		].forEach( async(url) => {
			var script = document.createElement("script");  // create a script DOM node
			script.src = url;  // set its src to the provided URL	
			document.body.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
		})
	},500),
    created(){
        this.$isEmpty = isEmpty;
    },
    data(){
        return {
            products: Array()
        }
    },
    methods:{
        closeSearch(){
            document.getElementById("search-overlay").style.display = "none";
        },
        fetchProducts(){
            let { $route: { params: { path } } } = this
            this.$store.commit('loader',true);
            this.$api
                .get(`/categories/${path}`)
                .then( ({ data: { products } }) => {
                    this.products = cloneDeep(products);
                })
                .catch( () => {

                })
                .finally( () => {
                    this.$store.commit('loader',false)
                })
        },
        openSearch(){
            document.getElementById("search-overlay").style.display = "block";
        } 
    }
}
</script>