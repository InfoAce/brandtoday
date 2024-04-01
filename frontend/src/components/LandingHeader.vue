<template>
    
    <!-- header start -->
    <header>
        <div class="mobile-fix-option"></div>
        <div class="top-header">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="header-contact">
                            <!-- <ul>
                                <li>Welcome href Our store Multikart</li>
                                <li><i class="fa fa-phone" aria-hidden="true"></i>Call Us: 123 - 456 - 7890</li>
                            </ul> -->
                        </div>
                    </div>
                    <div class="col-lg-6 text-end">
                        <ul class="header-dropdown">
                            <li class="mobile-wishlist">
                                <a href="#" @click.prevent="$router.push({ name:'AccountFavourites' })"><i class="fa fa-heart" aria-hidden="true"></i></a>
                            </li>
                            <li class="onhover-dropdown mobile-account">
                                <i class="fa fa-user" aria-hidden="true"></i>
                                <span v-if="isEmpty(authUser)">My Account</span>
                                <span v-else>{{ authUser.first_name }} {{  authUser.last_name }}</span>
                                <ul class="onhover-show-div" v-show="isEmpty(authUser)">
                                    <li><a href="#" @click.prevent="$router.push({name:'Login'})">Login</a></li>
                                    <li><a href="#" @click.prevent="$router.push({name:'Signup'})">Signup</a></li>
                                </ul>
                                <ul class="onhover-show-div" v-show="!isEmpty(authUser)">
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
                                            <li v-for="(item,index) in data.categories" :key="index"> 
                                                <a href="javascript::void(0)" >{{ item.categoryName }}</a>
                                                <ul>
                                                    <li v-for="(item_child,child_key) in item.children" :key="child_key">
                                                        <template v-if="!isEmpty(item_child.children)">
                                                            <a href="#">{{ item_child.categoryName }}</a>
                                                            <ul v-show="!isEmpty(item_child.children)">
                                                                <li v-for="(item_child_child,child_child_key) in item_child.children" :key="child_child_key">
                                                                    <router-link :to="navigateTo(item_child_child)">{{ item_child_child.categoryName }}</router-link>
                                                                </li>
                                                            </ul>
                                                        </template>
                                                        <template v-else>
                                                            <router-link :to="navigateTo(item_child)">{{ item_child.categoryName }}</router-link>
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
                                    <img src="/assets/home/images/icon/logo.png" class="img-fluid blur-up lazyload" alt="">
                                </a>
                            </div>
                        </div>
                        <div class="menu-right pull-center">
                            <div>
                                <nav id="main-nav">
                                    <div class="toggle-nav"><i class="fa fa-bars sidebar-bar"></i></div>
                                    <ul id="main-menu" class="sm pixelstrap sm-horizontal">
                                        <li>
                                            <div class="mobile-back text-end">
                                                Back
                                                <i class="fa fa-angle-right ps-2" aria-hidden="true"></i>
                                            </div>
                                        </li>
                                        <li>
                                            <router-link to="/home">Home</router-link>
                                        </li>                                       
                                    </ul>
                                </nav>
                            </div>
                            <div>
                                <div class="icon-nav">
                                    <ul>
                                        <li class="onhover-div mobile-search">
                                            <div>
                                                <img src="/assets/home/images/icon/search.png" onclick="openSearch()" class="img-fluid blur-up lazyload" alt=""> 
                                                <i class="ti-search" onclick="openSearch()"></i>
                                            </div>
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
                                            <div><img src="/assets/home/images/icon/setting.png"
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
                                        <li class="mobile-cart">
                                            <a href="#" @click.prevent="$router.push({ name: 'Cart'})">
                                                <img src="/assets/home/images/icon/cart.png" class="img-fluid blur-up lazyload" alt=""> 
                                                <i class="ti-shopping-cart"></i>
                                            </a>
                                            <span class="cart_qty_cls">{{ cart.length }}</span>
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
<script setup>
import { cloneDeep, debounce, isEmpty } from 'lodash';
import { useStore } from 'vuex';
import { onBeforeMount, onMounted, inject, reactive } from 'vue';
import { useRouter } from 'vue-router';

const $api     = inject('$api');
const $swal    = inject('$swal');
const $store   = useStore();
const $router  = useRouter(); 
const data     = reactive({categories: Array() });
const authUser = $store.getters.authUser;
const cart     = $store.getters.cart;

const fetchMenus = () => {
    $api.get('header')
        .then( ({ data: { categories } }) => {
            data.categories = cloneDeep(categories);
        })
        .catch( () => {

        })
        .finally( () => {

        })
}

const btoa = (data) => {
    return window.btoa(data);
};

const initMenus = debounce( () => {
    $(function () {
        $('#main-menu').smartmenus({
            subMenusSubOffsetX: 1,
            subMenusSubOffsetY: -8
        });
        $('#sub-menu').smartmenus({
            subMenusSubOffsetX: 1,
            subMenusSubOffsetY: -10
        });
    });
},500);

const logout = () =>{
    $swal.fire({
        icon: 'question',
        title: 'Logout',
        text: 'Are you sure you want to logout ?',
        showCancelButton: true
    }).then((result) => {
        if( result.isConfirmed ){
            $store.dispatch('logout');
            $router.push({ name: "Login" });
        }
    });	
}

const navigateTo = (item_child_child) => {
    return { name: 'Products',params: { category: btoa(item_child_child.categoryPath) } }
}

onBeforeMount( () => fetchMenus() );
onMounted(     () => initMenus() );
</script>