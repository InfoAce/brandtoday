<template>
<div>
<!-- Container-fluid starts-->
<div class="container-fluid">
    <div class="page-header">
        <div class="row">
            <div class="col-lg-6">
                <div class="page-header-left">
                    <h3>Company Profile</h3>
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
                    <li class="breadcrumb-item active">Company</li>
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
                        <div class="col-12 mb-2">
                            <label>Company Logo</label>
                            <vue-dropzone
                                v-if="edit.logo"
                                ref="dropzoneLogo" 
                                @vdropzone-success="imageUpdate"
                                id="dropzoneLogo" 
                                :options="dropzoneLogoOptions"
                            />
                            <template v-else>
                                <div class="col-12 text-center">
                                    <img v-if="!$isEmpty(company.logo)" :src="`${backendUri}${company.logo}`" :alt="`${company.name}`" class="img-fluid blur-up lazyloaded col-12">
                                    <img v-else src="/assets/home/images/dashboard/designer.jpg" alt="" class="img-fluid blur-up lazyloaded col-12">
                                    <button class="btn btn-primary btn-sm my-2" @click="edit.logo = true">Edit Logo</button>
                                </div>
                            </template>
                        </div>
                        <div class="col-12 mb-2">
                            <label>Company Icon</label>
                            <vue-dropzone
                                v-if="edit.icon"
                                @vdropzone-success="imageUpdate"
                                ref="dropzoneIcon" 
                                id="dropzoneIcon" 
                                :options="dropzoneIconOptions"
                            />  
                            <template v-else>
                                <div class="col-12 text-center">
                                    <img v-if="!$isEmpty(company.icon)" :src="`${backendUri}${company.icon}`" :alt="`${company.name}`" class="img-fluid blur-up lazyloaded col-12">
                                    <img v-else src="/assets/home/images/dashboard/designer.jpg" alt="" class="img-fluid blur-up lazyloaded col-12">
                                    <button class="btn btn-primary btn-sm my-2" @click="edit.icon = true">Edit Icon</button>
                                </div>
                            </template>       
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="first_name">Name</label>
                                <input class="form-control" id="name" type="text" v-model="company.name" >
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'name')">{{errors.name}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input class="form-control" id="email" type="text" v-model="company.email">
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'email')">{{errors.email}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="phone_number">Phone Number</label>
                                <input class="form-control" id="phone_number" type="text" v-model="company.phone_number">
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'phone_number')">{{errors.phone_number}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="address">Address</label>
                                <input class="form-control" id="address" type="text" required="">
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'address')">{{errors.address}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12">
                            <button class="btn btn-primary" :disabled="isDisabled || loading.updating">
                                <i class="fa fa-spinner fa-spin" v-if="loading.updating"></i>
                                Save Changes
                            </button>
                        </div>       
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
import { cloneDeep, each, debounce, isEmpty, has, pick } from 'lodash';
import * as yup from "yup";
import vueDropzone from 'dropzone-vue3'

export default {
    beforeCreate(){
        this.checkCompany = debounce( (company) => {
            const items = pick(company,['name','phone_number','address','email']), self = this;
            each(
                items,
                (value,key) => {
                    self.validateCompany(key,items);
                }
            );
        },500);
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fetchCompany(),
            next();
        });
    },
    components: {
        vueDropzone,
    },
    computed:{
        authToken(){
            return this.$store.getters.authToken;
        }, 
        authUser:{
            get() {
                return this.$store.getters.authUser;
            },
            set(val){
                this.$store.commit('authUser',val);
            }
        },  
        backendUri(){
            return this.env.VITE_API_BASE_URL.replace('api/v1','');
        },
        env() {
            return this.$store.getters.env;
        }
    },
    data(){
        return {
            edit: {
                icon: false,
                logo: false
            },
            errors: {},
            company: {
                address:      String(),
                name:         String(),
                email:        String(),
                icon:         String(),
                logo:         String(),
                phone_number: String(),
            },
            loading:{
                updating: Boolean()
            },
            dropzoneLogoOptions:     {
                url: 'https://httpbin.org/post',
                thumbnailWidth: 300,
                maxFilesize:    2.0,   
                headers:        {}             
            },  
            dropzoneIconOptions: {
                url: 'https://httpbin.org/post',
                thumbnailWidth: 300,
                maxFilesize:    0.5,                
                headers:        {}             
            },       
            isDisabled: true
        }
    },
    created(){
        this.$isEmpty = isEmpty;
        this.$has     = has;

        // company schema
        this.companySchema = yup.object().shape({
            address:          yup.string()
                                .required("*Address is required"),
            name:            yup.string()
                                .required("*Name is required"),                                                
            email:            yup.string()
                                .email("*Enter a valid email address")
                                .required("*Email address is required"),                         
            phone_number:     yup.string()
                                .required("*Phone number is required"),                         
        });

        // Finish logo or icon update and trigger refetch of company
        this.imageUpdate = debounce(() => {
            this.fetchCompany();
        },1000);

    },
    methods:{
        fetchCompany(){
            const { authToken, env: { VITE_API_BASE_URL }, edit } = this;
            this.$store.commit('loader',true);
            this.$api.get('/auth/company')
                .then( ({ data:{ company } }) => {
                
                    this.company = company;
                    
                    this.dropzoneLogoOptions.url     = `${VITE_API_BASE_URL}/company/${company.id}/upload/logo`;
                    this.dropzoneLogoOptions.headers = { "Authorization": `${authToken.token_type} ${authToken.token}`};

                    this.dropzoneIconOptions.url     = `${VITE_API_BASE_URL}/company/${company.id}/upload/icon`;
                    this.dropzoneIconOptions.headers = { "Authorization": `${authToken.token_type} ${authToken.token}`};              
                    
                    this.authUser.company            = cloneDeep(company);
                })
                .catch( ({ response }) => {
                })
                .finally( () => {
                    if( edit.logo ) { this.edit.logo = false }
                    if( edit.icon ) { this.edit.icon = false }                    
                    this.$store.commit('loader',false);
                });
        },
        // Update company information
        updateCompany(){
            this.$store.commit('loader',true);
            this.isDisabled = true;
            this.$api
                .post(
                    '/auth/company',
                    pick(this.company,['name','phone_number','address','email']) 
                )
                .then( ({ data:{ company } }) => {

                })
                .catch( ({ response }) => {
                })
                .finally( () => {
                    this.$store.commit('loader',false);
                });
        },
        // Validate the user
        validateCompany(field,company){
            this.companySchema
                .validateAt(field, company)
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
        company: {
            handler(company){
                this.checkCompany(company)
            },
            deep: true,
            immediate: true             
        }
    }
}
</script>