<template>
    <!-- Modal start -->
    <div class="modal theme-modal fade bd-example-modal-lg" id="addservicecost" tabindex="-1" role="dialog" data-keyboard="false" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Add Order Service Fee</h5>
                  <button type="button" class="btn-close" @click="() => $emit('update-modal',false)" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="modal-body">
                  <div class="form-group">
                      <label for="name" class="col-form-label">Name</label>
                      <input type="text" class="form-control" id="first_name" placeholder="Name" v-model="$data.form.name">
                      <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'name')">{{$data.errors.name}}</p>	
                  </div>
                  <div class="form-group">
                      <label for="type" class="col-form-label">Type</label>
                      <select class="form-control" id="type" v-model="$data.form.type">
                        <option value="">*Select Type</option>
                        <option value="fixed">Fixed</option>
                        <option value="percentage">Percentage</option>
                      </select>
                      <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'type')">{{$data.errors.type}}</p>	
                  </div>
                  <div class="form-group">
                      <label for="amount" class="col-form-label">Amount</label>
                      <input type="number" class="form-control" id="amount" placeholder="Amount" v-model="$data.form.amount" min="0">
                      <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'amount')">{{$data.errors.amount}}</p>	
                  </div>
              </div>
              <div class="modal-footer">
                  <button @click="saveChanges()" class="btn btn-primary" type="button" :disabled="$data.isDisabled || $data.loading">
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
const $emit  = defineEmits(['update-modal','fetch']);
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
  form:       {
    name:   String(),
    amount: Number(),
    type:   String(),
  },
  errors:     Object(),
  isDisabled: Boolean(true),
  loading:    Boolean()
})

const formSchema = yup.object().shape({
  type:   yup.string().required("*Type is required"),
  name:   yup.string().required("*Name is required"),                         
  amount: yup.number().required("*Amount is required").test( val => val != 0),                                             
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
    const { value, key } = await formSchema.validateAt(field, $data.form);

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

const saveChanges = async () => {
  try {
      // Show the loader
      $data.loading = true;

      // Fetch category
      await $api.post(`/dashboard/website/service_fees`, $data.form);

      $toast.success('Service cost added successfully.');

      // Reset form
      resetForm();
      
      // Update company details
      $emit('fetch');

      // Hide modal
      $emit('update-modal', false);
  } catch(error) {

      // Hide the loader
      $data.loading = false;

      // Show error message using swal
      $toast.error('Something went wrong while saving the service information. Please try again later.');
  } finally {
      // Hide the loader
      $data.loading = false;
  }
}

/**
 * Resets the form data to its initial state.
 *
 * @return {void}
 */
const resetForm = () => {
  $data.form = {
    name:   String(),
    type:   String(),
    amount: Number()
  }
}


watch(
    () => $props.modal,
    (modal) => {
        if( modal === true){
            $('#addservicecost').modal('show');
        }
        if( modal === false){
            $('#addservicecost').modal('hide');
        }
    }
)

watch(
    () => $data.form, 
    (form) => {
        each(form,(value,key) => {
            validateForm(key);
        });
    },
    { 
        deep: true,
        immediate: true
    }
); 

</script>