<template>
    
    <!-- header start -->
    <header>
        <div class="top-header">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="header-contact">
                            <ul>
                                <li><i class="fa fa-phone" aria-hidden="true"></i>Call Us: {{ home.company.phone_number }}</li>
                                <li><a href="https://marketing.amrod.co.za/landing/2024digitalcatalogues" target="_blank" class="text-white">Download Digital Catalogues</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-6 text-end d-flex justify-content-end">
                        <ul class="header-dropdown d-flex align-items-center justify-content-end">
                            <li class="p-3">
                                <a href="#" @click.prevent="$router.push({ name:'AccountFavourites' })"><i class="fa fa-heart"></i></a>
                            </li>
                            <li class="onhover-div p-3">
                                <div>
                                    <a href="#" @click.prevent="openSearch"><i class="fa fa-magnifying-glass"></i></a>
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
                                    <i class="fa fa-shopping-cart"></i>
                                    <!-- <span class="cart_qty_cls" style="right: 0;">{{ cart.length }}</span> -->
                                </a>
                            </li>
                            <template v-if="isEmpty(auth)">
                                <li class="p-3"><a href="#" @click.prevent="$router.push({name:'Login'})">Login</a></li>
                                <li class="p-3"><a href="#" @click.prevent="redirectToDashboard">Dashboard</a></li>
                                <li class="p-3"><router-link :to="$router.resolve({name:'Signup'}).href">Signup</router-link></li>
                            </template>
                            <template v-if="!isEmpty(auth)">
                                <li class="p-3">
                                    <a href="#" @click.prevent="$router.push({name:'AccountProfile'})">
                                        <i class="fa fa-user-circle" aria-hidden="true"></i>
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
            <div class="row px-2">
                <div class="main-menu">
                    <div class="menu-left">
                        <div class="brand-logo py-2">
                            <div class="text-center">
                                <router-link :to="$router.resolve({ name: 'Home' }).href">
                                    <i v-if="isNull(home.company.logo)" class="fa fa-image fa-5x text-center justify-content-center"></i>
                                    <img v-else :src="`${$store.getters.assetsUrl}${home.company.logo}`" class="img-fluid blur-up lazyload" width="200" style="height: 100% !important;" alt="">
                                </router-link>
                            </div>
                        </div>     
                    </div>
                    <div class="menu-right pull-right" v-if="!isEmpty(home.categories)">
                        <div>
                            <nav id="main-nav">
                                <div class="toggle-nav"><i class="fa fa-bars sidebar-bar"></i></div>
                                <ul id="main-menu" class="sm pixelstrap sm-horizontal">
                                    <li>
                                        <div class="mobile-back text-end">Back<i class="fa fa-angle-right ps-2"
                                                aria-hidden="true"></i></div>
                                    </li>
                                    <li v-for="(category,index) in home.categories" :key="index" class="py-2">
                                        <a href="javascript:void(0)">{{ category.name.toUpperCase()  }}</a>
                                        <ul>
                                            <li>
                                                <router-link 
                                                    :to="$router.resolve({ name: 'Category', params: { category: category.id } }).href" 
                                                    :data-menu="category.code.toLowerCase().replace(/\s/g, '')" 
                                                    class="p-3"
                                                >
                                                    All
                                                </router-link>                                                
                                            </li>
                                            <li v-for="(sub_category,key) in category.__sub_categories__" :key="key">
                                                <router-link :to="$router.resolve({ name: 'Products', params:{ category: category.id, sub_category: sub_category.id }}).href" class="p-3">
                                                    {{ sub_category.name.toUpperCase()  }}
                                                </router-link>
                                            </li> 
                                        </ul>
                                    </li>                                                                         
                                </ul>
                            </nav>
                        </div>
                        <!-- <div>
                            <div class="icon-nav d-none d-sm-block">
                                <ul>
                                    <li class="onhover-div mobile-search">
                                        <div><img src="../assets/images/icon/search.png" onclick="openSearch()"
                                                class="img-fluid blur-up lazyload" alt=""> <i class="ti-search"
                                                onclick="openSearch()"></i></div>
                                    </li>
                                    <li class="onhover-div mobile-setting">
                                        <div><img src="../assets/images/icon/setting.png"
                                                class="img-fluid blur-up lazyload" alt=""> <i
                                                class="ti-settings"></i></div>
                                    </li>
                                    <li class="onhover-div mobile-cart">
                                        <div><img src="../assets/images/icon/cart.png"
                                                class="img-fluid blur-up lazyload" alt=""> <i
                                                class="ti-shopping-cart"></i></div>
                                    </li>
                                </ul>
                            </div>
                        </div> -->
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
const data     = reactive({categories: Array(), search: String() });

//Computed
const backendUri = computed( () => $store.getters.env.VITE_API_BASE_URL.replace('api/v1','') );
const auth       = computed( () => $store.getters.auth);
const cart       = computed( () => $store.getters.cart);
const home       = computed({ get: () => $store.getters.home, set(val) { $store.commit('home',val); } });

/**
 * @description
 * This function will update the favicon of the website dynamically.
 * It will search for the first link with rel="icon" and set its href attribute
 * to the provided icon URL.
 * @param {String} icon - The URL of the favicon.
 */
const addIcon    = (icon) => {
	// Get the first <link> element with rel="icon"
	const favicon = document.querySelector('link[rel="icon"]');
	
	// Check if the favicon exists
	if (favicon) {
		// Set the type attribute
		favicon.setAttribute('type', 'image/x-icon');
		
		// Set the href attribute
		favicon.setAttribute('href', `${$store.getters.assetsUrl}${icon}`);
	}
}

/**
 * @description
 * This function fetches the header menus from the server and updates the
 * home state with the fetched data.
 */
const fetchMenus = () => {
    /**
     * @description
     * The API endpoint to fetch the header menu from.
     */
    const url = 'header';

    $api.get(url)
        .then( ({ data: { categories, company } }) => {
            /**
             * @description
             * Update the categories state with the fetched categories.
             */
            home.value.categories = cloneDeep(categories);

            /**
             * @description
             * Update the company state with the fetched company.
             */
            home.value.company    = cloneDeep(company);

            /**
             * @description
             * Set the favicon of the website to the company's icon.
             */
            addIcon(company.icon)
            
        })
        .catch( error => {
            /**
             * @description
             * Catch any errors that occur while fetching the menu.
             */
            console.error('Error fetching menu:', error);
        })
        .finally( () => {

            
            $('#main-menu').smartmenus({
                hideTimeout: 300,
                subMenusSubOffsetX: 1,
                subMenusSubOffsetY: -8,
            });

            $('#main-menu').bind('show.smapi', function(e, menu) {
                if(window.innerWidth >= 1200 ){
                    $(menu).css('display', 'flex');
                    $(menu).css('flex-wrap', 'wrap');
                    $(menu).css('position', 'fixed');
                    $(menu).css('max-width', '100%');
                    $(menu).css('min-width', '100%');
                    $(menu).css('width', '100%');
                    $(menu).css('justify-content', 'center');
                    $(menu).css('left', '0');
                    $(menu).css('top', 'auto');
                }
            });

            $('#main-menu').bind('beforehide.smapi', function(e, menu) {
                $(menu).css('display', 'none');
            });
            /**
             * @description
             * Code to run after the promise is resolved or rejected.
             */
        })
}

const initMenus = debounce( () => {
    $(function () {
        $('.toggle-nav').on('click', function () {
            $('.sm-horizontal').css("right", "0px");
        });
        
        $(".mobile-back").on('click', function () {
            $('.sm-horizontal').css("right", "-410px");
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

/**
 * Redirects the user to the dashboard.
 *
 * This function is responsible for redirecting the user to the
 * dashboard. It is triggered when the user clicks on the
 * "Dashboard" link in the header.
 *
 * @return {void} This function does not return anything.
 */
const redirectToDashboard = () => {
    // Redirect the user to the dashboard
    window.location.href = $store.getters.env.VITE_DASHBOARD_URL;
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
</style>../router/home