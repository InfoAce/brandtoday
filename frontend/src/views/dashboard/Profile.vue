<template>
    <CCol lg="6" md="8" xs="12">
        <CCard>
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
                                        <CCol :md="12" class="py-2 mx-auto">
                                            <CImage align="center" rounded src="https://ajirahub.com/image/clients_1.jpg" width="200" height="200"/>
                                        </CCol>
                                        <CCol :md="12" class="py-2 mx-auto" >
                                            <CButton color="danger" shape="rounded-pill" size="sm">Danger</CButton>                                                         
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
                                    v-model="form.email"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'email')">{{errors.email}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-user" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Last Name"
                                    v-model="form.email"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'email')">{{errors.email}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-user" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Email"
                                    v-model="form.email"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'email')">{{errors.email}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-user" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Phone Number"
                                    v-model="form.email"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'email')">{{errors.email}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-user" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Email"
                                    v-model="form.email"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'email')">{{errors.email}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-user" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Email"
                                    v-model="form.email"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'email')">{{errors.email}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-user" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Email"
                                    v-model="form.email"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'email')">{{errors.email}}</p>								
                            </CInputGroup>                          
                        </CForm>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    </CCol>
</template>
<script>
import { inject, reactive, ref, watch } from 'vue';
import { each, isEmpty, has } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { useStore } from 'vuex';

export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            console.log(vm);
        });
    },
    data(){
        return {
            errors: {},
            form: {
                address:      String(),
                first_name:   String(),
                last_name:    String(),
                email:        String(),
                gender:       String(),
                phone_number: String(),
            },
            isDisabled: true
        }
    },
    created(){
        this.$has = has;
        // const store  = useStore();
        // const router = useRouter();
        // const $api   = inject('$api');
        // const toast  = useToast();
        // const swal   = inject('$swal');
    },
    mounted(){
        // watch(
        //     () => form, 
        //     (form) => {
        //         each(form,(value,key) => {
        //             validateForm(key);
        //         });
        //         isDisabled = !isEmpty(errors);
        //     },
        //     { 
        //         deep: true,
        //         immediate: true 
        //     }
        // )
    },
    setup(){

        // const data   = reactive({
        //     errors: {},
        //     form: {
        //         address:      String(),
        //         first_name:   String(),
        //         last_name:    String(),
        //         email:        String(),
        //         gender:       String(),
        //         phone_number: String(),
        //     },
        //     isDisabled: true
        // });

        // const formSchema = yup.object().shape({
        //     address:          yup.string()
        //                         .required("*Email address is required"),
        //     first_name:       yup.string()
        //                         .required("*Email First Name is required"),
        //     last_name:        yup.string()
        //                         .required("*Email Last Name is required"),                                                  
        //     email:            yup.string()
        //                         .email("*Enter a valid email address")
        //                         .required("*Email address is required"),
        //     gender:           yup.string()
        //                         .required("*Gender is required"),
        //     phone_number:     yup.string()
        //                         .required("*Phone number is required"),                         
        // });

        // const validateForm = (field) => {
        //     formSchema.validateAt(field, form)
        //         .then((value,key) => {
        //             delete errors[field];
        //         })
        //         .catch((err) => {
        //         errors[err.path] = err.message;
        //         });
        // }

        // const fetchUser = () => {
        //     store.commit('loader',true);
        //     $api.post('/auth/user',form)
        //         .then( ({ data:{ user }}) => {
        //             console.log(user);
        //             // store.commit('auth',{user, token});
        //             // swal.fire({
        //             // 	icon: 'success',
        //             // 	title: 'Alright!',
        //             // 	text: 'Login successfull.'
        //             // }).then((result) => {
        //             // 	window.location.reload();
        //             // });	
        //         })
        //         .catch( ({ response }) => {
        //             store.commit('loader',false);
        //             if( !isEmpty(response.data) && response.statusCode == 400 ){
        //                 response.message.forEach( (value) => {
        //                     toast.info(value);
        //                 });
        //             }
        //             if( response.status == 404 ){
        //                 swal.fire({
        //                     icon: 'error',
        //                     title: 'Oops!',
        //                     text: 'Sorry we could not your account. Register a new account.'
        //                 });
        //             }
        //             if( response.status == 401 ){
        //                 swal.fire({
        //                     icon: 'error',
        //                     title: 'Oops!',
        //                     text: 'Your email or password is incorrect.',
        //                 });
        //             }
        //         })
        //         .finally( () => {
        //             store.commit('loader',false);
        //         });
        //     }
    },
}
</script>