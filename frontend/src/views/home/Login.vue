<template>
<div>
	<!-- breadcrumb start -->
	<div class="breadcrumb-section">
		<div class="container">
			<div class="row">
				<div class="col-sm-6">
					<div class="page-title">
						<h2>customer's login</h2>
					</div>
				</div>
				<div class="col-sm-6">
					<nav aria-label="breadcrumb" class="theme-breadcrumb">
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
							<li class="breadcrumb-item active">login</li>
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
							<button type="submit" class="btn btn-solid" :disabled="data.isDisabled">Login</button>
						</form>
					</div>
				</div>
				<div class="col-lg-6 right-login">
					<h3>New Customer</h3>
					<div class="theme-card authentication-right">
						<h6 class="title-font">Create A Account</h6>
						<p>Sign up for a free account at our store. Registration is quick and easy. It allows you to be
							able to order from our shop. To start shopping click register.</p>
							<router-link to="signup" class="btn btn-solid">Create an Account</router-link >
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
import { each, isEmpty, has } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { useStore } from 'vuex';

const store  = useStore();
const router = useRouter();
const $api   = inject('$api');
const toast  = useToast();
const swal = inject('$swal');

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

const validateForm = (field) => {
	formSchema.validateAt(field, data.form)
        .then((value,key) => {
			delete data.errors[field];
		})
        .catch((err) => {
          data.errors[err.path] = err.message;
        })
		.finally(() => {
			data.isDisabled = !isEmpty(data.errors);
		})
}

const login = () => {
	store.commit('loader',true);
	$api.post('/auth/login',data.form)
		.then( ({ data:{ user, token }}) => {
			store.commit('auth',{user, token});
			swal.fire({
				icon: 'success',
				title: 'Alright!',
				text: 'Login successfull.'
			}).then((result) => {
				window.location.reload();
			});	
		})
		.catch( ({ response }) => {
			store.commit('loader',false);
			if( !isEmpty(response.data) && response.data.statusCode == 400 ){
				response.data.message.forEach( (value) => {
					toast.info(value);
				});
			}
			if( response.status == 404 ){
				swal.fire({
					icon: 'error',
					title: 'Oops!',
					text: 'Sorry we could not your account. Register a new account.'
				});
			}
			if( response.status == 401 ){
				swal.fire({
					icon: 'error',
					title: 'Oops!',
					text: 'Your email or password is incorrect.',
				});
			}
			if( response.status == 403 ){
				swal.fire({
					icon: 'error',
					title: 'Oops!',
					text: 'Your account has not been verified',
				});
			}
		})
		.finally( () => {
			store.commit('loader',false);
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
	