<template>
    <div class="tab-pane fade active show px-4" id="privacy" role="tabpanel" aria-labelledby="aboutus-tab">
        <div class="row">
            <div class="col-lg-6 d-flex justify-content-end">
                <button class="btn btn-primary" @click="$data.modal = true" >Add Service Fee</button>
            </div>
            <div class="col-12 mt-5">
                <div class="table-responsive table-desi col-lg-6">
                    <table class="review-table table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Charge Type</th>
                                <th>Amount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        <template v-if="!isEmpty(service_fees)">
                            <tr v-for="(service,index) in service_fees" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ service.name }}</td>
                                <td><span class="badge badge-info">{{ service.type }}</span></td>
                                <td>{{ service.amount }}</td>
                                <td>
                                    <button class="btn btn-xs btn-solid" @click="removeService(service)" ><i class="fa fa-trash"></i></button>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr>
                                <td colspan="5" class="text-center p-3">
                                    <h4 class="mb-0"><i class="fa fa-exclamation-triangle"></i> Nothing found here.</h4>
                                </td>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                </div>
            </div>
            <AddServiceFee 
                :modal="$data.modal" 
                @update-modal="updateModal"             
                @fetch="$emit('fetchCompany')" 
            />
        </div>   
    </div>     
</template>
<script lang="ts" setup>
import { cloneDeep, isEmpty } from 'lodash';
import { computed, inject, defineEmits, defineProps, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { AddServiceFee } from '../modals'
// Magin variables
const $swal  = inject('$swal');
const $api   = inject('$api');
const $data  = reactive({ modal: false, loader: Boolean() });

// Define emitters 
const $emit   = defineEmits(['fetchCompany','updateCompany']);

// Computed values
const service_fees = computed({
    get: ()      => $props.company.service_fees,
    set: (value) => $emit('updateCompany',{ service_fees: value })
});

// Component Props
const $props  = defineProps({
    company: {
        default: () => Object,
        type:    Object
    }
});

// Methods

const removeService = (service) => {
    // Show a confirmation dialog to the user
    $swal?.fire({
        icon: 'question', // Icon to display in the dialog
        title: 'Delete Service Fee', // Title of the dialog
        text: 'Are you want to delete this service fee ?', // Text content of the dialog
        showCancelButton: true // Whether to show a "Cancel" button
    }).then((result: any) => {
        // If the user confirms the deletion
        if( result.isConfirmed ) {
            // Call the function to remove the banner image
            deleteSevice(service);
        }
    });	
}

/**
 * Save Changes
 * This function is triggered when the user clicks the "Save Changes" button.
 * It sends a PUT request to the server to update the terms and conditions.
 * If the request is successful, it emits an event to update the company data.
 * If there is an error, it sets the loader variable to false.
 */
 const deleteSevice = async (service) => {
    try {
        // Set loader to true to indicate that a request is being made
        $data.loader = Boolean(true);

        const fees = cloneDeep(service_fees.value).filter( val => val.key != service.key );

        // Send a PUT request to the server to update the terms and conditions
        let { data } = await $api.put('/dashboard/website/service_fees', { service_fees: fees });

        // Set loader to false to indicate that the request is complete
        $data.loader = Boolean();

        // Emit an event to update the company data with the new terms and conditions
        $emit('fetch-company');

    } catch(error) {
        console.log(error);
        // Set loader to false to indicate that the request has failed
        $data.loader = Boolean();
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
    $data.modal = value;
}

</script>