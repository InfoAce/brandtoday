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
                            <div class="tab-pane fade active show" id="account" role="tabpanel" aria-labelledby="home-tab">
                                <!-- Container-fluid starts-->
                                <div class="container-fluid">
                                    <div class="col-12 d-flex justify-content-end">
                                        <button class="btn btn-primary" @click="$data.modal.add = true" >Add Image</button>
                                    </div>
                                    <div class="row products-admin ratio_asos">
                                        <div class="col-xl-4 col-sm-6" v-for="(image,key) in $data.company.banners" :key="key">
                                            <div class="card">
                                                <div class="card-body product-box">
                                                    <div class="img-wrapper">
                                                        <div class="front">
                                                            <a href="javascript:void(0)">
                                                                <img :src="`${backendUri}/${image.path}`" class="img-fluid blur-up lazyload bg-img" alt="">
                                                            </a>
                                                            <div class="product-hover">
                                                                <ul>
                                                                    <li>
                                                                        <button class="btn" type="button" data-original-title=""
                                                                            title=""><i class="ti-pencil-alt"></i></button>
                                                                    </li>
                                                                    <li>
                                                                        <button class="btn"><i class="ti-trash"></i></button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="product-detail">    
                                                        <h4>{{ image.title }}</h4>
                                                        <h6>{{ image.description }}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>                        
                                    </div>
                                </div>
                                <AddBannser 
                                    :show="$data.modal.add" 
                                    @update-modal="updateModal" 
                                    @fetch-data="fetch"
                                />
                                <!-- Container-fluid Ends-->
                            </div>
                            <div class="tab-pane fade" id="permission" role="tabpanel"
                                aria-labelledby="permission-tabs">
                                <form class="needs-validation user-add" novalidate="">
                                    <div class="permission-block">
                                        <div class="attribute-blocks">
                                            <h5 class="f-w-600 mb-3">Product Related permition </h5>
                                            <div class="row">
                                                <div class="col-xl-3 col-sm-4">
                                                    <label>Add Product</label>
                                                </div>
                                                <div class="col-xl-9 col-sm-8">
                                                    <div
                                                        class="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                        <label class="d-block" for="edo-ani1">
                                                            <input class="radio_animated" id="edo-ani1"
                                                                type="radio" name="rdo-ani">
                                                            Allow
                                                        </label>
                                                        <label class="d-block" for="edo-ani2">
                                                            <input class="radio_animated" id="edo-ani2"
                                                                type="radio" name="rdo-ani" checked="">
                                                            Deny
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xl-3 col-sm-4">
                                                    <label>Update Product</label>
                                                </div>
                                                <div class="col-xl-9 col-sm-8">
                                                    <div
                                                        class="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                        <label class="d-block" for="edo-ani3">
                                                            <input class="radio_animated" id="edo-ani3"
                                                                type="radio" name="rdo-ani1">
                                                            Allow
                                                        </label>
                                                        <label class="d-block" for="edo-ani4">
                                                            <input class="radio_animated" id="edo-ani4"
                                                                type="radio" name="rdo-ani1" checked="">
                                                            Deny
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xl-3 col-sm-4">
                                                    <label>Delete Product</label>
                                                </div>
                                                <div class="col-xl-9 col-sm-8">
                                                    <div
                                                        class="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                        <label class="d-block" for="edo-ani5">
                                                            <input class="radio_animated" id="edo-ani5"
                                                                type="radio" name="rdo-ani2">
                                                            Allow
                                                        </label>
                                                        <label class="d-block" for="edo-ani6">
                                                            <input class="radio_animated" id="edo-ani6"
                                                                type="radio" name="rdo-ani2" checked="">
                                                            Deny
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xl-3 col-sm-4">
                                                    <label class="mb-0 sm-label-radio">Apply
                                                        discount</label>
                                                </div>
                                                <div class="col-xl-9 col-sm-8">
                                                    <div
                                                        class="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated pb-0">
                                                        <label class="d-block mb-0" for="edo-ani7">
                                                            <input class="radio_animated" id="edo-ani7"
                                                                type="radio" name="rdo-ani3">
                                                            Allow
                                                        </label>
                                                        <label class="d-block mb-0" for="edo-ani8">
                                                            <input class="radio_animated" id="edo-ani8"
                                                                type="radio" name="rdo-ani3" checked="">
                                                            Deny
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="attribute-blocks">
                                            <h5 class="f-w-600 mb-3">Category Related permition </h5>
                                            <div class="row">
                                                <div class="col-xl-3 col-sm-4">
                                                    <label>Add Category</label>
                                                </div>
                                                <div class="col-xl-9 col-sm-8">
                                                    <div
                                                        class="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                        <label class="d-block" for="edo-ani9">
                                                            <input class="radio_animated" id="edo-ani9"
                                                                type="radio" name="rdo-ani4">
                                                            Allow
                                                        </label>
                                                        <label class="d-block" for="edo-ani10">
                                                            <input class="radio_animated" id="edo-ani10"
                                                                type="radio" name="rdo-ani4" checked="">
                                                            Deny
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xl-3 col-sm-4">
                                                    <label>Update Category</label>
                                                </div>
                                                <div class="col-xl-9 col-sm-8">
                                                    <div
                                                        class="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                        <label class="d-block" for="edo-ani11">
                                                            <input class="radio_animated" id="edo-ani11"
                                                                type="radio" name="rdo-ani5">
                                                            Allow
                                                        </label>
                                                        <label class="d-block" for="edo-ani12">
                                                            <input class="radio_animated" id="edo-ani12"
                                                                type="radio" name="rdo-ani5" checked="">
                                                            Deny
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xl-3 col-sm-4">
                                                    <label>Delete Category</label>
                                                </div>
                                                <div class="col-xl-9 col-sm-8">
                                                    <div
                                                        class="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated">
                                                        <label class="d-block" for="edo-ani13">
                                                            <input class="radio_animated" id="edo-ani13"
                                                                type="radio" name="rdo-ani6">
                                                            Allow
                                                        </label>
                                                        <label class="d-block" for="edo-ani14">
                                                            <input class="radio_animated" id="edo-ani14"
                                                                type="radio" name="rdo-ani6" checked="">
                                                            Deny
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xl-3 col-sm-4">
                                                    <label class="mb-0 sm-label-radio">Apply
                                                        discount</label>
                                                </div>
                                                <div class="col-xl-9 col-sm-8">
                                                    <div
                                                        class="form-group m-checkbox-inline custom-radio-ml d-flex radio-animated pb-0">
                                                        <label class="d-block mb-0" for="edo-ani15">
                                                            <input class="radio_animated" id="edo-ani15"
                                                                type="radio" name="rdo-ani7">
                                                            Allow
                                                        </label>
                                                        <label class="d-block mb-0" for="edo-ani16">
                                                            <input class="radio_animated" id="edo-ani16"
                                                                type="radio" name="rdo-ani7" checked="">
                                                            Deny
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Container-fluid Ends-->
  </div>    
</template>
<script lang="ts" setup>
import { AddBannser } from './modals';
import { computed, inject, onBeforeMount, reactive } from 'vue';
import { useStore } from 'vuex';

// Magin variables
const $api  = inject('$api');
const $data = reactive({
    company: Object(),
    modal: {
        add:  Boolean(),
        edit: Boolean()
    }
});
const $store = useStore();

// Computed variables //
const backendUri = computed( () => $store.getters.env.VITE_API_BASE_URL.replace('api/v1','') );

// Methods
const fetch = () => {
    $store.commit('loader',true);
    $api.get('/dashboard/website')
        .then( ({ data: { company } }) => {
            $data.company = company;
        })
        .catch( () => {
            $store.commit('loader',false);
        })
        .finally( () => {
            $store.commit('loader',false);
        });
}

const updateModal = (value:boolean) => {
    $data.modal.add = value;
}

onBeforeMount( () => fetch())
</script>