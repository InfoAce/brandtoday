<template>
	<div>

	
    <!-- breadcrumb start -->
    <div class="breadcrumb-section">
        <div class="container">
            <div class="row">
                <div class="col-sm-6">
                    <div class="page-title">
                        <h2>create account</h2>
                    </div>
                </div>
                <div class="col-sm-6">
                    <nav aria-label="breadcrumb" class="theme-breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                            <li class="breadcrumb-item active" aria-current="page">create account</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
    </div>
    <!-- breadcrumb End -->


    <!--section start-->
    <section class="register-page section-b-space">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <h3>create account</h3>
                    <div class="theme-card">
                        <form class="theme-form" @submit.prevent="signup">
                            <div class="form-row row">
                                <div class="col-md-6">
                                    <label for="fname">First Name</label>
                                    <input type="text" class="form-control mb-2" autocomplete="off" id="fname" v-model="data.form.first_name" placeholder="First Name" required="">
                                    <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'first_name')">{{data.errors.first_name}}</p>	
                                </div>
                                <div class="col-md-6">
                                    <label for="lname">Last Name</label>
                                    <input type="text" class="form-control mb-2"  autocomplete="off" id="lname" v-model="data.form.last_name" placeholder="Last Name" required="">
                                    <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'last_name')">{{data.errors.last_name}}</p>	
                                </div>
                            </div>
                            <div class="form-row row">
                                <div class="col-md-6">
                                    <label for="email">email</label>
                                    <input type="text" class="form-control mb-2"  autocomplete="off" id="email" v-model="data.form.email" placeholder="Email" required="">
                                    <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'email')">{{data.errors.email}}</p>	
                                </div>
                                <div class="col-md-6">
                                    <label for="phone">Phone Number</label>
                                    <vue-tel-input 
                                        @input="getPhoneNumber" 
                                        defaultCountry="KE" 
                                        :inputOptions="{ styleClasses: 'form-control m-2', placeholder: 'Phone Number' }" 
                                        mode="international"
                                    />
                                    <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'phone_number')">{{data.errors.phone_number}}</p>	
                                    <!-- <input type="text" class="form-control"  autocomplete="off" id="email" v-model="data.form.phone" placeholder="Email" required=""> -->
                                </div>
                                <div class="col-md-6">
                                    <label for="password">Password</label>
                                    <input type="password" class="form-control mb-2" id="password" placeholder="Enter your password" v-model="data.form.password" required="">
                                    <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'password')">{{data.errors.password}}</p>	
                                </div>
                                <div class="col-md-6">
                                    <label for="confirm_password">Confirm Password</label>
                                    <input type="password" class="form-control mb-2" id="confirm_password" placeholder="Enter password confirmation" v-model="data.form.confirm_password" required="">
                                    <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'confirm_password')">{{data.errors.confirm_password}}</p>	
                                </div>
                                <div class="col-md-12 text-center">
                                    <button class="btn btn-solid w-auto mt-4" :disabled="data.isDisabled || data.loader.signup">
                                        <span v-if="data.loader.signup"><i class="fa fa-spinner fa-spin"></i></span>
                                        Create Account
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--Section ends-->
</div>
</template>

<script>
export default {
    mounted(){
       $('.vti__input').addClass('m-0 p-2');
    }
}
</script>

<script setup>
import { inject, reactive, ref, watch } from 'vue';
import { each, isEmpty, has } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { useStore } from 'vuex';
import { VueTelInput } from 'vue3-tel-input'
import 'vue3-tel-input/dist/vue3-tel-input.css'

const store  = useStore();
const router = useRouter();
const $api   = inject('$api');
const swal   = inject('$swal');

const data   = reactive({
	errors: {},
	form: {
		first_name:       String(),
		last_name:        String(),
		email:            String(),
		password:         String(),
		phone_number:     String(),
		confirm_password: String(),
	},
    loader: {
        signup: false
    },
	isDisabled: true
});

const formSchema = yup.object().shape({
	first_name:       yup.string()
						 .required("*First name is required"),
	email:            yup.string()
						 .email("*Enter a valid email address")
						 .required("*Email address is required"),                         
    last_name:        yup.string()
						 .required("*Last name is required"),
    phone_number:     yup.string()
						 .required("*Phone number is required"),                         
	confirm_password: yup.string()
                         .required("*Confirmation password is required")
                         .oneOf([yup.ref('password'), null], 'Password mismatch'),
	password:         yup.string()
						 .required("*Password is required"),                         
});

/**
 * Validates a form field based on the form schema.
 * @param {string} field - The field to validate.
 */
const validateForm = (field) => {
    // Validate the field in the form schema
    formSchema.validateAt(field, data.form)
        .then((value, key) => {
            // If the field is valid, remove any errors associated with it
            delete data.errors[field];
        })
        .catch((err) => {
            // If the field is invalid, set the error message for the field
            data.errors[err.path] = err.message;
        })
        .finally(() => {
            // Determine if any errors exist in the form and disable the form accordingly
            // Log the result to the console for debugging purposes
            console.log(!isEmpty(data.errors));
            data.isDisabled = !isEmpty(data.errors);
        });
}

/**
 * Submits the signup form.
 * Sends a POST request to the '/auth/signup' endpoint with the form data.
 * Displays a success message if the request is successful,
 * or an error message if the request fails.
 */
const signup = () => {
    // Set the loader to true
    data.loader.signup = true;

    // Send the POST request
    $api.post('/auth/signup',data.form)
        // If the request is successful
        .then( () => {
            // Display a success message
            swal.fire({
                icon: 'success',
                title: 'Alright!',
                text: 'Account successfully created. Check your email for account verification.'
            });
            resetForm();
        })
        // If the request fails
        .catch( ({ response }) => {
            // Reset the loader
            store.commit('loader',false);

            // If there are errors in the response
            if( !isEmpty(response.data) && response.data.statusCode == 400 ){
                // Display each error message
                response.data.message.forEach( (value) => {
                    toast.info(value);
                });
            }

            // If the status code is 404
            if( response.status == 404 ){
                // Display an error message
                swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'Sorry we could not your account. Register router-link new account.'
                });
            }

            // If the status code is 401
            if( response.status == 401 ){
                // Display an error message
                swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'Your email or password is incorrect.',
                });
            }
        })
        // Regardless of the outcome, reset the loader
        .finally( () => {
            data.loader.signup = false;
        });
}

/**
 * Update the phone number in the form data.
 *
 * @param {Event|String} $event - The event object or the phone number.
 * @return {void}
 */
const getPhoneNumber = ($event) => {
    // Check if the event is a string or not.
    // If it's a string, assign it to the phone number field.
    // If it's an event object, assign the value of the target to the phone number field.
    data.form.phone_number = $event.constructor == String ? $event : $event.target.value 
}


/**
 * Reset the form data to its initial state.
 *
 * @return {void}
 */
const resetForm = () => {
    // Reset the form data to its initial state
    data.form = {
        first_name:       String(), // First name
        last_name:        String(), // Last name
        email:            String(), // Email address
        password:         String(), // Password
        phone_number:     String(), // Phone number
        confirm_password: String(), // Confirmation password
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
		deep: true,
	}
);


</script>
	