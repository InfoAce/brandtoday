<template>
    <div class="tab-pane fade show active" id="security">
        <div class="row">
            <div class="col-12">
                <div class="card mt-0">
                    <div class="card-body">
                        <div class="dashboard-box">
                            <div class="dashboard-detail">
                                <div class="col-md-6 my-2">
                                    <label for="current_password">Current Password</label>
                                    <input type="password" class="form-control" id="current_password" placeholder="Current Password" v-model="$data.form.current_password">     
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'current_password')">{{ $data.errors.current_password }}</p>	
                                </div> 
                                <div class="col-md-6 my-2">
                                    <label for="new_password">New Password</label>
                                    <input type="password" class="form-control" id="new_password" placeholder="New Password" v-model="$data.form.new_password">    
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'new_password')">{{ $data.errors.new_password }}</p>	
                                </div> 
                                <div class="col-md-6 my-2">
                                    <label for="confirm_new_password">Confirm New Password</label>
                                    <input type="password" class="form-control" id="confirm_new_password" placeholder="Confirm new password" v-model="$data.form.confirm_new_password">   
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'confirm_new_password')">{{ $data.errors.confirm_new_password }}</p>	
                                </div>     
                                <div class="col-12">
                                    <button type="button" class="btn btn-solid btn-xs" @click="updatePassword" :disabled="$data.isDisabled || $data.loader">Save</button>            
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</template>

<script lang="ts" setup>
import { inject, reactive, watch } from 'vue';
import { each, isEmpty, has } from 'lodash';
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { useStore } from 'vuex';

// Magic variables
const $api   = inject('$api');
const $store = useStore();
const $toast = toast;
const $data  = reactive({
    errors: {},
    form: {
        current_password:     String(),
        new_password:         String(),
        confirm_new_password: String(),
    },
    isDisabled: true,
    loader:     false
});
const formSchema = yup.object().shape({
	current_password:     yup.string().required("*Current password is required"),                         
	new_password:         yup.string().required("*New password is required"),  
    confirm_new_password: yup.string()
                             .required("*Confirmation new password is required")
                             .oneOf(
                              [
                                yup.ref('new_password'), 
                                null
                              ], 
                              'New password mismatch'
                            ),                       
});

// Methods
const updatePassword = () => {
    $data.loader = true;
    $api.post('/account/security',$data.form)
        .then( () => {
            $toast.success(`Password updated successfully`);
            resetForm();
        })
        .catch( ({ response }) => {

            if( response.status == 401 ){
                $toast.error(`The current password is incorrect. Please try again`);
            }

            if( response.status == 400 ){
                response.data.message.forEach( (value:string) => {
                    $toast.error(value);
                })
            }

            $data.loader = false;
        })
        .finally( () => {
            $data.loader = false;
        });
}

const resetForm = () => {
    $data.form = {
        current_password:     String(),
        new_password:         String(),
        confirm_new_password: String(),
    }
}

const validateForm = (field) => {
	formSchema.validateAt(field, $data.form)
              .then((value,key) => {
                delete $data.errors[field];
               })
              .catch((err) => {
                $data.errors[err.path] = err.message;
              })
              .finally( () => {
                $data.isDisabled = !isEmpty($data.errors);
              })
}


// Watch form data
watch(
	() => $data.form, 
	(form) => {
		each(form,(value,key) => {
			validateForm(key);
		});
	},
	{ 
		deep: true,
	}
);

</script>