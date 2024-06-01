<template>
    <div class="tab-pane fade active show" id="privacy" role="tabpanel" aria-labelledby="privacy-tab" style="height: 50vh;">
        <!-- Container-fluid starts-->
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-6 col-md-12 col-xs-12 px-0 mt-4" style="height: 50vh;">
                    <QuillEditor v-model:content="privacy_policy" contentType="html" theme="snow"/>
                </div>
            </div>
        </div>
        <div class="col-12 px-0  d-flex justify-content-end">
            <button class="btn btn-primary" @click="saveChanges" >Save Changes</button>
        </div>        
    </div>    
</template>
<script lang="ts" setup>
import { computed, defineProps, inject, onBeforeMount, reactive } from 'vue';
import { useStore } from 'vuex';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// Magin variables
const $api   = inject('$api');
const $data  = reactive({ loader: Boolean() });
const $store = useStore();

// Define emitters 
const emit   = defineEmits(['updateCompany']);

// Computed values
const privacy_policy = computed({
    get: ()      => $props.company.privacy_policy,
    set: (value) => emit('updateCompany',{ privacy_policy: value })
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
 */
 const saveChanges = async () => {
    try {
        $data.loader = Boolean(true);
        let { data } = $api.put('/dashboard/website/terms', { terms_conditions: privacy_policy.value });    
        $data.loader = Boolean();
        emit('update-company',data);
    } catch(error) {
        $data.loader = Boolean();
    }
}

</script>