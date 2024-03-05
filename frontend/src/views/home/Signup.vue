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
import { useToast } from "vue-toastification";
import { useStore } from 'vuex';
import { VueTelInput } from 'vue3-tel-input'
import 'vue3-tel-input/dist/vue3-tel-input.css'

const store  = useStore();
const router = useRouter();
const $api   = inject('$api');
const toast  = useToast();
const swal = inject('$swal');

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

const validateForm = (field) => {
	formSchema.validateAt(field, data.form)
        .then((value,key) => {
			delete data.errors[field];
		})
        .catch((err) => {
          data.errors[err.path] = err.message;
        })
        .finally( () => {
            console.log(!isEmpty(data.errors));
		    data.isDisabled = !isEmpty(data.errors);
        })
}

const signup = () => {
	data.loader.signup = true;
	$api.post('/auth/signup',data.form)
		.then( () => {
			swal.fire({
				icon: 'success',
				title: 'Alright!',
				text: 'Account successfully created. Check your email for account verification.'
			})
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
					text: 'Sorry we could not your account. Register router-link new account.'
				});
			}
			if( response.status == 401 ){
				swal.fire({
					icon: 'error',
					title: 'Oops!',
					text: 'Your email or password is incorrect.',
				});
			}
		})
		.finally( () => {
            data.loader.signup = false;
		});
}

const getPhoneNumber = ($event) => {
    data.form.phone_number = $event.constructor == String ? $event : $event.target.value 
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
	