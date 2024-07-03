<template>
    <!-- page-wrapper Start-->
    <div class="page-wrapper">
        <div class="authentication-box">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-7 p-0">
                        <div class="card tab2-card card-login">
                            <div class="card-body">
								<div class="col-12 text-center my-4">
									<h2>Login</h2>
									<p class="text-danger">Enter valid credentials.</p>
								</div>
								<form class="form-horizontal auth-form" @submit.prevent="login" autocomplete="off">
									<div class="form-group">
										<input name="email" type="email" class="form-control" v-model="data.form.email" placeholder="Email Address" >
										<p class="text-danger mb-0" v-show="has(data.errors,'email')">{{data.errors.email}}</p>								
									</div>
									<div class="form-group">
										<input name="password" type="password" v-model="data.form.password" class="form-control" placeholder="Password">
										<p class="text-danger mb-0" v-show="has(data.errors,'password')">{{data.errors.password}}</p>								
									</div>
									<div class="form-terms my-4">
										<div class="form-check mesm-2">
											<a href="javascript:void(0)" class="forgot-pass">Forgot Password!</a>
										</div>
									</div>
									<div class="form-button">
										<button class="btn btn-dark" :disabled="data.isDisabled || data.loading.login" type="submit">
											<i class="fa fa-spinner fa-spin" v-if="data.loading.login"></i>
											Login
										</button>
									</div>									
								</form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, reactive, ref, watch, onMounted, onBeforeMount } from 'vue';
import { debounce, each, get, isEmpty, has } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";
import { toast  } from "vue3-toastify";
import { useStore } from 'vuex';
import localStorage from 'reactive-localstorage';

const store  = useStore();
const router = useRouter();
const $api   = inject('$api');
const swal = inject('$swal');

const data   = reactive({
	errors: {},
	form: {
		email:            String(),
		password:         String(),
	},
	loading: {
		login: Boolean()
	},
	isDisabled: true
});

const formSchema = yup.object().shape({
	email:            yup.string()
						 .email("*Enter a valid email address")
						 .required("*Email address is required"),
	password:         yup.string()
						 .required("*Password is required"),
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
const login = () => {
	
	// Set the loading state to true
	data.loading.login = true;
	
	// Send a POST request to the login endpoint
	$api.post('/auth/login', data.form)
		.then( ({ data: { user, token } }) => {
			// If the request is successful, save the user and token to local storage
			localStorage.setItem(`${get(store.getters.env, 'VITE_APP_ID').replaceAll(' ', '')}`, JSON.stringify({ user, token }));
			
			setTimeout(() => {
				// Redirect the user to the overview page
				router.push({ name: 'Overview' });				
			}, 1000);
		})
		.catch((error) => {
			// If there is an error, handle the response
			store.commit('loader',false);
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
		})
		.finally(() => {
			// Set the loading state to false
			data.loading.login = false;
		});
}

onBeforeMount( debounce(() => {
	$('.single-item').slick({
		arrows: false,
		dots: true
	});
},0));

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
	