<template>
    <CCol lg="6" md="8" xs="12">
        <CCard style="min-height: 100vh">
            <CCardBody>
                <CRow>
                    <CCol md="12" xs="12" class="d-flex justify-content-between align-items-center">
                        <h5>System Configurations</h5>
                        <CButton color="success" class="text-light">Save Changes </CButton> 
                    </CCol>
                    <CCol md="8" xs="12">
                        <CForm autocomplete="off">                                              
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
            company: {
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

    },
    methods:{
        fetchUser(){
            this.$store.commit('loader',true);
            this.$api.get('/auth/company')
                .then( ({ data:{ company } }) => {
                    this.company = pick(company,['name','logo','email','favicon','address']);
                })
                .catch( ({ response }) => {
                })
                .finally( () => {
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