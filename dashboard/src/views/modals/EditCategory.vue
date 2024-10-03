<template>
      <!-- Modal start -->
      <div class="modal theme-modal fade bd-example-modal-lg" id="editcategory" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">View Category</h5>
                    <button type="button" class="btn-close" @click="() => $emit('update-modal',false)" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="name" class="col-form-label">Name</label>
                        <input type="text" class="form-control" id="name" v-model="$data.category.name">
                        <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'name')">{{$data.errors.name}}</p>	
                    </div>
                    <div class="form-group">
                        <label for="show" class="col-form-label">Visible</label>
                        <div class="col-12">
                            <input type="checkbox" id="show" v-model="$data.category.show" />
                        </div>
                        <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'show')">{{$data.errors.show}}</p>	
                    </div>
                    <div class="form-group">
                        <label for="priority" class="col-form-label">Priotity</label>
                        <input type="number" class="form-control" id="priority" :min="1" v-model="$data.category.priority">
                        <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'priority')">{{$data.errors.priority}}</p>	
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="updateCategory()" class="btn btn-primary" type="button" :disabled="$data.isDisabled || $data.loading">
                        <i v-if="$data.loading" class="fa fa-spinner fa-spin"></i>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- modal end -->      
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, inject, reactive, watch } from 'vue';
import { cloneDeep, isEmpty, each, has, omit } from 'lodash';
import * as yup from "yup";

const $toast = inject('$toast');
const $api   = inject('$api');
const $emit  = defineEmits(['update-modal','fetch-categories']);
const $props = defineProps({
    data:{
        type:     Object,
        required: true
    },
    modal:{
        type:     Boolean,
        required: true
    }
});

const $data = reactive({
    category:   Object(),
    errors:     Object(),
    isDisabled: Boolean(true),
    loading:    Boolean()
})

const formSchema = yup.object().shape({
	code:     yup.string().required("*Code is required"),
	name:     yup.string().required("*Nameis required"),                         
    path:     yup.string().required("*Path is required"),   
	priority: yup.number().required("*Priotity is required"),       
	show:     yup.boolean().required("*Visibility is required"),                         
});

/**
 * Validates a form field based on the form schema.
 * Updates the errors object accordingly.
 * Updates the isDisabled property based on the presence of errors.
 * 
 * @param {string} field - The name of the field to validate.
 */
const validateForm = async (field) => {
    try {
        // Validate the field using the form schema
        const { value, key } = await formSchema.validateAt(field, $data.category);

        // If the validation is successful, remove any errors associated with the field
        delete $data.errors[field];
    } catch (error) {
        // If the validation fails, set the error message for the field
        $data.errors[error.path] = error.message;
    } finally {
        // Update the isDisabled state based on whether there are any errors
        $data.isDisabled = !isEmpty($data.errors);
    }
};

const updateCategory = async () => {
    try {
        // Show the loader
        $data.loading = true;

        const { id } = $props.data;

        // Fetch category
        const { data: { category } } = await $api.put(`/dashboard/categories/${id}/update`, $data.category);

        // Hide the loader
        $data.loading = false;

        // Set category to the reactive data
        $data.category = cloneDeep(category);

        $toast.success('Category updated successfully.');

        $emit('fetch-categories');
    } catch(error) {

        // Hide the loader
        $data.loading = false;

        // Show error message using swal
        $toast.error('Something went wrong while fetching category information. Please try again later.');
    }
}

/**
 * Creates a watcher for the form data. The watcher will validate the form data
 * whenever it changes and update the errors object accordingly.
 * 
 * @returns {import('vue').WatchStopHandle} A function that can be used to stop the
 * watcher.
 */
const createWatchForm = () => {
    /**
     * Watches for changes to the form data. Whenever the form data changes, it
     * iterates through the form data and calls the validateForm function for
     * each field. The validateForm function will validate the field and update
     * the errors object accordingly.
     * 
     * @param {Object} form - The form data.
     */
    const watchForm = watch(
        () => $data.category, 
        (form) => {
            each(form,(value,key) => {
                validateForm(key);
            });
        },
        { 
            deep: true,
        }
    );

};

watch(
    () => $props.modal,
    (modal) => {
        if( modal ){
            $('#editcategory').modal('show');
            $data.category = omit($props.data,['id','created_at','updated_at']);
            setTimeout( () => createWatchForm(), 500);
        }
        if( !modal ){
            $('#editcategory').modal('hide');
            setTimeout( () => {
                $data.category = Object();
                $data.errors   = Object();
            },500);
        }
    },
    {
        deep:      true,
        immediate: true
    }
)

</script>