<template>
    <CCol lg="6" md="8" xs="12">
        <CCard style="min-height: 100vh">
            <CCardBody>
                <CRow>
                    <CCol md="12" xs="12">
                        <h5 class="mb-0">User Profile</h5><hr class="mb-2 mt-2">
                    </CCol>
                    <CCol md="8" xs="12">
                        <CForm autocomplete="off">
                            <CRow>
                                <CCol :md="12" :xs="12">
                                    <h6 class="mb-2">Profile Image</h6>
                                </CCol>
                                <CCol :md="12" :xs="12">  
                                    <vue-dropzone
                                        v-if="edit.image"
                                        ref="dropzoneLogo" 
                                        @vdropzone-success="imageUpdate"
                                        id="dropzoneLogo" 
                                        :options="dropzoneOptions"
                                    />
                                    <template v-else>
                                        <CImage v-if="!$isEmpty(user.image)" align="center" thumbnail class="col-12" :src="`${backendUri}${user.image}`" fluid />
                                        <CIcon v-else name="cil-image"></CIcon>
                                    </template>
                                </CCol>
                                <CCol :md="12" :xs="12" class="text-center mt-2">  
                                    <CButton color="light" size="sm" @click="edit.image = true"> <CIcon name="cil-pencil"></CIcon> Edit Logo </CButton> 
                                </CCol>
                            </CRow>
                            <CCol :md="12" :xs="12">
                                <h6 class="my-4">User details</h6>                           
                            </CCol>
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-user" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="First Name"
                                    v-model="user.first_name"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'first_name')">{{errors.email}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-user" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Last Name"
                                    v-model="user.last_name"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'last_name')">{{errors.email}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-envelope" />
                                </CInputGroupText>
                                <CFormInput
                                    disabled
                                    placeholder="Email"
                                    v-model="user.email"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'email')">{{errors.email}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cilPhone" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Phone Number"
                                    v-model="user.phone_number"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'phone_number')">{{errors.email}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-address-book" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Gender"
                                    v-model="user.address"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'address')">{{errors.email}}</p>								
                            </CInputGroup>                             
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-address-book" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Address"
                                    v-model="user.address"		
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
import { each, debounce, isEmpty, has, pick } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";
import vueDropzone from 'dropzone-vue3'

export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fetchUser(),
            next();
        });
    },
    components:{
        vueDropzone
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
                image: false,
            },
            dropzoneOptions:     {
                url: 'https://httpbin.org/post',
                thumbnailWidth: 300,
                maxFilesize:    2.0,   
                headers:        {}             
            },  
            errors: {},
            user: {
                address:      String(),
                first_name:   String(),
                last_name:    String(),
                email:        String(),
                image:        String(),
                gender:       String(),
                phone_number: String(),
            },
            isDisabled: true
        }
    },
    created(){
        this.$isEmpty = isEmpty;
        this.$has     = has;

        // user schema
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

        // Validate the user
        this.validateProfile = (field) => {
            this.userSchema
                .validateAt(field, this.user)
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
            this.$api.get('/auth/user')
                .then( ({ data:{ user } }) => {
                    this.user                    = user;
                    this.dropzoneOptions.url     = `${VITE_API_BASE_URL}/auth/upload/image`;
                    this.dropzoneOptions.headers = { "Authorization": `${authToken.token_type} ${authToken.token}`};
                })
                .catch( ({ response }) => {
                })
                .finally( () => {
                    if( edit.image ) { this.edit.image = false }
                    this.$store.commit('loader',false);
                });
        }
    },
    watch:{
        user: {
            handler(user) {
                const self = this;
                each(user,(value,key) => {
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