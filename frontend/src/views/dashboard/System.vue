<template>
<div>
<!-- Container-fluid starts-->
<div class="container-fluid">
    <div class="page-header">
        <div class="row">
            <div class="col-lg-6">
                <div class="page-header-left">
                    <h3>
                        System Profile
                        <small>Multikart Admin panel</small>                
                    </h3>
                </div>
            </div>
            <div class="col-lg-6">
                <ol class="breadcrumb pull-right">
                    <li class="breadcrumb-item">
                        <a href="#" @click.prevent="router.push({ name: 'Overview' })">
                            <i data-feather="home"></i>
                            Overview                        
                        </a>
                    </li>
                    <li class="breadcrumb-item">Settings</li>
                    <li class="breadcrumb-item active">System</li>
                </ol>
            </div>
        </div>
    </div>
</div>
<!-- Container-fluid Ends-->    
<!-- Container-fluid starts-->
<div class="container-fluid">
    <div class="row">
        <div class="col-xl-5 col-lg-5 col-md-6">
            <div class="card">
                <div class="card-body">     
                    <div class="row">
                        <form @submit.prevent="updateConfigurations">
                            <div class="col-12">
                                <h4><strong>Amrod API Settings</strong></h4><hr>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="vendor_uri">Vendor URI</label>
                                    <input class="form-control" id="vendor_uri" type="text" v-model="configurations.amrod.vendor_uri">
                                    <p class="text-danger col col-12 mb-0" v-if="!$isEmpty(errors) && $has(errors,'vendor_uri')">{{errors.vendor_uri}}</p>								
                                </div>                            
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="auth_uri">Auth URI</label>
                                    <input class="form-control" id="auth_uri" type="text" v-model="configurations.amrod.auth_uri">
                                    <p class="text-danger col col-12 mb-0" v-if="!$isEmpty(errors) && $has(errors,'auth_uri')">{{errors.auth_uri}}</p>								
                                </div>                            
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="account_number">Account Number</label>
                                    <input class="form-control" id="account_number" type="text" v-model="configurations.amrod.account_number">
                                    <p class="text-danger col col-12 mb-0" v-if="!$isEmpty(errors) && $has(errors,'account_number')">{{errors.account_number}}</p>                            </div>                            
                            </div>                        
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="username">Username</label>
                                    <input class="form-control" id="username" type="text" v-model="configurations.amrod.username" >
                                    <p class="text-danger col col-12 mb-0" v-if="!$isEmpty(errors) && $has(errors,'username')">{{errors.username}}</p>								
                                </div>                            
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="password">Password</label>
                                    <input class="form-control" id="password" type="password" v-model="configurations.amrod.password">
                                    <p class="text-danger col col-12 mb-0" v-if="!$isEmpty(errors) && $has(errors,'password')">{{errors.password}}</p>								
                                </div>                            
                            </div>
                            <div class="col-12">
                                <h4><strong>Pesapal API Settings</strong></h4><hr>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="consumer_key">Consumer Key</label>
                                    <input class="form-control" id="consumer_key" type="text" v-model="configurations.pesapal.consumer_key">
                                    <p class="text-danger col col-12 mb-0" v-if="!$isEmpty(errors) && $has(errors,'consumer_key')">{{errors.consumer_key}}</p>								
                                </div>                            
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="consumer_secret">Consumer Secret</label>
                                    <input class="form-control" id="consumer_secret" type="password" v-model="configurations.pesapal.consumer_secret">
                                    <p class="text-danger col col-12 mb-0" v-if="!$isEmpty(errors) && $has(errors,'consumer_secret')">{{errors.consumer_secret}}</p>								
                                </div>                            
                            </div>     
                            <div class="col-12">
                                <button class="btn btn-primary" :disabled="isDisabled || loading.updating">
                                    <i class="fa fa-spinner fa-spin" v-if="loading.updating"></i>
                                    Save Changes
                                </button>
                            </div>               
                        </form>                            
                    </div>            
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Container-fluid Ends-->   
</div>         
</template>
<script>
import { inject, reactive, ref, watch } from 'vue';
import { debounce, each, isEmpty, has, pick, cloneDeep } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";

export default {
    beforeCreate(){
        this.checkConfig = debounce( (amrod) => {
            const self = this;
            each(
                amrod,
                (value,key) => {
                    self.validateConfigurations(key,amrod);
                }
            );
        },500);
        this.checkPesapal = debounce( (pesapal) => {
            const self = this;
            each(
                pesapal,
                (value,key) => {
                    self.validatePesapalConfigurations(key,pesapal);
                }
            );
        },500);
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fetchConfigurations(),
            next();
        });
    },
    data(){
        return {
            errors: {},
            configurations: {
                amrod:{
                    auth_uri:       String(),
                    username:       String(),
                    password:       String(),
                    account_number: String(),
                    vendor_uri:     String(),
                },
                pesapal: {
                    consumer_key:    String(),
                    consumer_secret: String()
                }
            },
            loading: {
                updating: false
            },
            isDisabled: true
        }
    },
    created(){
        this.$has     = has;
        this.$isEmpty = isEmpty;

        // Configurations schema
        this.configSchema = yup.object().shape({
            auth_uri:       yup.string()
                               .required("*Auth URI is required"),
            username:       yup.string()
                               .email("*Enter a valid email address")
                               .required("*Username is required"),
            password:       yup.string()
                               .required("*Password is required"),                                                  
            account_number: yup.string()
                               .required("*Account Number is required"),    
            vendor_uri:       yup.string()
                               .required("*Vendor URI is required"),                                                  
        });
        // Configurations schema
        this.configPesapalSchema = yup.object().shape({
            consumer_key:   yup.string()
                               .required("*Consuner key is required"),
            consumer_secret:yup.string()
                               .required("*Consumer secret is required"),                                                                                                  
        });        

    },
    methods:{
        fetchConfigurations(){
            this.$store.commit('loader',true);
            this.$api.get('/dashboard/system')
                .then( ({ data:{ configurations } }) => {
                    this.configurations = cloneDeep(configurations);
                })
                .catch( ({ response }) => {
                })
                .finally( () => {
                    this.$store.commit('loader',false);
                });
        },
        // Update configurations
        updateConfigurations(){
            this.loading.updating = true;
            this.isDisabled = true;
            this.$api
                .post(
                    '/dashboard/system/configurations',
                    this.configurations 
                )
                .then( ({ data:{ company } }) => {

                })
                .catch( ({ response }) => {
                })
                .finally( () => {
                    this.loading.updating = false;
                });
        },
        // Validate the configurations
        validateConfigurations(field,data){
            this.configSchema
                .validateAt(field, data)
                .then((value,key) => {
                    delete this.errors[field];
                })
                .catch((err) => {
                    this.errors[err.path] = err.message;
                });
        },
        // Validate the pesapal configurations
        validatePesapalConfigurations(field,data){
            this.configPesapalSchema
                .validateAt(field, data)
                .then((value,key) => {
                    delete this.errors[field];
                })
                .catch((err) => {
                    this.errors[err.path] = err.message;
                });
        }        
    },
    watch:{
        errors: {
            handler(errors){
                this.isDisabled = !isEmpty(errors);
            },
            deep: true
        },
        "configurations.amrod": {
            handler(amrod){
                this.checkConfig(amrod)
            },
            deep: true,
            immediate: true             
        },
        "configurations.pesapal": {
            handler(pesapal){
                this.checkPesapal(pesapal)
            },
            deep: true,
            immediate: true             
        }
    }
}
</script>