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
                                <div class="col-12 d-flex justify-content-between align-items-center">
                                    <h4><strong>Amrod API Settings</strong></h4>
                                </div>
                                <hr>
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
                                    <h4 class="d-flex justify-content-between">
                                        <strong>Pesapal API Settings <span class="fa fa-eye-slash ml-2" id="reveal"  data-state="show" @click="revealPespal"></span></strong>
                                        <span class="badge badge-success" v-if="configurations.pesapal.live">Live</span>
                                        <span class="badge badge-warning" v-if="!configurations.pesapal.live">Sandbox</span>
                                    </h4><hr>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="consumer_key">Consumer Key</label>
                                        <input class="form-control" id="consumer_key" type="password" v-model="configurations.pesapal.consumer_key">
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
                                    <div class="form-group">
                                        <label for="use_product_fee">Status</label>
                                        <VueToggles v-model="configurations.pesapal.live"/>
                                        <p class="text-danger col col-12 mb-0" v-show="$has(errors,'use_product_fee')">{{errors.use_product_fee}}</p>								
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
import { VueToggles } from "vue-toggles";

export default {
    /**
     * Debounces the checkConfig function.
     * This function is called before the component is created.
     * It sets up a debounced version of the checkConfig function,
     * which validates the Amrod configurations.
     * The function is debounced with a delay of 500 milliseconds.
     */
    beforeCreate(){
        // Set up the debounced version of the checkConfig function
        this.checkConfig = debounce( (amrod) => {
            // Get a reference to the component instance
            const self = this;
            // Iterate over each key-value pair in the Amrod object
            each(
                amrod,
                (value,key) => {
                    // Validate the Amrod configurations using the validateConfigurations function
                    self.validateConfigurations(key,amrod);
                }
            );
        },500);

        /**
         * Debounces the checkPesapal function.
         * This function is called before the component is created.
         * It sets up a debounced version of the checkPesapal function,
         * which validates the Pesapal configurations.
         * The function is debounced with a delay of 500 milliseconds.
         */
        this.checkPesapal = debounce( (pesapal) => {
            // Get a reference to the component instance
            const self = this;
            // Iterate over each key-value pair in the Pesapal object
            each(
                pesapal,
                (value,key) => {
                    // Validate the Pesapal configurations using the validatePesapalConfigurations function
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
    components: { VueToggles },
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
                    consumer_secret: String(),
                    live:            Boolean()
                }
            },
            loading: {
                syncing: false,
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
            live:           yup.boolean()
                               .required("*Live is required"),                                                                                              
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
        revealPespal(event){
            let state = event.target.dataset.state;
            document.querySelector('#consumer_key').type    = state == 'show' ? 'text' : 'password';
            document.querySelector('#consumer_secret').type = state == 'show' ? 'text' : 'password';
            event.target.dataset.state = state == 'show' ? 'hide' : 'show';
        },
        async syncAmrod() {
            try {
                this.loading.syncing = true;
                const{ data: { message } } = await this.$api.put('/dashboard/system/synchronize');
                this.$toast.success('Data has been synced successfully');
            } catch(error) {
                this.loading.syncing = false;
                console.log(error);
                this.$toast.error('Oops!! Looks like something went wrong.');
            } finally{
                this.loading.syncing = false;
            }
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
                    this.$toast.success('The system configurations have been updated.');
                })
                .catch( ({ response }) => {
                    this.$toast.success('Oops!! Looks like something went wrong.');
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
                }).finally( () => {
                    this.isDisabled = !isEmpty(this.errors);
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