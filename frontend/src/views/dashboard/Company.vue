<template>
<div>
<!-- Container-fluid starts-->
<div class="container-fluid">
    <div class="page-header">
        <div class="row">
            <div class="col-lg-6">
                <div class="page-header-left">
                    <h3>
                        Company Profile
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
                    <div class="row">0
                        00\
                        <div class="col-12">
                            <label for="company_logo">Company Logo</label>
                            <vue-dropzone
                                v-if="edit.logo"
                                ref="dropzoneLogo" 
                                @vdropzone-success="imageUpdate"
                                id="dropzoneLogo" 
                                :options="dropzoneLogoOptions"
                            />
                            <template v-else>
                                <CImage v-if="!$isEmpty(company.logo)" align="center" class="col-12" thumbnail :src="`${backendUri}${company.logo}`" fluid/>
                                <CIcon v-else name="cil-image"></CIcon>
                            </template>
                        </div>
                        <div class="col-12">
                            <label for="company_logo">Company Icon</label>
                            <vue-dropzone
                                v-if="edit.icon"
                                @vdropzone-success="imageUpdate"
                                ref="dropzoneIcon" 
                                id="dropzoneIcon" 
                                :options="dropzoneIconOptions"
                            />  
                            <template v-else>
                                <CImage v-if="!$isEmpty(company.icon)" align="center" class="col-12" thumbnail :src="`${backendUri}${company.icon}`" fluid />
                                <CIcon v-else name="cil-image"></CIcon>
                            </template>       
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="first_name"> First Name</label>
                                <input class="form-control" id="first_name" type="text" required="">
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'first_name')">{{errors.first_name}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="last_name">Last Name</label>
                                <input class="form-control" id="last_name" type="text" required="">
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'last_name')">{{errors.last_name}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input class="form-control" id="mail" type="text" required="">
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'email')">{{errors.email}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="phone_number">Phone Number</label>
                                <input class="form-control" id="phone_number" type="text" required="">
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
        backendUri(){
            return this.env.VITE_API_BASE_URL.replace('api','');
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
                first_name:   String(),
                last_name:    String(),
                email:        String(),
                icon:         String(),
                logo:         String(),
                gender:       String(),
                phone_number: String(),
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