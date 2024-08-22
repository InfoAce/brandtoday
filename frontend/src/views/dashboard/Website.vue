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
                    <div class="card-body" style="height: 100%">                    
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
                            <li class="nav-item">
                                <a :class="$data.tab == 4 ? `nav-link active show` : `nav-link` " id="termsandconditions-tab" data-bs-toggle="tab" href="#aboutus" role="tab" aria-controls="aboutus " aria-selected="false" data-original-title="About Us" title="About Us" @click="$data.tab = 4">About Us</a>
                            </li>
                            <li class="nav-item">
                                <a :class="$data.tab == 5 ? `nav-link active show` : `nav-link` " id="termsandconditions-tab" data-bs-toggle="tab" href="#faq" role="tab" aria-controls="faq " aria-selected="false" data-original-title="Faq" title="Faqs" @click="$data.tab = 5">Faqs</a>
                            </li>
                            <li class="nav-item">
                                <a :class="$data.tab == 6 ? `nav-link active show` : `nav-link` " id="termsandconditions-tab" data-bs-toggle="tab" href="#returnrefunds" role="tab" aria-controls="returnrefunds " aria-selected="false" data-original-title="Return & Refunds" title="Return & Refunds" @click="$data.tab = 6">Return & Refunds</a>
                            </li>
                        </ul>
                        <div class="tab-content" id="homeTabContent" v-if="$data.tab == 1">
                            <HomeTab @fetch-company="fetch" @update-company="updateCompany" :company.sync="$data.company" />
                        </div>
                        <div class="tab-content" id="privacyTabContent" v-if="$data.tab == 2">
                            <PrivacyTab @update-company="updateCompany" :company.sync="$data.company" />
                        </div>
                        <div class="tab-content" id="termsandconditionsTabContent" v-if="$data.tab == 3">
                            <TermsAndConditionsTab @update-company="updateCompany" :company.sync="$data.company" />
                        </div>
                        <div class="tab-content" id="aboutusTabContent" v-if="$data.tab == 4">
                            <AboutUsTab @update-company="updateCompany" :company.sync="$data.company" />
                        </div>
                        <div class="tab-content" id="faqTabContent" v-if="$data.tab == 5">
                            <FaqTab @update-company="updateCompany" :company.sync="$data.company" />
                        </div>
                        <div class="tab-content" id="returnrefundTabContent" v-if="$data.tab == 6">
                            <ReturnRefundsTab @update-company="updateCompany" :company.sync="$data.company" />
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
import { AboutUsTab, FaqTab, HomeTab, PrivacyTab, TermsAndConditionsTab, ReturnRefundsTab } from './tabs';

// Magin variables
const $api  = inject('$api');

// Reactive data
const $data = reactive({ company: Object(), tab: 1, loader: Boolean() });


/**
 * Fetches company information from the server and updates the component's 
 * reactive data object with the fetched data.
 *
 * @return {Promise<void>} A promise that resolves when the data has been fetched 
 * and the component's reactive data object has been updated.
 */
const fetch = async () => {
    try {
        // Set the loader to true to indicate that a request is being made
        $data.loader = Boolean(true);

        // Fetch company information from the server
        let { data:{ company } } = await $api.get('/dashboard/website');

        // Update the component's reactive data object with the fetched data
        $data.company = cloneDeep(company);

        // Set the loader to false to indicate that the request is complete
        $data.loader = Boolean();
    } catch(error) {
        // Set the loader to false to indicate that the request has failed
        $data.loader = Boolean();
    }
}

/**
 * Updates the company details based on the provided data.
 * 
 * @param {Object} data - The data containing the updated company details.
 */
const updateCompany = (data) => {
    // Check if data has banners
    if( has(data,'banners') ){
        // Update the banners in the company object
        console.log(data)
        $data.company.banners = data.banners;
    }
    
    // Check if data has privacy policy
    if( has(data,'privacy_policy') ){
        // Update the privacy policy in the company object
        $data.company.privacy_policy = data.privacy_policy;        
    }
    
    // Check if data has terms and conditions
    if( has(data,'terms_conditions') ){
        // Update the terms and conditions in the company object
        $data.company.terms_conditions = data.terms_conditions;        
    }
    
    // Check if data has FAQs
    if( has(data,'faqs') ){
        // Update the FAQs in the company object
        $data.company.faqs = data.faqs;        
    }
    
    // Check if data has about us content
    if( has(data,'about_us') ){
        // Update the about us content in the company object
        $data.company.about_us = data.about_us;        
    }
    
    // Check if data has return and refunds content
    if( has(data,'return_refunds') ){
        // Update the return and refunds content in the company object
        $data.company.return_refunds = data.return_refunds;        
    }            
}

onBeforeMount( () => fetch())
</script>