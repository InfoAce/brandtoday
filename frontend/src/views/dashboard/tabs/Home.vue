<template>
    <div class="tab-pane fade active show" id="home" role="tabpanel" aria-labelledby="home-tab">
        <!-- Container-fluid starts-->
        <div class="container-fluid">
            <div class="col-12 d-flex justify-content-end">
                <button class="btn btn-primary" @click="$data.modal.add = true" >Add Image</button>
            </div>
            <div class="row products-admin ratio_asos">
                <template v-if="!isEmpty(banners)">
                    <div class="col-xl-4 col-sm-6"  v-for="(image,key) in banners" :key="key">
                        <div class="card">
                            <div class="card-body product-box">
                                <div class="img-wrapper">
                                    <div class="front">
                                        <a href="javascript:void(0)">
                                            <img :src="image.path" class="img-fluid blur-up lazyload bg-img" alt="">
                                        </a>
                                        <div class="product-hover">
                                            <ul>
                                                <li>
                                                    <button class="btn" type="button"><i class="ti-pencil-alt"></i></button>
                                                </li>
                                                <li>
                                                    <button class="btn" type="button" @click="deleteBanner(image)"><i class="ti-trash"></i></button>
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
                </template>
                <template v-else>
                    <div class="col-12 text-center px-6 card card-body">
                        <h4><i class="fa fa-exclamation-circle"></i> Nothing found here.</h4>
                    </div>
                </template>
            </div>
        </div>
        <AddBanner 
            :show="$data.modal.add" 
            @update-modal="updateModal" 
        />
        <!-- Container-fluid Ends-->
    </div>    
</template>
<script lang="ts" setup>
import { AddBanner } from '../modals';
import { cloneDeep, isEmpty } from 'lodash';
import { computed, inject, defineEmits, defineProps, reactive } from 'vue';
import { useStore } from 'vuex';


// Magin variables
const $api  = inject('$api');
const $data = reactive({
    modal: {
        add:  Boolean(),
        edit: Boolean()
    }
});
// Define emitters 
const emit    = defineEmits(['update-company']);
const $store  = useStore();
const $swal   = inject('$swal');
const banners = computed( () => $props.company.banners ?? []);

// Component Props
const $props  = defineProps({
    company: {
        default: () => Object,
        type:    Object
    }
});

// Methods

/**
 * Delete banner prompt
 * @param item 
 */
const deleteBanner = (item) => {
    $swal?.fire({
        icon: 'question',
        title: 'Delete Banner',
        text: 'Are you want to delete this banner image ?',
        showCancelButton: true
    }).then((result: any) => {
        if( result.isConfirmed ){
            removeBanner(item);        
        }
    });	
}

/**
 * Delete banner image
 */
const removeBanner = (item) => {
    $store.commit('loader',true);
    $api.put(
            '/dashboard/website/banner',
            { banners: $data.company.banners.filter( banner => banner.path != item.path ) }
        )
        .then( ({ data: { company } }) => {
            $data.company = cloneDeep(company);
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

</script>