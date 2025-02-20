<template>
<div>
	<!-- breadcrumb start -->
	<div class="breadcrumb-section">
		<div class="container">
			<div class="row">
				<div class="col-sm-6">
					<div class="page-title">
						<h4>Login</h4>
					</div>
				</div>
				<div class="col-sm-6">
					<nav aria-label="breadcrumb" class="theme-breadcrumb">
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
							<li class="breadcrumb-item active">Login</li>
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
				<div class="col-lg-6">
					<h3>Login</h3>
					<div class="theme-card">
						<form class="theme-form" @submit.prevent="login">
							<div class="form-group">
								<label for="email">Email</label>
								<input type="text" class="form-control mb-2" id="email" placeholder="Email" v-model="data.form.email" required="">
								<p class="text-danger col col-12 mt-0" v-show="has(data.errors,'email')">{{data.errors.email}}</p>								
							</div>
							<div class="form-group">
								<label for="password">Password</label>
								<input type="password" class="form-control mb-2" id="password" v-model="data.form.password" placeholder="Enter your password" required="">
								<p class="text-danger col col-12 mt-0" v-show="has(data.errors,'password')">{{data.errors.password}}</p>								
							</div>
							<div class="col-12 d-flex justify-content-between align-items-center px-0">
								<button type="submit" class="btn btn-theme btn-lg" :disabled="data.isDisabled">Login</button>
								<router-link :to="router.resolve({ name: 'ForgotPassword' }).path">Forgot Password</router-link>
							</div>
						</form>
					</div>
				</div>
				<div class="col-lg-6 right-login">
					<h3>New Customer</h3>
					<div class="theme-card authentication-right">
						<h6 class="title-font">Create A Account</h6>
						<p>Sign up for a free account at our store. Registration is quick and easy. It allows you to be
							able to order from our shop. To start shopping click register.</p>
							<router-link to="signup" class="btn btn-theme btn-lg w-100">Create an Account</router-link >
					</div>
				</div>
			</div>
		</div>
	</section>
	<!--Section ends-->
		
</div>	
</template>

<script setup>
import { inject, reactive, ref, watch } from 'vue';
import { each, get, isEmpty, has } from 'lodash';
import { useRoute, useRouter } from 'vue-router';
import * as yup from "yup";
import { toast  } from "vue3-toastify";
import { useStore } from 'vuex';
import localStorage from 'reactive-localstorage';

const store  = useStore();
const $route  = useRoute();
const router = useRouter();
const $api   = inject('$api');
const swal   = inject('$swal');

const data   = reactive({
	errors: {},
	form: {
		email:            String(),
		password:         String(),
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
 * Validates a form field based on the provided field name.
 * Uses the formSchema to validate the field and updates the errors object accordingly.
 * Updates the isDisabled property based on the presence of errors.
 *
 * @param {string} field - The name of the field to validate.
 */
const validateForm = (field) => {
	// Validate the field using the formSchema
	formSchema.validateAt(field, data.form)
        .then((value,key) => {
			// If the field is valid, delete the corresponding error from the errors object
			delete data.errors[field];
		})
        .catch((err) => {
          // If the field is invalid, update the errors object with the error message
          data.errors[err.path] = err.message;
        })
		.finally(() => {
			// Update the isDisabled property based on the presence of errors
			data.isDisabled = !isEmpty(data.errors);
		})
}

/**
 * Logs in a user by sending a POST request to the /auth/login endpoint.
 * If the login is successful, the user's authentication data is stored in the Vuex store.
 * A success message is displayed using sweetalert2 and the page is reloaded.
 * If the login fails, different error messages are displayed based on the response status.
 */
const login = () => {
	// Show loader while the login request is being processed
	store.commit('loader', true);

	// Send a POST request to the /auth/login endpoint with the user's login data
	$api.post('/auth/login', data.form)
		.then(({ data: { user, token } }) => {
			// If the request is successful, save the user and token to local storage
			localStorage.setItem(`${get(store.getters.env, 'VITE_APP_ID')}`, JSON.stringify({ user, token }));
			
			// Check if the redirect query parameter is present
			if( !isEmpty($route.query) ){
				const { redirect } = $route.query;
				router.push({ path: atob(redirect) });
			}

			// Check if the redirect query parameter is present
			if( isEmpty($route.query) ) {
				// Redirect the user to the overview page
				router.push({ name: 'Home' });
			}
		})
		.catch((error) => {
			
			// Hide the loader
			store.commit('loader', false);

			if( has(error,'response') ){
				const { response } = error;
				// Display different error messages based on the response status
				if (!isEmpty(response.data) && response.data.statusCode == 400) {
					response.data.message.forEach((value) => {
						toast.info(value);
					});
				}
				if (response.status == 404) {
					swal.fire({
						icon: 'error',
						title: 'Oops!',
						text: 'Sorry, we could not find your account. Register a new account.'
					});
				}
				if (response.status == 401) {
					swal.fire({
						icon: 'error',
						title: 'Oops!',
						text: 'Your email or password is incorrect.',
					});
				}
				if (response.status == 403) {
					swal.fire({
						icon: 'error',
						title: 'Oops!',
						text: 'Your account has not been verified.',
					});
				}
			}
		})
		.finally(() => {
			// Hide the loader
			store.commit('loader', false);
		});
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
	