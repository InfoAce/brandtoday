<template>
    <CCol lg="6" md="8" xs="12">
        <CCard style="min-height: 100vh">
            <CCardBody>
                <CRow>
                    <CCol md="12" xs="12">
                        <h5>User Profile</h5>
                    </CCol>
                    <CCol md="8" xs="12">
                        <CForm autocomplete="off">
                            <CCard>
                                <CCardBody>
                                    <CRow>
                                        <CCol :md="12" :xs="12">  
                                            <CImage align="center" rounded src="https://ajirahub.com/image/clients_1.jpg" width="200" height="200"/>
                                        </CCol>
                                        <CCol :md="12" :xs="12" class="text-center">  
                                            <CButton color="light" size="sm"> <CIcon name="cil-pencil"></CIcon> Edit Profile Image </CButton> 
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>                            
                            <CCol :md="12" class="py-2 d-flex justify-content-center">

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
import { each, isEmpty, has, pick } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { useStore } from 'vuex';

export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fetchUser(),
            next();
        });
    },
    data(){
        return {
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
        this.$has = has;

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

        // const store  = useStore();
        // const router = useRouter();
        // const $api   = inject('$api');
        // const toast  = useToast();
        // const swal   = inject('$swal');
    },
    methods:{
        fetchUser(){
            this.$store.commit('loader',true);
            this.$api.get('/auth/user')
                .then( ({ data:{ user } }) => {
                    this.user = pick(user,['first_name','last_name','email','phone_number','image','address','gender']);
                })
                .catch( ({ response }) => {
                })
                .finally( () => {
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