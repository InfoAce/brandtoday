<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h2>Account Verification</h2>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <nav aria-label="breadcrumb" class="theme-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                            <li class="breadcrumb-item active" aria-current="page">Email Verification</li>
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
                    <div class="col-12 text-center">
                        <h3>Verifying your email address.</h3>
                        <h5>Thank you for taking this last step to finalize the account setup. We will now verify your email address. Please wait</h5>
                        <template v-if="data.loader">
                            <h1 v-show="data.loader"><i class="fa fa-spinner fa-spin"></i></h1>
                        </template>
                        <template v-else>
                            <template v-if="data.success">
                                <h1><i class="fa fa-check-circle text-success"></i></h1>
                                <h4>Verification successful.</h4>
                            </template>
                            <template v-if="data.failed">
                                <h1 ><i class="fa fa-times text-danger"></i></h1>
                                <h4>{{ data.failed_message }}</h4>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
        </section>
        <!--Section ends-->
            
    </div>
</template>

<script setup>
import { inject, onBeforeMount, reactive, ref, watch } from 'vue';
import { debounce, each, isEmpty, has } from 'lodash';
import { useRouter, useRoute } from 'vue-router';
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { useStore } from 'vuex';

const store  = useStore();
const route  = useRoute();
const router = useRouter();
const $api   = inject('$api');
const swal   = inject('$swal');

const data   = reactive({
    failed: false,
    failed_message: "Something went wrong. Please try again.",
    loader: false,
    success: false
});

const verifyEmail = () => {
    data.loader      = true;

    const { params } = route;

    if( isEmpty(params) ){
        router.push({ name: "Error404" });
    }

    $api.put(`/auth/verify/${params.token}`)
        .then( () => {
            data.success = true
            redirectToLogin()
        })
        .catch( ({ response }) => {
            data.failed = true;
            if( response.status == 404 ){
				data.failed_message = "Unable to verify email address. Are you sure it is registered with us ?"
			}
        })
        .finally( () => {
            data.loader = false;
        });            
}

const redirectToLogin = debounce( () => {
    router.push({ name: "Login" });
},1000)

onBeforeMount(verifyEmail)
</script>