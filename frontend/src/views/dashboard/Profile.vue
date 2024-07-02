<template>
<div>
<!-- Container-fluid starts-->
<div class="container-fluid">
    <div class="page-header">
        <div class="row">
            <div class="col-lg-6">
                <div class="page-header-left">
                    <h3>User Profile</h3>
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
                    <li class="breadcrumb-item active">Profile</li>
                </ol>
            </div>
        </div>
    </div>
</div>
<!-- Container-fluid Ends-->  
<!-- Modal start -->
<div class="modal theme-modal fade bd-example-modal-lg" id="imagecropper" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Crop Profile Image</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" style="height: 100vh;">
                <VuePictureCropper
                    v-if="!$isEmpty(profileImage)"
                    :boxStyle="cropBorderStyle"
                    :img="profileImage"
                    :options="croppingOption"
                    :presetMode="presetMode"
                    @ready="() => console.log('ready')"
                />
            </div>
            <div class="modal-footer">
                <!-- <button @click="() => addUser()" class="btn btn-primary" type="button" :disabled="data.isDisabled || data.loader.register">
                    <i v-if="data.loader.register" class="fa fa-spinner fa-spin"></i>
                    Create
                </button> -->
            </div>
        </div>
    </div>
</div>  
<!-- Container-fluid starts-->
<div class="container-fluid">
    <div class="row">
        <div class="col-xl-5 col-lg-5 col-md-6">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-12 mb-2">
                            <label>Profile Photo</label>
                            <!-- <div class="dropzone digits">
                                <div class="dz-message needsclick">
                                    <i class="fa fa-cloud-upload"></i>
                                    <h4 class="mb-0 f-w-600">Drop files here or click to upload.</h4>
                                </div>
                            </div> -->
                            <Vue3Dropzone 
                                width="350" 
                                height="350" 
                                :maxFiles="1" 
                                @error="($event) => console.log($event)"
                                @change="imagedropzone"
                                :maxFileSize="2"
                                :accept="['png', 'jpg', 'jpeg']" 
                            />
                            <!-- <vue-dropzone
                                v-if="edit.image"
                                ref="dropzoneLogo" 
                                @vdropzone-success="imageUpdate"
                                id="dropzoneLogo" 
                                :options="dropzoneOptions"
                            />        
                            <template v-else>
                                <img v-if="!$isEmpty(user.image)" :src="`${backendUri}${user.image}`" :alt="`${user.first_name} ${user.last_name}`" class="img-fluid blur-up lazyloaded col-12">
                                <img v-else src="/assets/dashboard/images/dashboard/designer.jpg" alt="" class="img-fluid blur-up lazyloaded col-12">
                            </template>
                            <div class="col-12 text-center">
                                <button class="btn btn-primary btn-sm my-2" @click="edit.image = true">Edit Image</button>
                            </div> -->
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="first_name"> First Name</label>
                                <input class="form-control" id="first_name" type="text" v-model="user.first_name">
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'first_name')">{{errors.first_name}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="last_name">Last Name</label>
                                <input class="form-control" id="last_name" type="text" v-model="user.last_name">
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'last_name')">{{errors.last_name}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input class="form-control" id="email" disabled type="text" v-model="user.email">
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'email')">{{errors.email}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="email">Gender</label>
                                <select class="form-control" v-model="user.gender">
                                    <option value="">*Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="femaile">Female</option>
                                </select>
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'gender')">{{errors.gender}}</p>								
                            </div>                            
                        </div>                        
                        <div class="col-12">
                            <div class="form-group">
                                <label for="phone_number">Phone Number</label>
                                <input class="form-control" id="phone_number" type="text" v-model="user.phone_number">
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'phone_number')">{{errors.phone_number}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="address">Address</label>
                                <input class="form-control" id="address" type="text" v-model="user.address">
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
<script lang="ts">
import { inject, reactive, ref, watch } from 'vue';
import { each, debounce, isEmpty, keys, has, pick } from 'lodash';
import VuePictureCropper, { cropper } from 'vue-picture-cropper'
import { useRouter } from 'vue-router';
import * as yup from "yup";
// import vueDropzone from 'dropzone-vue3'
import Vue3Dropzone from "@jaxtheprime/vue3-dropzone";
import '@jaxtheprime/vue3-dropzone/dist/style.css'
import Cropper from 'cropperjs';

export default {
    beforeCreate(){
        this.checkUser = debounce( (user) => {
            const items = pick(user,['first_name','last_name','phone_number','address','gender','email']),self = this;
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
        VuePictureCropper,
        Vue3Dropzone,
    },
    computed:{
        authToken(){
            return this.$store.getters.authToken;
        }, 
        authUser:{
            get() {
                return this.$store.getters.auth.user;
            },
            set(val){
                this.$store.commit('auth',val);
            }
        },  
        backendUri(){
            return this.env.VITE_API_BASE_URL.replace('api/v1','');
        },
        croppingOption: () => ({
            viewMode: 1,
            dragMode: 'move',
            aspectRatio: 1,
            cropBoxResizable: false,
        }),
        cropBorderStyle: () => ({
            width: '100%',
            height: '100%',
            backgroundColor: '#f8f8f8',
            margin: 'auto',          
        }),
        env() {
            return this.$store.getters.env;
        },
        presetMode: () => ({
            mode: 'round',
            width: 100,
            height: 100,
        })
    },
    data(){
        return {
            profileImage: String(),
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
            loading: {
                updating: false
            },
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
            const { authToken, env: { VITE_API_URL }, edit } = this;
            this.$api.get('/auth/user')
                .then( ({ data:{ user } }) => {
                    this.user                    = user;
                    this.dropzoneOptions.url     = `${VITE_API_URL}/api/v1/auth/upload/image`;
                    this.dropzoneOptions.headers = { "Authorization": `${authToken.token_type} ${authToken.token}`};
                    this.authUser.image          = user.image;
                    this.authUser.company        = user.company;
                })
                .catch( ({ response }) => {
                })
                .finally( () => {
                    if( edit.image ) { this.edit.image = false }
                });
        },
        imagedropzone(event: any){
            // console.log(arguments);
            let files = event.target.files;

            if( !isEmpty(files) ){

                const reader = new FileReader();
                reader.readAsDataURL(files[0]);
                reader.onload = () => {
                    this.profileImage = reader.result;
                    $('#imagecropper').modal('show');
                };
                reader.onerror = () => {
                    console.log(arguments);
                };
            }

        },
        updateUser(){
            this.loading.updating = true;        
            this.isDisabled       = true;
            this.$api
                .post('/auth/user',pick(this.user,['first_name','last_name','phone_number','address','gender','email']) )
                .then( ({ data:{ user } }) => {

                })
                .catch( ({ response }) => {
                })
                .finally( () => {
                    this.loading.updating = false;
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
