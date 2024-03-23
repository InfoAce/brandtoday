<template>
    <!-- page-wrapper Start-->
    <div class="page-wrapper">
        <div class="authentication-box">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-7 p-0">
                        <div class="card tab2-card card-login bg-primary">
                            <div class="card-body">
								<div class="col-12 text-center my-4">
									<h2 class="text-white">Login</h2>
									<p>Enter valid credentials.</p>
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
											<a href="javascript:void(0)" class="text-white forgot-pass">Forgot Password!</a>
										</div>
									</div>
									<div class="form-button">
										<button class="btn btn-dark" :disabled="data.isDisabled || store.getters.loader" type="submit">Login</button>
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
import { debounce, each, isEmpty, has } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";
import { toast  } from "vue3-toastify";
import { useStore } from 'vuex';

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
		.finally( () => {
			data.isDisabled = !isEmpty(data.errors);
		});
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
				router.push({name: "Overview"});
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
	