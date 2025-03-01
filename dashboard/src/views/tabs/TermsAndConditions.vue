<template>
  <div class="tab-pane fade active show px-4" id="privacy" role="tabpanel" aria-labelledby="privacy-tab">
        <div class="row">
            <div class="col-lg-6 col-md-12 col-xs-12 px-0 mt-4" style="height: 100%;">
                <QuillEditor v-model:content="terms_conditions" contentType="html" theme="snow"/>
            </div>
            <div class="col-12 my-3 px-0">
                <button class="btn btn-primary" @click="saveChanges" >
                    <i class="fa fa-spin fa-spinner" v-if="$data.loader"></i>
                    Save Changes
                </button>
            </div> 
        </div>   
    </div>     
</template>
<script lang="ts" setup>
import { cloneDeep, isEmpty } from 'lodash';
import { computed, inject, defineEmits, defineProps, reactive } from 'vue';
import { useStore } from 'vuex';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// Magin variables
const $api   = inject('$api');
const $data  = reactive({ loader: Boolean() });

// Define emitters 
const emit   = defineEmits(['update-company']);

// Computed values
const terms_conditions = computed({
    get: ()      => $props.company.terms_conditions,
    set: (value) => emit('updateCompany',{ terms_conditions: value })
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
 * Save Changes
 * This function is triggered when the user clicks the "Save Changes" button.
 * It sends a PUT request to the server to update the terms and conditions.
 * If the request is successful, it emits an event to update the company data.
 * If there is an error, it sets the loader variable to false.
 */
const saveChanges = async () => {
    try {
        // Set loader to true to indicate that a request is being made
        $data.loader = Boolean(true);

        // Send a PUT request to the server to update the terms and conditions
        let { data } = await $api.put('/dashboard/website/terms', { terms_conditions: terms_conditions.value });

        // Set loader to false to indicate that the request is complete
        $data.loader = Boolean();

        // Emit an event to update the company data with the new terms and conditions
        emit('update-company', data);

    } catch(error) {
        // Set loader to false to indicate that the request has failed
        $data.loader = Boolean();
    }
}

</script>