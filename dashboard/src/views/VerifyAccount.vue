<template>
    <div class="page-wrapper">
        <div class="authentication-box">    
            <div class="container">
                <div class="row justify-content-center align-items-center h-100">			
                    <div class="col-md-7 p-0">
                        <div class="card tab2-card card-login bg-primary">
                            <div class="card-body">
                                <div class="col-12 text-center">
                                    <h3>Account Verification</h3>
                                    <p>Verify your email address and set the account password.</p>
                                    <h3 v-show="$store.getters.loader"><i class="fa fa-spinner fa-spin fa-lg"></i></h3>
                                </div>
                                <div class="col-12">
                                    <form class="form-horizontal auth-form" @submit.prevent="setPassword">
                                        <div class="form-group">
                                            <label for="password" class="col-form-label">Password</label>
                                            <input type="password" class="form-control" id="password" v-model="data.form.password">
                                            <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'password')">{{data.errors.password}}</p>	
                                        </div>
                                        <div class="form-group">
                                            <label for="confirm_password" class="col-form-label">Confirm Password</label>
                                            <input type="password" class="form-control" id="confirm_password" v-model="data.form.confirm_password">
                                            <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'confirm_password')">{{data.errors.confirm_password}}</p>	
                                        </div> 
                                        <div class="col-12 text-center">
                                            <button class="btn btn-dark" :disabled="data.isDisabled">Save Password</button>
                                        </div>                           
                                    </form>                            
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onBeforeMount, inject, reactive, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { debounce, each, isEmpty, has, set } from 'lodash';
import { useStore } from 'vuex';
import { toast  } from "vue3-toastify";
import * as yup from 'yup';

const $api                 = inject('$api'); // Inject axios 
const $store               = useStore(); // Use store 
const data                 = reactive({ 
    errors:  Object(),
    form: {
        confirm_password: String(),
        password:         String()  
    },
    isDisabled:  Boolean(true),
    loading: { 
        verify: Boolean() 
    }, 
    user: Object()
}); // Define reactive variables

const { params:{ token } } = useRoute();  // Get route parameters.
const router               = useRouter(); // Get router 

// Verify email api function
const verifyToken = () => {
    $api.put(`/auth/user/${token}`)
        .then( ({ data: { user }}) => {
            set(data,'user',user);
        })
        .catch((err) => {
            if( has(err,'response') ){
                switch(err.response.status){
                    case 422:
                    break;
                    case 404:
                        router.push({ name: 'VerifyError404' })
                    break;
                }
            }
        })
        .finally( () => {
            $store.commit('loader',false);
        })
}

// Set user password
const setPassword = () => {
    data.loading.verify = true;

}

// Form schema
const formSchema = yup.object().shape({                  
	confirm_password: yup.string()
                         .required("*Confirmation password is required")
                         .oneOf([yup.ref('password'), null], 'Password mismatch'),
	password:         yup.string()
						 .required("*Password is required"),                         
});

// Promisify form validation
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
        })
}

// Watch form changes
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

// Verify if authenticated
onBeforeMount( () => {
    $store.commit('loader',true);
        
    if( !isEmpty($store.getters.authUser) ){
        router.push({ name: 'Overview' });
    }

}); 

onMounted( debounce( () => verifyToken(), 500) ) // Function called before component is mounted.
</script>