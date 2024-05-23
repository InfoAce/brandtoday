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
                    <div class="card-body">                    
                        <ul class="nav nav-tabs tab-coupon" id="myTab" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active show" id="account-tab" data-bs-toggle="tab" href="#home" role="tab" aria-controls="account" aria-selected="true" data-original-title="" title="">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="permission-tabs" data-bs-toggle="tab" href="#home" role="tab" aria-controls="permission" aria-selected="false" data-original-title="" title=""></a>
                            </li>
                        </ul>
                        <div class="tab-content" id="myTabContent">
                            <HomeTab />
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
import { HomeTab } from './tabs';
</script>