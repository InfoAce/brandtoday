<template>
    <CCol lg="6" md="8" xs="12">
        <CCard style="min-height: 100vh">
            <CCardBody>
                <CRow>
                    <CCol md="12" xs="12">
                        <h5 class="mb-0">System Configurations</h5><hr class="mb-2 mt-2">                
                    </CCol>
                    <CCol md="8" xs="12">
                        <CForm autocomplete="off" @submit.prevent="updateConfigurations"> 
                            <CCol :md="12" :xs="12">
                                <h6 class="my-4">API Settings</h6>                           
                            </CCol>                                             
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-user" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Base URI"
                                    v-model="configurations.amrod.base_uri"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-if="!$isEmpty(errors) && $has(errors.amrod,'base_uri')">{{errors.amrod.base_uri}}</p>								
                            </CInputGroup>
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-envelope" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Username"
                                    v-model="configurations.amrod.username"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-if="!$isEmpty(errors) && $has(errors.amrod,'username')">{{errors.amrod.username}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-phone" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Password"
                                    type="password"
                                    v-model="configurations.amrod.password"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-if="!$isEmpty(errors) && $has(errors.amrod,'password')">{{errors.amrod.password}}</p>								
                            </CInputGroup>                             
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-address-book" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Account Number"
                                    v-model="configurations.amrod.account_number"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-if="!$isEmpty(errors) && $has(errors.amrod,'account_number')">{{errors.amrod.account_number}}</p>								
                            </CInputGroup> 
                            <!-- <CCol :md="12" :xs="12">
                                <h6 class="my-4">Payment Getway Settings</h6>                           
                            </CCol>   
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-user" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Base URI"
                                    v-model="configurations.base_uri"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'base_uri')">{{errors.base_uri}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-envelope" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Username"
                                    v-model="configurations.username"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'username')">{{errors.username}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-phone" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Password"
                                    v-model="configurations.password"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'password')">{{errors.password}}</p>								
                            </CInputGroup>                              -->
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
import { debounce, each, isEmpty, has, pick } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";

export default {
    beforeCreate(){
        this.checkConfig = debounce( (configurations) => {
            const self = this;
            each(
                configurations,
                (value,key) => {
                    self.validateConfigurations(key,configurations);
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
                    base_uri:       String(),
                    username:       String(),
                    password:       String(),
                    account_number: String(),
                }
            },
            isDisabled: true
        }
    },
    created(){
        this.$has     = has;
        this.$isEmpty = isEmpty;

        // Configurations schema
        this.configSchema = yup.object().shape({
            base_uri:       yup.string()
                                .required("*Base URI is required"),
            username:       yup.string()
                                .email("*Enter a valid email address")
                                .required("*Username is required"),
            password:       yup.string()
                                .required("*Password is required"),                                                  
            account_number: yup.string()
                                .required("*Account Number is required"),                       
        });

    },
    methods:{
        fetchConfigurations(){
            this.$store.commit('loader',true);
            this.$api.get('/system')
                .then( ({ data:{ system } }) => {
                    console.log(system);
                })
                .catch( ({ response }) => {
                })
                .finally( () => {
                    this.$store.commit('loader',false);
                });
        },
        // Update configurations
        updateConfigurations(){
            this.$store.commit('loader',true);
            this.isDisabled = true;
            this.$api
                .post(
                    '/system/configurations',
                    this.configurations 
                )
                .then( ({ data:{ company } }) => {

                })
                .catch( ({ response }) => {
                })
                .finally( () => {
                    this.$store.commit('loader',false);
                });
        },
        // Validate the configurations
        validateConfigurations(field,configurations){
            this.configSchema
                .validateAt(field, configurations)
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
        configurations: {
            handler(configurations){
                this.checkConfig(configurations)
            },
            deep: true,
            immediate: true             
        }
    }
}
</script>