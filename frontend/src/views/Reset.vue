<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container-fluid">
                <div class="row px-4">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h4>Reset Password</h4>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <nav aria-label="breadcrumb" class="theme-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                                <li class="breadcrumb-item active">Reset Password</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <!-- breadcrumb End -->
    
    
        <!--section start-->
        <section class="login-page section-b-space">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6 mx-auto">
                        <div class="theme-card">
                            <form class="theme-form" @submit.prevent="reset">
                                <div class="form-group">
                                    <label for="new_password">New Password</label>
                                    <input type="password" class="form-control mb-2" id="new_password" placeholder="New Password" v-model="data.form.new_password" autocomplete="off">
                                    <p class="text-danger col col-12 mt-0" v-show="has(data.errors,'new_password')">{{data.errors.new_password}}</p>								
                                </div>
                                <div class="form-group">
                                    <label for="confirm_new_password">Confirm New Password</label>
                                    <input type="password" class="form-control mb-2" id="confirm_new_password" placeholder="Confirm New Password" v-model="data.form.confirm_new_password" autocomplete="off">
                                    <p class="text-danger col col-12 mt-0" v-show="has(data.errors,'confirm_new_password')">{{data.errors.confirm_new_password}}</p>								
                                </div>
                                <button type="submit" class="btn btn-solid" :disabled="data.isDisabled || data.loading.reset"><i class="fa fa-spinner fa-spin ml-2" v-if="data.loading.reset"></i>Reset</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!--Section ends-->
            
    </div>	
</template>
    
<script setup>
    import { inject, onBeforeMount, reactive, watch } from 'vue';
    import { each, isEmpty, has } from 'lodash';
    import * as yup from "yup";
    import { toast  } from "vue3-toastify";
    import { useRoute, useRouter } from 'vue-router';
    
    const $route  = useRoute();
    const $router = useRouter();
    const $toast  = inject('$toast');
    const $api    = inject('$api');
    const swal    = inject('$swal');
    
    const data   = reactive({
        errors: {},
        form: {
            confirm_new_password: String(),
            new_password:         String(),
        },
        loading: {
            reset: Boolean()
        },
        isDisabled: true
    });
    
    const formSchema = yup.object().shape({
        confirm_new_password: yup.string().required("*Confirmation new password is required").oneOf([yup.ref('new_password'), null], 'Password mismatch'),
        new_password:         yup.string().required("*New Password is required"),                             
    });
    
    /**
     * Validates the form field and updates the error state accordingly.
     * 
     * @param {string} field - The name of the field to validate.
     * @returns {void}
     */
    const validateForm = (field) => {
        // Validate the form field using the form schema
        formSchema.validateAt(field, data.form)
            .then((value,key) => {
                // If the validation is successful, remove the error message for the field
                delete data.errors[field];
            })
            .catch((err) => {
                // If there is an error, set the error message for the field
                data.errors[err.path] = err.message;
            })
            .finally( () => {
                // Update the isDisabled state based on whether there are any errors
                data.isDisabled = !isEmpty(data.errors);
            });
    }
    
    /**
     * Sends a login request to the API and handles the response.
     * 
     * @returns {void}
     */
    const reset = async () => {
        
        // Set the loading state to true
        data.loading.reset = true;
        
        try {
            // Retrieve the route parameters
            let { code } = $route.params;

            // Send a POST request to the login endpoint
            await $api.post(`/auth/${code}/password`,data.form);
            
            // Display a success message
            $toast.success('Password reset link has been sent to your email address');
    
            // Reset the form
            resetForm();

            $router.push({ name: 'Login'});
    
        } catch (error){

            if (has(error, 'response')) {
                if (!isEmpty(error.response.data) && error.response.data.statusCode == 400) {
                    // Display information about validation errors
                    error.response.data.message.forEach((value) => {
                        toast.info(value);
                    });
                }
                if (error.response.status == 404) {
                    // Display an error message if the account is not found
                    swal.fire({
                        icon: 'error',
                        title: 'Oops!',
                        text: 'Sorry we could not find your account. Register a new account.'
                    });
                }
                if (error.response.status == 401) {
                    // Display an error message if the email or password is incorrect
                    swal.fire({
                        icon: 'error',
                        title: 'Oops!',
                        text: 'Your email or password is incorrect.'
                    });
                }
                if (error.response.status == 403) {
                    // Display an error message if the account is not verified
                    swal.fire({
                        icon: 'error',
                        title: 'Oops!',
                        text: 'Your account has not been verified'
                    });
                }
            }
        } finally {
            // Set the loading state to false
            data.loading.reset = false;        
        }
    
    }

    const fetchUser = async() => {
        try {
            
            let { code } = $route.params;
            
            await $api.put(`/auth/user/${code}`);

        } catch(error) {
            console.log(error);
            // $router.push({ name: 'TokenNotFound' });
        } finally{

        }
    }
    
    /**
     * Resets the form data to its initial state.
     *
     * @return {void}
     */
    const resetForm = () => {
        // Reset the form data to its initial state
        data.form = {
            new_password: String(),
            confirm_new_password: String()
        };
    }

    onBeforeMount( () => fetchUser() )
    
    watch(
        () => data.form, 
        (form) => {
            each(form,(value,key) => {
                validateForm(key);
            });
        },
        { 
            deep: true
        }
    );
    
    </script>
        