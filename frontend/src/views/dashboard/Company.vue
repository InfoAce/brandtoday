<template>
    <CCol lg="6" md="8" xs="12">
        <CCard style="min-height: 100vh">
            <CCardBody>
                <CRow>
                    <CCol md="12" xs="12">
                        <h5>Company Details</h5>
                    </CCol>
                    <CCol md="8" xs="12">
                        <CForm autocomplete="off">
                            <CRow>
                                <CCol :md="12" :xs="12">
                                    <h6 class="mb-2">Company Logo</h6>
                                </CCol>
                                <CCol :md="12" :xs="12">  
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
                                </CCol>
                                <CCol :md="12" :xs="12" class="text-center my-2">  
                                    <CButton color="light" size="sm" @click="edit.logo = true"> <CIcon name="cil-pencil"></CIcon> Edit Logo </CButton> 
                                </CCol>
                                <CCol :md="12" :xs="12">
                                    <h6 class="mb-2">Company Icon</h6>
                                </CCol>
                                <CCol :md="12" :xs="12">
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
                                </CCol>
                                <CCol :md="12" :xs="12" class="text-center my-2">  
                                    <CButton color="light" size="sm" @click="edit.icon = true"> <CIcon name="cil-pencil"></CIcon> Edit Icon </CButton> 
                                </CCol>
                            </CRow> 
                            <CCol :md="12" :xs="12">
                                <h6 class="my-4">Company details</h6>                           
                            </CCol>                        
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-user" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Name"
                                    v-model="company.name"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'first_name')">{{errors.email}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-envelope" />
                                </CInputGroupText>
                                <CFormInput
                                    disabled
                                    placeholder="Email"
                                    v-model="company.email"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'email')">{{errors.email}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-phone" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Phone Number"
                                    v-model="company.phone_number"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'phone_number')">{{errors.email}}</p>								
                            </CInputGroup>                             
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-address-book" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Address"
                                    v-model="company.address"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'address')">{{errors.email}}</p>								
                            </CInputGroup>   
                            <CCol :md="12" :xs="12" class="d-flex justify-content-end">  
                                <CButton color="success" class="text-light">Save Changes </CButton> 
                            </CCol>                                                   
                        </CForm>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    </CCol>
</template>
<script>
import { inject, reactive, ref, watch } from 'vue';
import { cloneDeep, each, debounce, isEmpty, has, pick } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { useStore } from 'vuex';
import vueDropzone from 'dropzone-vue3'

export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fetchUser(),
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
        this.userSchema = yup.object().shape({
            address:          yup.string()
                                .required("*Email address is required"),
            first_name:       yup.string()
                                .required("*Email First Name is required"),
            last_name:        yup.string()
                                .required("*Email Last Name is required"),                                                  
            email:            yup.string()
                                .email("*Enter a valid email address")
                                .required("*Email address is required"),
            gender:           yup.string()
                                .required("*Gender is required"),                             
            phone_number:     yup.string()
                                .required("*Phone number is required"),                         
        });

        // Validate the company
        this.validateProfile = (field) => {
            this.userSchema
                .validateAt(field, this.company)
                .then((value,key) => {
                    delete errors[field];
                })
                .catch((err) => {
                    errors[err.path] = err.message;
                });
        }

        // Finish logo or icon update and trigger refetch of company
        this.imageUpdate = debounce(() => {
            this.fetchUser();
        },1000);

    },
    methods:{
        fetchUser(){
            const { authToken, env: { VITE_API_BASE_URL }, edit } = this;
            this.$store.commit('loader',true);
            this.$api.get('/auth/company')
                .then( ({ data:{ company } }) => {
                
                    this.company                      = pick(company,['id','name','logo','email','icon','address']);
                    
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
        }
    },
    watch:{
        company: {
            handler(company) {
                const self = this;
                each(company,(value,key) => {
                    // console.log(key);
                    // self.validateProfile(key);
                });
                this.isDisabled = !isEmpty(this.errors);
            },
            deep: true,             
        }
    }
}
</script>