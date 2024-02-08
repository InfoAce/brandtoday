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
                                    placeholder="Vendor URI"
                                    v-model="configurations.amrod.vendor_uri"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-if="!$isEmpty(errors) && $has(errors,'vendor_uri')">{{errors.vendor_uri}}</p>								
                            </CInputGroup>
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-user" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Auth URI"
                                    v-model="configurations.amrod.auth_uri"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-if="!$isEmpty(errors) && $has(errors,'auth_uri')">{{errors.auth_uri}}</p>								
                            </CInputGroup>
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-envelope" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Username"
                                    name="username"
                                    v-model="configurations.amrod.username"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-if="!$isEmpty(errors) && $has(errors,'username')">{{errors.username}}</p>								
                            </CInputGroup> 
                            <CInputGroup class="mb-3">
                                <CInputGroupText>
                                    <CIcon icon="cil-phone" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Password"
                                    type="password"
                                    name="password"
                                    v-model="configurations.amrod.password"		
                                    autocomplete="off"			
                                />
                                <p class="text-danger col col-12 mb-0" v-if="!$isEmpty(errors) && $has(errors,'password')">{{errors.password}}</p>								
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
                                <p class="text-danger col col-12 mb-0" v-if="!$isEmpty(errors) && $has(errors,'account_number')">{{errors.account_number}}</p>								
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
import { debounce, each, isEmpty, has, pick, cloneDeep } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";

export default {
    beforeCreate(){
        this.checkConfig = debounce( (amrod) => {
            const self = this;
            each(
                amrod,
                (value,key) => {
                    self.validateConfigurations(key,amrod);
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
                    auth_uri:       String(),
                    username:       String(),
                    password:       String(),
                    account_number: String(),
                    vendor_uri:     String(),
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

    },
    methods:{
        fetchConfigurations(){
            this.$store.commit('loader',true);
            this.$api.get('/system')
                .then( ({ data:{ configurations } }) => {
                    this.configurations = cloneDeep(configurations);
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
        validateConfigurations(field,data){
            this.configSchema
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
        errors: {
            handler(errors){
                this.isDisabled = !isEmpty(errors);
            },
            deep: true
        },
        "configurations.amrod": {
            handler(amrod){
                this.checkConfig(amrod)
            },
            deep: true,
            immediate: true             
        }
    }
}
</script>