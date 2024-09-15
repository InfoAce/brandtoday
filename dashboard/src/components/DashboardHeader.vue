<template>
<!-- Page Header Start-->
<div class="page-main-header">
    <div class="main-header-right row">
        <div class="main-header-left d-lg-none w-auto">
            <div class="logo-wrapper">
                <a href="#" @click.prevent="$router.push({ name: 'Overview' })">
                    <i class="fa fa-bars" v-if="!isEmpty(authUser) && isNull(authUser.image)"></i>
                    <img v-if="!isEmpty(authUser) && !isNull(authUser.image)" class="blur-up lazyloaded d-block d-lg-none" :src="authUser.image"  :alt="`${authUser.first_name} ${authUser.last_name}`">
                </a>
            </div>
        </div>
        <div class="mobile-sidebar w-auto">
            <div class="media-body text-end switch-sm">
                <label class="switch">
                    <a href="javascript:void(0)">
                        <i id="sidebar-toggle" class="fa fa-bars fa-2x"></i>
                    </a>
                </label>
            </div>
        </div>
        <div class="nav-right col">
            <ul class="nav-menus">
                <li class="onhover-dropdown">
                    <div class="media align-items-center justify-content-end">
                        <i class="fa fa-user" v-if="!isEmpty(authUser) && isNull(authUser.image)"></i>
                        <img v-if="!isEmpty(authUser) && !isNull(authUser.image)" class="align-self-center pull-right img-50 blur-up lazyloaded" :src="`${$store.getters.assetsUrl}${authUser.image}`"  :alt="`${authUser.first_name} ${authUser.last_name}`">
                        <div class="dotted-animation">
                            <span class="animate-circle"></span>
                            <span class="main-circle"></span>
                        </div>
                    </div>
                    <ul class="profile-dropdown onhover-show-div p-20 profile-dropdown-hover">
                        <li>
                            <a href="javascript:void(0)" @click="$router.push({name:'Profile'})">
                                <i class="fa fa-user"></i>
                                <span class="mx-2">Edit Profile</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" @click.prevent="logout">
                                <i class="fa fa-sign-out " aria-hidden="true"></i>
                                <span class="mx-2">Logout</span>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="d-lg-none mobile-toggle pull-right">
                <i data-feather="more-horizontal"></i>
            </div>
        </div>
    </div>
</div>
        <!-- Page Header Ends -->    
</template>

<script setup lang="ts">
import { isEmpty, isNull, get } from 'lodash';
import { computed, inject } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const $router = useRouter();
const $store  = useStore();
const $swal   = inject('$swal');

// Computed 
const authUser   = computed( () => get($store.getters.auth,'user') );
const backendUri = computed( () => $store.getters.env.VITE_API_URL.replace('api/v1','') );

// Methods
const logout = () => {
    $swal?.fire({
        icon: 'question',
        title: 'Logout',
        text: 'Are you sure you want to logout ?',
        showCancelButton: true
    }).then((result: any) => {
        if( result.isConfirmed ){
            $store.dispatch('logout',$router);            
        }
    });	
}

</script>
  