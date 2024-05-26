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
                                <li>{{ $store.getters.env.VITE_APP_NAME }}</li>
                                <li><i class="fa fa-phone" aria-hidden="true"></i>Call Us: {{ home.company.phone_number }}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-6 text-end d-flex justify-content-end">
                        <ul class="header-dropdown d-flex align-items-center justify-content-end">
                            <li class="mobile-wishlist p-3">
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
                            <li class="mobile-cart p-3" style="position: relative;">
                                <a href="#" @click.prevent="$router.push({ name: 'Cart'})" >
                                    <i class="ti-shopping-cart"></i>
                                    <span class="cart_qty_cls" style="right: 0;">{{ cart.length }}</span>
                                </a>
                            </li>
                            <li class="onhover-dropdown mobile-account p-3">
                                <i class="fa fa-user" aria-hidden="true"></i>
                                <span v-if="isEmpty(authUser)">My Account</span>
                                <span v-else>{{ authUser.first_name }} {{  authUser.last_name }}</span>
                                <ul class="onhover-show-div" v-show="isEmpty(authUser)">
                                    <li><a href="#" @click.prevent="$router.push({name:'Login'})">Login</a></li>
                                    <li><a href="#" @click.prevent="$router.push({name:'Overview'})">Dashboard</a></li>
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
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="main-menu justify-content-center py-4">                
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
                                        <template v-if="!isEmpty(home.categories)" >
                                            <li v-for="(item,index) in home.categories" :key="index" class="px-2">
                                                <a :href="navigateTo(item).href" class="p-0">
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
        </div>
    </header>
    <!-- header end -->
</template>
<script setup>
import { cloneDeep, debounce, isEmpty, isNull } from 'lodash';
import { useStore } from 'vuex';
import { computed, onBeforeMount, onMounted, inject, reactive } from 'vue';
import { useRouter } from 'vue-router';
import router from '../router';

const $api     = inject('$api');
const $swal    = inject('$swal');
const $store   = useStore();
const $router  = useRouter(); 
const data     = reactive({categories: Array() });

//Computed
const backendUri = computed( () => $store.getters.env.VITE_API_BASE_URL.replace('api/v1','') );
const authUser   = computed( () => $store.getters.authUser);
const cart       = computed( () => $store.getters.cart);
const home       = computed({ get: () => $store.getters.home, set(val) { $store.commit('home',val); } });

const fetchMenus = () => {
    $api.get('header')
        .then( ({ data: { categories, company } }) => {
            home.value.categories = cloneDeep(categories);
            home.value.company    = cloneDeep(company);
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

const navigateTo = (item) => {
    return $router.resolve({ name: 'Products',params: { category: btoa(item.categoryPath.toLowerCase()) } });
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