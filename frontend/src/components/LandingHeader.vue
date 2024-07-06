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
                                <li>
                                    <a href="javascript::void" @click.prevent="$router.push({ name: 'Home' })">
                                        <img :src="home.company.logo" class="img-fluid blur-up lazyload" width="150" alt="">
                                    </a>
                                </li>
                                <li><i class="fa fa-phone" aria-hidden="true"></i>Call Us: {{ home.company.phone_number }}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-6 text-end d-flex justify-content-end">
                        <ul class="header-dropdown d-flex align-items-center justify-content-end">
                            <li class="onhover-div mobile-search mobile-wishlist p-3">
                                <a href="#" @click.prevent="$router.push({ name:'AccountFavourites' })"><i class="fa fa-heart" aria-hidden="true"></i></a>
                            </li>
                            <li class="onhover-div mobile-search p-3">
                                <div>
                                    <i class="ti-search" onclick="openSearch()"></i>
                                </div>
                                <div id="search-overlay" class="search-overlay">
                                    <div> 
                                        <span class="closebtn" onclick="closeSearch()" title="Close Overlay">×</span>
                                        <div class="overlay-content">
                                            <div class="container">
                                                <div class="row">
                                                    <div class="col-xl-12">
                                                        <form>
                                                            <div class="form-group">
                                                                <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Search a Product">
                                                            </div>
                                                            <button type="submit" class="btn btn-primary"><i class="fa fa-search"></i></button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li class="mobile-cart p-3" style="position: relative;">
                                <a href="#" @click.prevent="$router.push({ name: 'Cart'})" >
                                    <i class="ti-shopping-cart"></i>
                                    <span class="cart_qty_cls" style="right: 0;">{{ cart.length }}</span>
                                </a>
                            </li>
                            <li class="onhover-dropdown mobile-account p-3">
                                <i class="fa fa-user" aria-hidden="true"></i>
                                <span v-if="isEmpty(auth)">My Account</span>
                                <span v-else>{{ auth.user.first_name }} {{  auth.user.last_name }}</span>
                                <ul class="onhover-show-div" v-show="isEmpty(auth)">
                                    <li><a href="#" @click.prevent="$router.push({name:'Login'})">Login</a></li>
                                    <li><a href="#" @click.prevent="$router.push({name:'Overview'})">Dashboard</a></li>
                                    <li><a href="#" @click.prevent="$router.push({name:'Signup'})">Signup</a></li>
                                </ul>
                                <ul class="onhover-show-div" v-show="!isEmpty(auth)">
                                    <li><a href="#" @click.prevent="$router.push({name:'AccountProfile'})">Profile</a></li>
                                    <li><a href="#" @click.prevent="logout">Logout</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12" >
                    <div id="main-menu" class="d-flex w-100 justify-content-center">
                        <!-- <div class="menu-left">
                            <div class="navbar">
                                <a href="javascript:void(0)">
                                    <div class="bar-style"><i class="fa fa-bars sidebar-bar" aria-hidden="true"></i></div>
                                </a>
                            </div>
                            <div class="brand-logo">
                                <a @click.prevent="$router.push({ name: 'Home' })">
                                    <img :src="home.company.logo" class="img-fluid blur-up lazyload" width="200" alt="">
                                </a>
                            </div>
                        </div>                                      -->
                        <div class="menu-center pull-center m-2 ">
                            <nav id="main-nav">
                                <div class="toggle-nav p-0">
                                    <i class="fa fa-bars sidebar-bar"></i>
                                    <img :src="home.company.logo" class="img-fluid blur-up lazyload" width="150" alt="">
                                </div>
                                <ul id="main-menu" class="sm pixelstrap sm-horizontal">
                                    <li>
                                        <div class="mobile-back text-end">
                                            Back
                                            <i class="fa fa-angle-right ps-2" aria-hidden="true"></i>
                                        </div>
                                    </li>
                                    <template v-if="!isEmpty(home.categories)" >
                                        <li v-for="(item,index) in home.categories" :key="index">
                                            <a href="javascript::void" @click.prevent="navigateTo(item)" class="py-2 px-2">
                                                {{ item.categoryName  }}
                                            </a>
                                        </li> 
                                    </template>                                                                              
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <!-- header end -->
</template>
<style>
    .pixelstrap a {
        letter-spacing: 0em !important;
        line-height:    0px !important;
        text-transform: none !important;
    }
</style>
<script setup>
import { cloneDeep, debounce, get, isEmpty, isNull } from 'lodash';
import { useStore } from 'vuex';
import { computed, onBeforeMount, onMounted, inject, reactive } from 'vue';
import { useRouter } from 'vue-router';
import router from '../router';
import localStorage from 'reactive-localstorage';

const $api     = inject('$api');
const $swal    = inject('$swal');
const $store   = useStore();
const $router  = useRouter(); 
const data     = reactive({categories: Array() });

//Computed
const backendUri = computed( () => $store.getters.env.VITE_API_BASE_URL.replace('api/v1','') );
const auth       = computed( () => $store.getters.auth);
const cart       = computed( () => $store.getters.cart);
const home       = computed({ get: () => $store.getters.home, set(val) { $store.commit('home',val); } });
const addIcon    = (icon) => {
	document.querySelector('link[rel="icon"]')?.setAttribute('type','image/x-icon');
	document.querySelector('link[rel="icon"]')?.setAttribute('href',icon);
}
const fetchMenus = () => {
    $api.get('header')
        .then( ({ data: { categories, company } }) => {
            home.value.categories = cloneDeep(categories);
            home.value.company    = cloneDeep(company);
            addIcon(company.icon)
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

/**
 * Logout function to clear the user's authentication data and redirect to the login page.
 */
const logout = () => {
    // Show a confirmation dialog to the user
    $swal.fire({
        icon: 'question', // Set the icon to a question mark
        title: 'Logout', // Set the title of the dialog to 'Logout'
        text: 'Are you sure you want to logout ?', // Set the text of the dialog
        showCancelButton: true // Show a cancel button in the dialog
    }).then((result) => {
        // If the user confirms the logout
        if(result.isConfirmed) {
            // Clear the user's authentication data from local storage
            localStorage.setItem(`${get($store.getters.env, 'VITE_APP_NAME').replaceAll(' ', '')}_AUTH`, JSON.stringify({}));
            // Redirect the user to the login page
            $router.push({ name: "Login" });
        }
    });	
}

const navigateTo = (item) => {
    return $router.push({ name: 'Products',params: { category: btoa(item.categoryPath.toLowerCase()) } });
}

onBeforeMount( () => fetchMenus() );
onMounted(     () => initMenus() );
</script>

<style scoped>

.pixelstrap a,
.pixelstrap a:hover,
.pixelstrap a:active {
    font-weight: normal;
    font-size:   medium;
}
</style>