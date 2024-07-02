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
<!-- Container-fluid starts-->
<div class="container-fluid">
    <div class="row">
        <div class="col-xl-5 col-lg-5 col-md-6">
            <div class="card">
                <CardLoader />
                <div class="card-body">
                    <div class="row">
                        <div class="col-12 mb-2">
                            <label>Profile Photo</label>
                            <div class="col-12">
                                <template v-if="!$isEmpty(user.image) && !edit.image && $isEmpty(form.path)">
                                    <div class="col-12 d-flex flex-column align-items-center">
                                        <img :src="user.image" alt="" width="200" height="350" class="img-fluid blur-up lazyloaded">
                                        <button class="btn btn-primary mt-2" @click="edit.image = true">Edit</button>
                                    </div>
                                </template>
                                <template v-if="!$isEmpty(form.path) && !edit.image">
                                    <div class="col-12 d-flex flex-column align-items-center">
                                        <img :src="form.path" alt="" width="200" height="350" class="img-fluid blur-up lazyloaded">
                                        <button class="btn btn-primary mt-2" @click="edit.image = true">Edit</button>
                                    </div>
                                </template>                                 
                                <template v-if="edit.image && !$isEmpty(profileImage) && $isEmpty(form.path)">
                                    <VuePictureCropper                                
                                        :boxStyle="cropBorderStyle"
                                        :img="profileImage"
                                        :options="croppingOption"
                                        :presetMode="presetMode"
                                    /> 
                                    <div class="d-flex justify-content-between mt-2">
                                        <button class="btn btn-primary ml-2" type="button" @click="selectCrop">Crop</button>
                                        <button class="btn btn-primary ml-2" type="button" @click="profileImage = String()">Cancel</button>
                                    </div>
                                </template>
                                <template v-if="edit.image && $isEmpty(profileImage) && $isEmpty(form.path)">
                                    <div class="col-12 d-flex justify-content-center">
                                        <h1 style="border: 3px solid #ededed; border-radius: 500px;" class="p-5"><i class="fa fa-user fa-lg"></i></h1>
                                    </div>
                                    <input class="form-control" type="file" @change="onFileChange($event)" v-if="$isEmpty(profileImage) && $isEmpty(form.path)" />
                                </template> 
                            </div>
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
                            <button class="btn btn-primary" :disabled="isDisabled || loading.updating" @click="updateUser">
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
import { cloneDeep, each, debounce, get, isEmpty, keys, has, pick } from 'lodash';
import VuePictureCropper, { cropper } from 'vue-picture-cropper'
import { useRouter } from 'vue-router';
import * as yup from "yup";
import moment from 'moment';
import Vue3Dropzone from "@jaxtheprime/vue3-dropzone";
import '@jaxtheprime/vue3-dropzone/dist/style.css'
import { CardLoader } from '../../components';
import localStorage from 'reactive-localstorage';
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
        CardLoader,
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
            cropBoxResizable: false
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
            width: 200,
            height: 300,
        })
    },
    data(){
        return {
            profileImage: String(),
            edit: {
                image: false,
            },
            errors: {},
            form: {
                path: String()
            },
            loading: {
                fetching: false,
                updating: false
            },
            user: {
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
            first_name:       yup.string()
                                .required("*First Name is required"),
            last_name:        yup.string()
                                .required("*Last Name is required"),                                                  
            email:            yup.string()
                                .email("*Enter a valid email address")
                                .required("*Email address is required"),
            gender:           yup.string()
                                 .required("*Gender is required"),
            phone_number:     yup.string()
                                .required("*Phone number is required"),                         
        });

        // Finish logo or icon update and trigger refetch of company
        this.imageUpdate = debounce(() => {
            this.fetchUser();
        },1000);

        /**
         * Handles the change event of the file input element.
         * 
         * @param {Event} event - The event object.
         * @returns {Promise<void>} - A promise that resolves when the image file is loaded.
         */
        this.onFileChange = async (event) => {
            // Get the selected file and retrieve its data URL using the getImageFile function
            this.profileImage = await this.getImageFile(event.target);
        }

        /**
         * Asynchronously selects a cropped image from the picture cropper and updates the form with its path.
         *
         * @return {Promise<void>} Resolves when the cropped image is selected and the form is updated.
         */
        this.selectCrop = async () => {
            try {
                // Check if the cropper is available
                if (!cropper) return;

                // Get the cropped image as a blob
                let blob: Blob       = await cropper.getBlob();

                // Get the type of the blob and extract the file extension
                let type: any        = blob?.type.split('/');
                let filename: number = moment().unix();

                // Create a new File object with the cropped image and a unique filename
                let file: object = new File([blob], `${filename.toString()}.${type[1]}`, {
                    type:         blob?.type,
                    lastModified: new Date().getTime()
                });

                // Send the cropped image to the server for upload
                let { data: { location } } = await this.$api.post(`auth/upload/image`, {
                    file
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // Update the form with the path of the uploaded image
                this.form.path = location;

                // Reset the picked image
                this.profileImage = String();

                this.edit.image   = Boolean();

            } catch (error) {
                // Handle any errors that occur during the process
            }
        }

        /**
         * Asynchronously reads the contents of a file as a data URL and returns it.
         *
         * @param {Object} target - The target input element containing the file to be read.
         * @return {Promise} A Promise that resolves to the data URL of the file.
         */
        this.getImageFile = (target) => {
            // Create a new FileReader instance
            return new Promise(resolve => {
                const reader = new FileReader()

                // Define the onload callback function
                reader.onload = function () {
                    // Resolve the Promise with the data URL of the file
                    resolve(reader.result)
                }

                // Read the contents of the file as a data URL
                reader.readAsDataURL(target.files[0])
            })        
        }
    },
    methods:{
        async fetchUser(){

            try {
                this.$store.commit('card_loader',true);      
                let { data: { user } } = await this.$api.get('/auth/user');
                this.user = cloneDeep(user);       
                this.$store.commit('card_loader',false);      
            } catch(error){
                this.$store.commit('card_loader',false);  
            }
        },
        async updateUser(){
            try {
                this.$store.commit('card_loader',true);      
                this.isDisabled       = true;
                let { data:{ user } } = await this.$api.post('/auth/user',pick(this.user,['first_name','last_name','phone_number','address','gender','image']) );
                localStorage.
                this.$toast.success('Profile has been updated.');
                this.user       = cloneDeep(user);
                this.isDisabled = false;
                this.$store.commit('card_loader',false);      
            } catch(error){
                this.isDisabled = false;
                this.$store.commit('card_loader',false);      
            }
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
        "form.path"(value){
            this.user.image = String(value);
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
