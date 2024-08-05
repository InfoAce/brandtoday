<template>
    
    <!-- header start -->
    <header>
        <div class="mobile-fix-option"></div>
        <div class="top-header">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="header-contact">
                            <ul>
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
                                    <a href="#" @click.prevent="openSearch"><i class="ti-search"></i></a>
                                </div>
                                <div id="search-overlay" class="search-overlay">
                                    <div> 
                                        <span class="closebtn" @click.prevent="closeSearch" title="Close Overlay">×</span>
                                        <div class="overlay-content">
                                            <div class="container">
                                                <div class="row">
                                                    <form @submit.prevent="searchProduct">
                                                        <div class="col-xl-12">
                                                            <div class="form-group">
                                                                <input type="text" class="form-control" id="searchProduct" v-model="data.search" placeholder="Search a Product">
                                                            </div>
                                                            <button type="submit" class="btn btn-primary"><i class="fa fa-search"></i></button>
                                                        </div>
                                                    </form>
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
                            <template v-if="isEmpty(auth)">
                                <li class="p-3"><a href="#" @click.prevent="$router.push({name:'Login'})">Login</a></li>
                                <li class="p-3"><a href="#" @click.prevent="$router.push({name:'Overview'})">Dashboard</a></li>
                                <li class="p-3"><a href="#" @click.prevent="$router.push({name:'Signup'})">Signup</a></li>
                            </template>
                            <template v-if="!isEmpty(auth)">
                                <li class="p-3">
                                    <a href="#" @click.prevent="$router.push({name:'AccountProfile'})">
                                        <i class="fa fa-user" aria-hidden="true"></i>
                                        <span>{{ auth.user.first_name }} {{  auth.user.last_name }}</span>
                                    </a>
                                </li>
                                <li class="p-3">
                                    <a href="#" @click.prevent="logout">
                                        <i class="fa fa-sign-out" aria-hidden="true"></i>
                                        Logout
                                    </a>
                                </li>
                            </template>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row px-4">
                <template v-if="isEmpty(home.categories)" >
                    <div class="ssc">
                        <div class="ssc-wrapper px-0"> 
                            <div class="flex align-center justify-between">
                                <div class="w-40">
                                    <div class="ssc-line w-90 mbs"></div>
                                </div>
                                <div class="w-40">
                                    <div class="ssc-line w-90 mbs"></div>
                                </div>
                                <div class="w-40">
                                    <div class="ssc-line w-90 mbs"></div>
                                </div>
                                <div class="w-40">
                                    <div class="ssc-line w-90 mbs"></div>
                                </div>
                                <div class="w-40">
                                    <div class="ssc-line w-90 mbs"></div>
                                </div>
                                <div class="w-40">
                                    <div class="ssc-line w-90 mbs"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-if="!isEmpty(home.categories)" >
                    <div class="col-12 px-0" >
                            <div id="main-menu" class="d-flex w-100 justify-content-between align-items-center">
                                <div class="menu-left">
                                    <div class="brand-logo">
                                        <a @click.prevent="$router.push({ name: 'Home' })">
                                            <img :src="home.company.logo" class="img-fluid blur-up lazyload" width="200" alt="">
                                        </a>
                                    </div>
                                </div>                                     
                                <div class="menu-center pull-center m-2">
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
                                                <li v-for="(item,index) in home.categories" :key="index">
                                                    <a href="#" @click.prevent="navigateTo(item)" class="py-2 px-2">
                                                        {{ item.name.toUpperCase()  }}
                                                    </a>
                                                </li>                                                                         
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                    </div>
                </template>
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
const data     = reactive({categories: Array(), search: String() });

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
            localStorage.setItem(get($store.getters.env, 'VITE_APP_ID'), JSON.stringify({}));
            // Redirect the user to the login page
            $router.push({ name: "Login" });
        }
    });	
}

/**
 * Navigates to the category page with the given category name as query parameter.
 *
 * @param {Object} item - The category object containing the category name.
 * @return {Object} The navigation object returned by the Vue Router.
 */
const navigateTo = (item) => {
    // Use the Vue Router to navigate to the Category page with the category name as query parameter.
    $router.push({ 
        name:   'Category', 
        params: { category: item.id } 
    });
}

/**
 * Opens the search overlay.
 *
 * This function is responsible for opening the search overlay on the page.
 * It is triggered when the user clicks on the search icon or text.
 *
 * @return {void} This function does not return anything.
 */
const openSearch = () => {
    // Open the search overlay
    document.getElementById("search-overlay").style.display = "block";
    // Focus on the search input field
    document.getElementById("searchProduct").focus();
}

/**
 * Closes the search overlay.
 *
 * This function is responsible for closing the search overlay on the page.
 * It is triggered when the user clicks on the close icon or outside the search overlay.
 *
 * @return {void} This function does not return anything.
 */
const closeSearch = () => {
    // Close the search overlay
    document.getElementById("search-overlay").style.display = "none";
    // Reset the search input field
    document.getElementById("searchProduct").value = "";
}

/**
 * Navigates to the search results page with the given search query.
 *
 * This function is responsible for navigating to the search results page
 * with the given search query. It is triggered when the user presses the
 * enter key while typing in the search field or clicks on the search
 * button.
 *
 * @return {void} This function does not return anything.
 */
const searchProduct = () => {
    // Navigate to the search results page with the given search query
    $router.push({
        name: 'Products',
        query: { name: data.search }
    });
    closeSearch();
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