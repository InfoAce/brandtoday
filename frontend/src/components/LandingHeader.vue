<template>
    
    <!-- header start -->
    <header>
        <div class="top-header">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="header-contact">
                            <ul class="align-items-center">
                                <li>
                                    <i class="fa fa-phone" aria-hidden="true"></i>
                                    Call Us:
                                    <template v-if="!isEmpty(home.company.phone_number)">
                                        <a 
                                            v-for="(phone,key) in home.company.phone_number.split('/')" :href="`tel:${phone}`" 
                                            class="text-white" :key="key">
                                                {{ phone }}
                                                <span v-if="key != (home.company.phone_number.split('/').length - 1)">&bull;</span>
                                        </a>
                                    </template>
                                </li>
                                <li><a href="https://marketing.amrod.co.za/landing/2024digitalcatalogues" target="_blank" class="text-white">Download Digital Catalogues</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-6 top-links">
                        <ul class="header-dropdown d-flex align-items-center justify-content-end">
                            <li class="onhover-div mobile-cart p-0">
                                <input type="text" class="form-control" placeholder="Search products" v-model="data.product_name"/>
                                <ul class="search-results visible" v-show="!isEmpty(data.product.items)">
                                    <li>
                                        <h5 class="text-theme">Matches Found: {{ data.product.count }} </h5>
                                        <button class="btn btn-solid btn-xs" type="button" @click="openLiveChat()">Chat with us</button>
                                    </li>
                                    <li v-for="(product,index) in data.product.items" :key="index">
                                        <router-link :to="$router.resolve({ name: 'Product', params: { product: product.full_code }}).href">
                                            <img class="img-fluid blur-up lazyload bg-img" :src="product.images[0].urls[0].url" alt="" width="20%">
                                            <div>
                                                <h6 class="text-theme">{{ product.name }}</h6>
                                                <p style="color: #000;">{{ product.full_code }}</p>
                                            </div>
                                        </router-link>
                                    </li>
                                    <li>
                                        <button class="btn btn-solid btn-xs" type="button" @click="openSearchResults()">View More</button>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <ul class="header-dropdown d-flex align-items-center justify-content-end">
                            <li class="p-3" v-if="isEmpty(auth)">
                                <a href="#" @click.prevent="$router.push({ name:'AccountFavourites' })"><i class="fa fa-heart"></i></a>
                            </li>
                            <li class="onhover-div p-3">
                                <!-- <div>
                                    <a href="#" @click.prevent="openSearch"><i class="fa fa-magnifying-glass"></i></a>
                                </div> -->
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
                                    <span class="cart_qty_cls" style="right: 0;">{{ cart.length }}</span>
                                </a>
                            </li>
                            <template v-if="isEmpty(auth)">
                                <li class="p-3"><a href="#" @click.prevent="$router.push({name:'Login'})">Login</a></li>
                                <li class="p-3"><a href="#" @click.prevent="redirectToDashboard">Dashboard</a></li>
                                <li class="p-3"><router-link :to="$router.resolve({name:'Signup'}).href">Signup</router-link></li>
                            </template>
                            <template v-if="!isEmpty(auth)">
                                <li class="p-3">
                                    <!-- <a href="#" @click.prevent="$router.push({name:'AccountProfile'})">
                                        <i class="fa fa-user-circle" aria-hidden="true"></i>
                                        <span>{{ auth.user.first_name }} {{  auth.user.last_name }}</span>
                                    </a> -->
                                    <div class="btn-group">
                                        <a href="#" class="dropdown-toggle text-white" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa fa-user-circle" aria-hidden="true"></i>
                                            <span class="ml-2">{{ auth.user.first_name }} {{ auth.user.last_name }}</span>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right">
                                            <button class="dropdown-item" type="button" @click.prevent="$router.push({name:'AccountProfile'})"> <i class="fa fa-user-circle" aria-hidden="true"></i>Profile</button>
                                            <button class="dropdown-item" type="button" @click.prevent="$router.push({ name:'AccountFavourites' })"><i class="fa fa-heart"></i> Whishlist</button>
                                            <button class="dropdown-item" type="button" @click.prevent="logout"><i class="fa fa-sign-out" aria-hidden="true"></i>Logout</button>
                                        </div>
                                    </div>
                                </li>
                                <!-- <li class="p-3">
                                    <a href="#" @click.prevent="logout">
                                        <i class="fa fa-sign-out" aria-hidden="true"></i>
                                        Logout
                                    </a>
                                </li> -->
                            </template>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row px-2">
                <div class="main-menu">
                    <div class="brand-logo py-2">
                        <div class="text-center">
                            <router-link :to="$router.resolve({ name: 'Home' }).href">
                                <i v-if="isNull(home.company.logo)" class="fa fa-image fa-5x text-center justify-content-center"></i>
                                <img v-else :src="`${$store.getters.assetsUrl}${home.company.logo}`" class="img-fluid blur-up lazyload" width="200" style="height: 100% !important;" alt="">
                            </router-link>
                        </div>
                    </div>  
                    <div v-if="!isEmpty(home.categories)" class="justify-content-left menu-list">
                        <nav id="main-nav">
                            <div class="toggle-nav" @click="showSidebar"><i class="fa fa-bars sidebar-bar"></i></div>
                            <ul id="main-menu" class="sm pixelstrap sm-horizontal">
                                <li>
                                    <div class="mobile-back text-end" @click="closeSideber">Back<i class="fa fa-angle-right ps-2" aria-hidden="true"></i></div>
                                </li>
                                <li class="mobile"><a href="#" @click.prevent="openSearch">SEARCH</a></li>
                                <li class="mobile"><a href="https://marketing.amrod.co.za/landing/2024digitalcatalogues" target="_blank">DOWNLOAD DIGITAL CATALOGUES</a></li>
                                <li class="mobile"><a href="#" @click.prevent="$router.push({ name:'AccountFavourites' })">WISHLIST</a></li>
                                <li class="mobile">
                                    <a href="#" @click.prevent="$router.push({ name: 'Cart'})" >
                                        SHOPPING CART
                                        <span style="right: 0;">({{ cart.length }})</span>
                                    </a>
                                </li>
                                <template v-if="isEmpty(auth)">
                                    <li class="mobile"><a href="#" @click.prevent="$router.push({name:'Login'})">LOGIN</a></li>
                                    <li class="mobile"><a href="#" @click.prevent="redirectToDashboard">DASHBOARD</a></li>
                                    <li class="mobile"><router-link :to="$router.resolve({name:'Signup'}).href">SIGNUP</router-link></li>
                                </template>
                                <li v-if="!isEmpty(auth)" class="mobile">
                                    <a href="#">ACCOUNT</a>
                                    <ul>
                                        <li style="text-transform: uppercase;">
                                            <a href="#" @click.prevent="$router.push({name:'AccountProfile'})" >
                                                {{ auth.user.first_name }} {{  auth.user.last_name }}
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" @click.prevent="logout" >
                                                LOGOUT
                                            </a>
                                        </li>                                            
                                    </ul>
                                </li>                                  
                                <li v-for="(category,index) in home.categories" :key="index" data-sm-horizontal-sub="true">
                                    <a 
                                        href="javascript:void(0)" 
                                        :class="has($route.params,'category') && $route.params.category == category.cpde ? 'show' : '' " 
                                    >{{ category.name.toUpperCase()  }}</a>
                                    <ul>
                                        <li>
                                            <router-link 
                                                :to="$router.resolve({ name: 'Category', params: { category: category.code } }).href" 
                                                :data-menu="category.code.toLowerCase().replace(/\s/g, '')" 
                                            >
                                                ALL
                                            </router-link>                                                
                                        </li>
                                        <li v-for="(sub_category,key) in category.__sub_categories__" :key="key">
                                            <router-link :to="$router.resolve({ name: 'Products', params:{ category: category.code, sub_category: sub_category.code }}).href">
                                                {{ sub_category.name.toUpperCase()  }}
                                            </router-link>
                                        </li> 
                                    </ul>
                                </li>                                                                         
                            </ul>
                        </nav>
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
import { cloneDeep, debounce, get, isEmpty, isNull, has } from 'lodash';
import { useStore } from 'vuex';
import { computed, onBeforeMount, onMounted, inject, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import localStorage from 'reactive-localstorage';

const $api     = inject('$api');
const $swal    = inject('$swal');
const $store   = useStore();
const $route   = useRoute(); 
const $router  = useRouter(); 
const data     = reactive({
    categories:   Array(),
    search:       String(), 
    product_name: String(), 
    product:     {
        count:  Number(),
        items:  Array(),
    }
});

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
                subMenusMaxWidth: '100%',
                subMenusMinWidth: '100%',
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
                    $(menu).css('width', '100%');
                    $(menu).css('margin-left', '0 !important');
                }
                if(window.innerWidth < 1200 ){
                    $(menu).css('display', 'block');
                    $(menu).css('flex-wrap', 'none');
                    $(menu).css('position', 'relative');
                    $(menu).css('width', 'auto');
                    $(menu).css('justify-content', 'center');
                    $(menu).css('right', 'none');
                    $(menu).css('top', '2');
                    $(menu).css('margin-left', '0 !important');
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

const showSidebar  = () => $('.pixelstrap').css("right", "0px");

const closeSideber = () => $('.pixelstrap').css("right", "-300px");


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
        name: 'ViewProducts',
        query: { name: data.search }
    });
    closeSearch();
}

const fetchProducts = debounce(
    async (name) => {
        try{
            const { data: { count, products } } = await $api.put(`/header?name=${name}`);
            data.product.items = cloneDeep(products);
            data.product.count = cloneDeep(count);
        } catch(error) {

        }
    },
    1000
)

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

const openLiveChat = () => { 
    $('.tawk-button').trigger('click') 
}

const openSearchResults = () => {
    $router.push({ name: 'ViewProducts', query: { name: data.product_name } });
    data.product_name = String();
}

watch(
    () => data.product_name,
    (name) => {
        if( !isEmpty(name) ){
            fetchProducts(name)
        }
        if( isEmpty(name) ){
            data.product.items = [];
            data.product.count = 0;
        }
    }
)

watch(
    () => $route,
    () => {
        data.product.items = [];
        data.product.count = 0;
        data.product_name  = String();
    },
    {
        deep: true
    }
)

onBeforeMount( () => fetchMenus() );
// onMounted( () => {
//     $('.dropdown-toggle').on('click', () => {
//         $(event.target).dropdown('show')
//     });
// })
</script>

<style scoped>

.pixelstrap a,
.pixelstrap a:hover,
.pixelstrap a:active {
    font-weight: normal;
    font-size:   medium;
}
</style>