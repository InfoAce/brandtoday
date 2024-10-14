<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container-fluid">
                <div class="row px-4">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h4>Forgot Password</h4>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <nav aria-label="breadcrumb" class="theme-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                                <li class="breadcrumb-item active">Forgot Password</li>
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
                            <form class="theme-form" @submit.prevent="forgot">
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="text" class="form-control mb-2" id="email" placeholder="Email Address" v-model="data.form.email" required="">
                                    <p class="text-danger col col-12 mt-0" v-show="has(data.errors,'email')">{{data.errors.email}}</p>								
                                </div>
                                <button type="submit" class="btn btn-solid" :disabled="data.isDisabled || data.loading.forgot"><i class="fa fa-spinner fa-spin mr-2" v-if="data.loading.forgot"></i>Send</button>
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
    import { inject, reactive, watch } from 'vue';
    import { each, isEmpty, has } from 'lodash';
    import * as yup from "yup";
    import { toast  } from "vue3-toastify";
    
    const $toast = inject('$toast');
    const $api   = inject('$api');
    const swal   = inject('$swal');
    
    const data   = reactive({
        errors: {},
        form: {
            email: String(),
        },
        loading: {
            reset: Boolean()
        },
        isDisabled: true
    });
    
    const formSchema = yup.object().shape({
        email:            yup.string()
                             .email("*Enter a valid email address")
                             .required("*Email address is required"),
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
    const forgot = async () => {
        
        // Set the loading state to true
        data.loading.forgot = true;
        
        try {
            // Send a POST request to the login endpoint
            await $api.post('/auth/reset', data.form);
            
            // Display a success message
            $toast.success('Password reset link has been sent to your email address');
    
            // Reset the form data to its initial state
            resetForm();
    
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
            data.loading.forgot = false;        
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
            email: String()
        };
    }
    
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
        