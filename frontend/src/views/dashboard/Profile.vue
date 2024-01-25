<template>
    <CCol lg="6" md="8" xs="12">
        <CCard style="min-height: 100vh">
            <CCardBody>
                <CRow>
                    <CCol md="12" xs="12">
                        <h5 class="mb-0">User Profile</h5><hr class="mb-2 mt-2">
                    </CCol>
                    <CCol md="8" xs="12">
                        <CForm @submit.prevent="updateUser" autocomplete="off">
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
                                    :disabled="$store.getters.loader"	
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'first_name')">{{errors.first_name}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-user" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Last Name"
                                    v-model="user.last_name"		
                                    autocomplete="off"			
                                    :disabled="$store.getters.loader"	
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'last_name')">{{errors.last_name}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cilEnvelope" />
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
                                    :disabled="$store.getters.loader"	
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'phone_number')">{{errors.phone_number}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cilAddressbook" />
                                </CInputGroupText>
                                <CFormSelect 
                                    aria-label="Gender" 
                                    v-model="user.gender" 
                                    :disabled="$store.getters.loader"	                            
                                >
                                    <option>Open to select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="">Prefer Not To Say</option>
                                </CFormSelect>
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'gender')">{{errors.gender}}</p>								
                            </CInputGroup>                             
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-address-book" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Address"
                                    v-model="user.address"		
                                    autocomplete="off"			
                                    :disabled="$store.getters.loader"	
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'address')">{{errors.address}}</p>								
                            </CInputGroup>   
                            <CCol :md="12" :xs="12" class="d-flex justify-content-end">  
                                <CButton color="success" class="text-light" :disabled="isDisabled" type="submit">
                                    <CSpinner v-if="isDisabled && $store.getters.loader" component="span" size="sm" variant="grow" aria-hidden="true"/>
                                    Save Changes 
                                </CButton> 
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
import { each, debounce, isEmpty, keys, has, pick } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";
import vueDropzone from 'dropzone-vue3'

export default {
    beforeCreate(){
        this.checkUser = debounce( (user) => {
            const items = pick(user,['first_name','last_name','phone_number','address','gender','email']),self = this;
            console.log(items);
            each(
                items,
                (value,key) => {
                    self.validateProfile(key,items);
                }
            );
        },1000);
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fetchUser(),
            next();
        });
    },
    components:{
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
            isDisabled: false
        }
    },
    created(){
        this.$isEmpty = isEmpty;
        this.$has     = has;

        // user schema
        this.userSchema = yup.object().shape({
            address:          yup.string()
                                 .required("*Address is required"),
            first_name:       yup.string()
                                .required("*First Name is required"),
            last_name:        yup.string()
                                .required("*Last Name is required"),                                                  
            email:            yup.string()
                                .email("*Enter a valid email address")
                                .required("*Email address is required"),
            gender:           yup.string(),
            phone_number:     yup.string()
                                .required("*Phone number is required"),                         
        });

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
        },
        updateUser(){
            this.$store.commit('loader',true);
            this.isDisabled = true;
            this.$api
                .post('/auth/user',pick(this.user,['first_name','last_name','phone_number','address','gender','email']) )
                .then( ({ data:{ user } }) => {

                })
                .catch( ({ response }) => {
                })
                .finally( () => {
                    this.$store.commit('loader',false);
                });
        },
        // Validate the user
        validateProfile(field,user){
            this.userSchema
                .validateAt(field, user)
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
        user: {
            handler(user){
                this.checkUser(user)
            },
            deep: true,
            immediate: true             
        }
    }
}
</script>