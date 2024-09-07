<template>
    <div class="tab-pane fade active show" id="brands" role="tabpanel" aria-labelledby="brands-tab">
        <CardLoader :loader="$data.loader" />
        <!-- Container-fluid starts-->
        <div class="container-fluid">
            <div class="col-12 d-flex justify-content-end">
                <button class="btn btn-primary" @click="$data.modal.add = true" >Add Image</button>
            </div>
            <div class="row products-admin ratio_asos">
                <template v-if="!isEmpty(brands)">
                    <div class="col-xl-4 col-sm-6"  v-for="(image,key) in brands" :key="key">
                        <div class="card">
                            <div class="card-body product-box">
                                <div class="img-wrapper">
                                    <div class="front">
                                        <a href="javascript:void(0)">
                                            <img :src="image.path" class="img-fluid lazyload" alt="">
                                        </a>
                                        <div class="product-hover">
                                            <ul>
                                                <li>
                                                    <button class="btn" type="button"><i class="fa fa-pencil"></i></button>
                                                </li>
                                                <li>
                                                    <button class="btn" type="button" @click="deleteBrand(image)"><i class="fa fa-trash text-danger"></i></button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            
                            </div>
                        </div>
                    </div>    
                </template>
                <template v-else>
                    <div class="col-12 text-center p-5">
                        <h4><i class="fa fa-exclamation-circle"></i> Nothing found here.</h4>
                    </div>
                </template>
            </div>
        </div>
        <AddBrand
            :show="$data.modal.add" 
            @update-modal="updateModal" 
            @fetch="$emit('fetchCompany')"
        />
        <!-- Container-fluid Ends-->
    </div>    
</template>
<script lang="ts" setup>
import { AddBrand } from '../modals';
import { cloneDeep, isEmpty } from 'lodash';
import { computed, inject, defineEmits, defineProps, reactive } from 'vue';
import { useStore } from 'vuex';
import { CardLoader } from '../../components';

// Magin variables
const $api  = inject('$api');
const $data = reactive({
    loader: false,
    modal: {
        add:  Boolean(),
        edit: Boolean()
    }
});

// Define emitters 
const $emit   = defineEmits(['fetchCompany','updateCompany']);
const $store  = useStore();
const $swal   = inject('$swal');

// Computed values
const brands = computed({
    get: ()      => $props.company.brands,
    set: (value) => $emit('updateCompany',{ brands: value })
});

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
const deleteBrand = (item) => {
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
            removeBrand(item);
        }
    });	
}

/**
 * Delete banner image
 *
 * This function deletes a banner image from the company's banners array.
 * It shows a loader to indicate that the request is being processed, and
 * updates the company data with the deleted banner image when the request
 * is complete.
 *
 * @param {Object} item - The banner image to be deleted.
 * @returns {Promise} A promise that resolves when the banner has been deleted.
 */
const removeBrand = async (item) => {
    // Show a loader to indicate that the request is being processed
    $data.loader = true;
    
    try {
        // Delete the banner image from the company's banners array
        const { data } = await $api.put('/dashboard/website/brand',{
            brands: $props.company.brands.filter( brand => brand.path != item.path )
        });
        
        // Update the company data with the deleted banner image
        $emit('update-company', data);
    } catch (error) {
        $data.loader = false;
    } finally {
        // Hide the loader
        $data.loader = false;
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