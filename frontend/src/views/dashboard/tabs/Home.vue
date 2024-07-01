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
            @fetch="$emit('fetch-company')"
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
const $emit   = defineEmits(['fetch-company']);
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
 * Prompts the user to confirm the deletion of a banner image.
 * If the user confirms, the `removeBanner` function is called.
 *
 * @param {Object} item - The banner image to be deleted.
 */
const deleteBanner = (item) => {
    // Show a confirmation dialog to the user
    $swal?.fire({
        icon: 'question', // Icon to display in the dialog
        title: 'Delete Banner', // Title of the dialog
        text: 'Are you want to delete this banner image ?', // Text content of the dialog
        showCancelButton: true // Whether to show a "Cancel" button
    }).then((result: any) => {
        // If the user confirms the deletion
        if( result.isConfirmed ) {
            // Call the function to remove the banner image
            removeBanner(item);
        }
    });	
}

/**
 * Delete banner image
 *
 * @param {Object} item - The banner image to be deleted.
 * @returns {Promise} A promise that resolves when the banner has been deleted.
 */
const removeBanner = async (item) => {
    // Show a loader to indicate that the request is being processed
    $store.commit('loader',true);

    try {
        // Send a PUT request to delete the banner image from the server
        const { data: { company } } = await $api.put('/dashboard/website/banner',{
            banners: $data.company.banners.filter( banner => banner.path != item.path )
        });

        // Update the company data with the deleted banner image
        $data.company = cloneDeep(company);
    } catch (error) {
        // If an error occurs, show a loader to indicate that the request failed
        $store.commit('loader',false);
    } finally {
        // Hide the loader
        $store.commit('loader',false);
    }
}

/**
 * Updates the `add` property of the `modal` object.
 *
 * @param {boolean} value - The new value for the `add` property.
 * @returns {void} This function does not return anything.
 */
const updateModal = (value:boolean) => {
    // Update the `add` property of the `modal` object with the given value.
    $data.modal.add = value;
}

</script>