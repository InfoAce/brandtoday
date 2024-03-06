<template>
    
    <!-- header start -->
    <header>
        <div class="mobile-fix-option"></div>
        <div class="top-header">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="header-contact">
                            <ul>
                                <li>Welcome href Our store Multikart</li>
                                <li><i class="fa fa-phone" aria-hidden="true"></i>Call Us: 123 - 456 - 7890</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-6 text-end">
                        <ul class="header-dropdown">
                            <li class="mobile-wishlist">
                                <a href="#"><i class="fa fa-heart" aria-hidden="true"></i></a>
                            </li>
                            <li class="onhover-dropdown mobile-account">
                                <i class="fa fa-user" aria-hidden="true"></i>
                                <span v-if="$isEmpty(authUser)">My Account</span>
                                <span v-else>{{ authUser.first_name }} {{  authUser.last_name }}</span>
                                <ul class="onhover-show-div" v-show="$isEmpty(authUser)">
                                    <li><a href="#" @click.prevent="$router.push({name:'Login'})">Login</a></li>
                                    <li><a href="#" @click.prevent="$router.push({name:'Signup'})">Signup</a></li>
                                </ul>
                                <ul class="onhover-show-div" v-show="!$isEmpty(authUser)">
                                    <li><a href="#" @click.prevent="$router.push({name:'AccountProfile'})">Profile</a></li>
                                    <li><a href="#" @click.prevent="logout">Logout</a></li>
                                </ul>
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
                                <a href="javascript:void(0)" onclick="openNav()">
                                    <div class="bar-style"><i class="fa fa-bars sidebar-bar" aria-hidden="true"></i>
                                    </div>
                                </a>
                                <div id="mySidenav" class="sidenav">
                                    <a href="javascript:void(0)" class="sidebar-overlay" onclick="closeNav()"></a>
                                    <nav>
                                        <div onclick="closeNav()">
                                            <div class="sidebar-back text-start"><i class="fa fa-angle-left pe-2"
                                                    aria-hidden="true"></i> Back</div>
                                        </div>
                                        <ul id="sub-menu" class="sm pixelstrap sm-vertical">
                                            <li v-for="(item,index) in categories" :key="index"> 
                                                <a href="#" @click.prevent="$router.push({ name: 'Products',params: { category: btoa(item.categoryPath) }})">{{ item.categoryName }}</a>
                                                <ul>
                                                    <li v-for="(item_child,child_key) in item.children" :key="child_key">
                                                        <a href="#" @click.prevent="$router.push({ name: 'Products',params: { category: btoa(item_child.categoryPath) }})">{{ item_child.categoryName }}</a>
                                                        <template v-if="!$isEmpty(item_child.children)">
                                                            <ul v-show="!$isEmpty(item_child.children)">
                                                                <li v-for="(item_child_child,child_child_key) in item_child.children" :key="child_child_key">
                                                                    <a href="#" @click.prevent="$router.push({ name: 'Products',params: { category: btoa(item_child_child.categoryPath) }})">{{ item_child_child.categoryName }}</a>
                                                                </li>
                                                            </ul>
                                                        </template>
                                                    </li>
                                                </ul>
                                            </li>                                          
                                        </ul>
                                    </nav>
                                </div>
                            </div>                            
                            <div class="brand-logo">
                                <a href="/">
                                    <img src="./images/icon/logo.png" class="img-fluid blur-up lazyload" alt="">
                                </a>
                            </div>
                        </div>
                        <div class="menu-right pull-center">
                            <div>
                                <nav id="main-nav">
                                    <div class="toggle-nav"><i class="fa fa-bars sidebar-bar"></i></div>
                                    <ul id="main-menu" class="sm pixelstrap sm-horizontal">
                                        <li>
                                            <div class="mobile-back text-end">Back<i class="fa fa-angle-right ps-2"
                                                    aria-hidden="true"></i></div>
                                        </li>
                                        <li><router-link to="/home">Home</router-link></li>
                                        <li>
                                            <a href="#">shop</a>
                                            <ul>
                                                <li><a href="category-page(vegetables).html">tab style<span
                                                            class="new-tag">new</span></a></li>
                                                <li><a href="category-page(top-filter).html">top filter</a></li>
                                                <li><a href="category-page(modern).html">modern</a></li>
                                                <li><a href="category-page.html">left sidebar</a></li>
                                                <li><a href="category-page(right).html">right sidebar</a></li>
                                                <li><a href="category-page(no-sidebar).html">no sidebar</a></li>
                                                <li><a href="category-page(sidebar-popup).html">sidebar popup</a>
                                                </li>
                                                <li><a href="category-page(metro).html">metro</a></li>
                                                <li><a href="category-page(full-width).html">full width</a></li>
                                                <li><a href="category-page(infinite-scroll).html">infinite
                                                        scroll</a></li>
                                                <li><a href=category-page(3-grid).html>three grid</a></li>
                                                <li><a href="category-page(6-grid).html">six grid</a></li>
                                                <li><a href="category-page(list-view).html">list view</a></li>
                                            </ul>
                                        </li>
                                        <li>
                                            <router-link to="/home/products">Products</router-link>
                                        </li>                                
                                    </ul>
                                </nav>
                            </div>
                            <div>
                                <div class="icon-nav">
                                    <ul>
                                        <li class="onhover-div mobile-search">
                                            <div><img src="/assets/images/icon/search.png" onclick="openSearch()"
                                                    class="img-fluid blur-up lazyload" alt=""> <i class="ti-search"
                                                    onclick="openSearch()"></i></div>
                                            <div id="search-overlay" class="search-overlay">
                                                <div> <span class="closebtn" onclick="closeSearch()"
                                                        title="Close Overlay">×</span>
                                                    <div class="overlay-content">
                                                        <div class="container">
                                                            <div class="row">
                                                                <div class="col-xl-12">
                                                                    <form>
                                                                        <div class="form-group">
                                                                            <input type="text" class="form-control"
                                                                                id="exampleInputPassword1"
                                                                                placeholder="Search a Product">
                                                                        </div>
                                                                        <button type="submit" class="btn btn-primary"><i
                                                                                class="fa fa-search"></i></button>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <!-- <li class="onhover-div mobile-setting">
                                            <div><img src="/assets/images/icon/setting.png"
                                                    class="img-fluid blur-up lazyload" alt=""> <i
                                                    class="ti-settings"></i></div>
                                            <div class="show-div setting">
                                                <h6>language</h6>
                                                <ul>
                                                    <li><a href="#">english</a></li>
                                                    <li><a href="#">french</a></li>
                                                </ul>
                                                <h6>currency</h6>
                                                <ul class="list-inline">
                                                    <li><a href="#">euro</a></li>
                                                    <li><a href="#">rupees</a></li>
                                                    <li><a href="#">pound</a></li>
                                                    <li><a href="#">doller</a></li>
                                                </ul>
                                            </div>
                                        </li> -->
                                        <li class="onhover-div mobile-cart">
                                            <div>
                                                <img src="/assets/images/icon/cart.png"class="img-fluid blur-up lazyload" alt=""> 
                                                <i class="ti-shopping-cart"></i>
                                            </div>
                                            <span class="cart_qty_cls">1</span>
                                            <CartPopup />
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
    <!-- header end -->
</template>
<script>
import CartPopup from './CartPopup.vue';
import { cloneDeep, debounce, isEmpty } from 'lodash';
import { mapGetters } from 'vuex';

export default {
    components:{
        CartPopup,
    },
    computed:{
        ...mapGetters([
            'authUser'
        ])
    },
    created(){
        this.fetchMenus();
        this.$isEmpty = isEmpty;
        this.initMenus = debounce( () => {
            $(function () {
                $('#main-menu').smartmenus({
                    subMenusSubOffsetX: 1,
                    subMenusSubOffsetY: -8
                });
                $('#sub-menu').smartmenus({
                    subMenusSubOffsetX: 1,
                    subMenusSubOffsetY: -8
                });
            });
        },500)
    },
    data() {
        return {
            categories: []
        }
    },
    methods:{
        btoa(data){
            return window.btoa(data);
        },
        fetchMenus(){
            this.$api
                .get('header')
                .then( ({ data: { categories } }) => {
                    this.categories = cloneDeep(categories);
                    // this.initMenus();
                })
                .catch( () => {

                })
                .finally( () => {

                })
        }
    },
    name: "LandingHeader",
}
</script>