<template>
    <div class="tab-pane fade active show" id="termsandconditions" role="tabpanel" aria-labelledby="termsandconditions-tab">
        <div class="col-lg-6 col-md-12 col-xs-12 px-0" style="min-height: 100%;">
            <QuillEditor v-model="terms_conditions" />
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
const terms_conditions = computed( () => $props.company.terms_conditions );

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
        let { data } = $api.put('/dashboard/website/terms', { terms_conditions: terms_conditions.value });    
        $data.loader = Boolean();
        emit('update-company',data);
    } catch(error) {
        $data.loader = Boolean();
    }
}

</script>