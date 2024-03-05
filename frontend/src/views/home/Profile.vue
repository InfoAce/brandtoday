<template>
<div>
    <!-- breadcrumb start -->
    <div class="breadcrumb-section">
        <div class="container">
            <div class="row">
                <div class="col-sm-6">
                    <div class="page-title">
                        <h2>account-setting</h2>
                    </div>
                </div>
                <div class="col-sm-6">
                    <nav aria-label="breadcrumb" class="theme-breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#" @click.prevent="router.push({ name: 'Home' })">Home</a></li>
                            <li class="breadcrumb-item active" aria-current="page">Account</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
    </div>
    <!-- breadcrumb End -->


    <!--  dashboard section start -->
    <section class="dashboard-section section-b-space user-dashboard-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-3">
                    <div class="dashboard-sidebar">
                        <div class="profile-top">
                            <div class="profile-image">
                                <img src="../assets/images/avtar.jpg" alt="" class="img-fluid">
                            </div>
                            <div class="profile-detail">
                                <h5>Mark Jecno</h5>
                                <h6>mark.jecno@mail.com</h6>
                            </div>
                        </div>
                        <div class="faq-tab">
                            <ul class="nav nav-tabs" id="top-tab" role="tablist">
                                <li class="nav-item">
                                    <a @click.prevent="router.push({name:'AccountProfile'})" :class="route.name == 'AccountProfile' ? 'nav-link active' : 'nav-link'">Profile</a>            
                                </li>                    

                                <li class="nav-item">
                                    <a @click.prevent="router.push({name:'AccountOrders'})" :class="route.name == 'AccountOrders' ? 'nav-link active' : 'nav-link'">My Orders</a> 
                                </li>                    

                                <li class="nav-item">
                                    <a @click.prevent="router.push({name:'AccountFavourites'})" :class="route.name == 'AccountFavourites' ? 'nav-link active' : 'nav-link'">Favourites</a> 
                                </li>                    
                                <li class="nav-item">
                                    <a @click.prevent="router.push({name:'AccountCards'})" :class="route.name == 'AccountCards' ? 'nav-link active' : 'nav-link'">Saved Cards</a>      
                                </li>                    

                                <li class="nav-item">
                                    <a @click.prevent="router.push({name:'AccountSecurity'})" :class="route.name == 'AccountSecurity' ? 'nav-link active' : 'nav-link'">Security</a> 
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-lg-9">
                    <div class="faq-content tab-content fade show" id="top-tabContent">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--  dashboard section end -->
</div>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route  = useRoute();
</script>