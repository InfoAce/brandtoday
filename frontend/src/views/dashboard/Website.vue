<template>
  <div>
    <!-- Container-fluid starts-->
    <div class="container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-lg-6">
                    <div class="page-header-left">
                        <h3> Website <small>Landing page content. Update privacy policy, terms and conditions and banner slider.</small></h3>
                    </div>
                </div>
                <div class="col-lg-6">
                    <ol class="breadcrumb pull-right">
                        <li class="breadcrumb-item">
                            <a href="#" @click.prevent="$router.push({ name: 'Overview' })">
                                <i data-feather="home"></i>
                                Overview                        
                            </a>
                        </li>
                        <li class="breadcrumb-item active">Website</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
    <!-- Container-fluid Ends-->

    <!-- Container-fluid starts-->
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                <div class="card">
                    <div class="card-body" style="height: 75vh">                    
                        <ul class="nav nav-tabs tab-coupon" id="myTab" role="tablist">
                            <li class="nav-item">
                                <a :class="$data.tab == 1 ? `nav-link active show` : `nav-link` " id="home-tab" data-bs-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true" data-original-title="Banners" title="Banners" @click="$data.tab = 1">Banners</a>
                            </li>
                            <li class="nav-item">
                                <a :class="$data.tab == 2 ? `nav-link active show` : `nav-link` " id="privacy-tab" data-bs-toggle="tab" href="#privacy" role="tab" aria-controls="privacy" aria-selected="false" data-original-title="Privacy Policy" title="Privacy Policy" @click="$data.tab = 2">Privacy Policy</a>
                            </li>
                            <li class="nav-item">
                                <a :class="$data.tab == 3 ? `nav-link active show` : `nav-link` " id="termsandconditions-tab" data-bs-toggle="tab" href="#termsandconditions" role="tab" aria-controls="termsandconditions " aria-selected="false" data-original-title="Terms and Conditions" title="Terms and Conditions" @click="$data.tab = 3">Terms and Conditions</a>
                            </li>
                        </ul>
                        <div class="tab-content" id="homeTabContent" v-if="$data.tab == 1">
                            <HomeTab @update-company="updateCompany" :company.sync="$data.company" />
                        </div>
                        <div class="tab-content" id="privacyTabContent" v-if="$data.tab == 2">
                            <PrivacyTab @update-company="updateCompany" :company.sync="$data.company" />
                        </div>
                        <div class="tab-content" id="termsandconditionsTabContent" v-if="$data.tab == 3">
                            <TermsAndConditionsTab @update-company="updateCompany" :company.sync="$data.company" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Container-fluid Ends-->
  </div>    
</template>

<script setup>
import { cloneDeep, has } from 'lodash';
import { inject, onBeforeMount, reactive } from 'vue';
import { HomeTab, PrivacyTab, TermsAndConditionsTab } from './tabs';

// Magin variables
const $api  = inject('$api');

// Reactive data
const $data = reactive({ company: Object(), tab: 1, loader: Boolean() });

/**
 * Fetch company information
 */
const fetch = async () => {
    try {
        $data.loader             = Boolean(true);
        let { data:{ company } } = await $api.get('/dashboard/website');
        $data.company            = cloneDeep(company);
        $data.loader             = Boolean();
    } catch(error) {
        $data.loader             = Boolean();
    }
}

/**
 * Update company details
 */
const updateCompany = (data) => {
    console.log(data);
    //Check if data has banners
    if( has(data,'banners') ){
        $data.company.banners = data.banners;
    }
    // Check if data has privacy policy
    if( has(data,'privacy_policy') ){
        $data.company.bannprivacy_policyers = data.privacy_policy;        
    }
    // Check if data has terms and conditions
    if( has(data,'terms_conditions') ){
        $data.company.terms_conditions = data.terms_conditions;        
    }
}

onBeforeMount( () => fetch())
</script>