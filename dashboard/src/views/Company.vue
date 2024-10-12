<template>
<div>
<!-- Container-fluid starts-->
<div class="container-fluid">
    <div class="page-header">
        <div class="row">
            <div class="col-lg-6">
                <div class="page-header-left">
                    <h3>Company Profile</h3>
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
                    <li class="breadcrumb-item active">Company</li>
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
                            <label>Company Icon</label>
                            <template v-if="!$isEmpty(company.icon) && !edit.icon && $isEmpty(form.icon)">
                                <div class="col-12 d-flex flex-column align-items-center">
                                    <img :src="`${$store.getters.assetsUrl}${company.icon}`" alt="" width="100" height="150" class="img-fluid blur-up lazyloaded">
                                    <button class="btn btn-primary mt-2" @click="edit.icon = true">Edit</button>
                                </div>
                            </template>
                            <template v-if="!$isEmpty(form.icon) && !edit.icon">
                                <div class="col-12 d-flex flex-column align-items-center">
                                    <img :src="`${$store.getters.assetsUrl}${form.icon}`" alt="" width="100" height="150" class="img-fluid blur-up lazyloaded">
                                    <button class="btn btn-primary mt-2" @click="edit.icon = true">Edit</button>
                                </div>
                            </template>                                 
                            <template v-if="edit.icon && !$isEmpty(images.icon) && $isEmpty(form.icon)">
                                <div class="col-12">
                                    <VuePictureCropper                                
                                        :boxStyle="cropBorderStyle"
                                        :img="images.icon"
                                        :options="iconCroppingOption"
                                        :presetMode="iconPresetMode"
                                    /> 
                                    <div class="d-flex justify-content-between mt-2 col-12">                                         
                                        <button class="btn btn-primary ml-2" type="button" :disabled="loading.icon" @click="selectCrop('icon')"><i v-if="loading.icon" class="fa fa-spinner fa-spin"></i><span v-else>Crop</span></button>
                                        <button class="btn btn-primary ml-2" type="button" @click="images.icon = String()">Cancel</button>
                                    </div>
                                </div>
                            </template>
                            <template v-if="edit.icon && $isEmpty(images.icon) && $isEmpty(form.icon) || $isNull(company.icon) && $isEmpty(images.icon) && $isEmpty(form.icon)">
                                <div class="col-12 d-flex justify-content-center">
                                    <h1 style="border: 3px solid #ededed; border-radius: 500px;" class="p-5"><i class="fa fa-user fa-lg"></i></h1>
                                </div>
                                <input class="form-control" type="file" @change="onFileChange($event,'icon')" />
                            </template>      
                            <p class="text-danger col col-12 mb-0" v-show="$has(errors,'icon')">{{errors.icon}}</p>								
                        </div>                        
                        <div class="col-12">
                            <label>Company Logo</label>
                            <template v-if="!$isEmpty(company.logo) && !edit.logo && $isEmpty(form.logo)">
                                <div class="col-12 d-flex flex-column align-items-center">
                                    <img :src="`${$store.getters.assetsUrl}${company.logo}`" alt="" width="100%" height="350" class="img-fluid blur-up lazyloaded">
                                    <button class="btn btn-primary mt-2" @click="edit.logo = true">Edit</button>
                                </div>
                            </template>
                            <template v-if="!$isEmpty(form.logo) && !edit.logo">
                                <div class="col-12 d-flex flex-column align-items-center">
                                    <img :src="`${$store.getters.assetsUrl}${form.logo}`" alt="" width="200" height="350" class="img-fluid blur-up lazyloaded">
                                    <button class="btn btn-primary mt-2" @click="edit.logo = true">Edit</button>
                                </div>
                            </template>                                 
                            <template v-if="edit.logo && !$isEmpty(images.logo) && $isEmpty(form.logo)">
                                <div class="col-12">
                                    <VuePictureCropper                                
                                        :boxStyle="{
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: '#f8f8f8',
                                            margin: 'auto',
                                        }"
                                        :img="images.logo"
                                        :options="{
                                            viewMode: 1,
                                            dragMode: 'move',
                                            aspectRatio: 15 / 4,
                                            cropBoxResizable: false
                                        }"
                                    />          
                                    <div class="d-flex justify-content-between mt-2 col-12">                         
                                        <button class="btn btn-primary ml-2" type="button" @click="selectCrop('logo')"><i v-if="loading.icon" class="fa fa-spinner fa-spin"></i>Crop</button>
                                        <button class="btn btn-primary ml-2" type="button" @click="images.logo = String()">Cancel</button>
                                    </div> 
                                </div>
                            </template>
                            <template v-if="edit.logo && $isEmpty(images.logo) && $isEmpty(form.logo) || $isNull(company.logo) && $isEmpty(images.logo) && $isEmpty(form.logo)">
                                <div class="col-12 d-flex justify-content-center p-4" style="border: 3px solid #ededed;">
                                    <h1><i class="fa fa-building fa-lg"></i></h1>
                                </div>
                                <input class="form-control mt-2" type="file" @change="onFileChange($event,'logo')" />
                            </template> 
                            <p class="text-danger col col-12 mb-0" v-show="$has(errors,'logo')">{{errors.logo}}</p>								
                        </div>
                        <div class="col-12">
                            <label>Company White Logo</label>
                            <template v-if="!$isEmpty(company.white_logo) && !edit.white_logo && $isEmpty(form.white_logo)">
                                <div class="col-12 d-flex flex-column align-items-center">
                                    <div class="bg-theme p-4 col-12 d-flex flex-column" style="background-color: #1d1d1d">
                                        <img :src="`${$store.getters.assetsUrl}${company.white_logo}`" alt="" width="100%" height="350" class="img-fluid blur-up lazyloaded">
                                    </div>    
                                    <button class="btn btn-primary mt-2" @click="edit.white_logo = true">Edit</button>
                                </div>
                            </template>
                            <template v-if="!$isEmpty(form.white_logo) && !edit.white_logo">
                                <div class="col-12 d-flex flex-column align-items-center">
                                    <div class="bg-theme p-4 col-12 d-flex flex-column" style="background-color: #1d1d1d">
                                        <img :src="`${$store.getters.assetsUrl}${company.white_logo}`" alt="" width="100%" height="350" class="img-fluid blur-up lazyloaded">
                                    </div>
                                    <button class="btn btn-primary mt-2" @click="edit.white_logo = true">Edit</button>
                                </div>
                            </template>                                 
                            <template v-if="edit.white_logo && !$isEmpty(images.white_logo) && $isEmpty(form.white_logo)">
                                <div class="col-12">
                                    <VuePictureCropper                                
                                        :boxStyle="{
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: '#f8f8f8',
                                            margin: 'auto',
                                        }"
                                        :img="images.white_logo"
                                        :options="{
                                            viewMode: 1,
                                            dragMode: 'move',
                                            aspectRatio: 9 / 3,
                                            cropBoxResizable: false
                                        }"
                                    />          
                                    <div class="d-flex justify-content-between mt-2 col-12">                         
                                        <button class="btn btn-primary ml-2" type="button" @click="selectCrop('white_logo')"><i v-if="loading.icon" class="fa fa-spinner fa-spin"></i>Crop</button>
                                        <button class="btn btn-primary ml-2" type="button" @click="images.white_logo = String()">Cancel</button>
                                    </div> 
                                </div>
                            </template>
                            <template v-if="edit.white_logo && $isEmpty(images.white_logo) && $isEmpty(form.white_logo) || $isNull(company.white_logo) && $isEmpty(images.white_logo) && $isEmpty(form.white_logo)">
                                <div class="col-12 d-flex justify-content-center p-4" style="border: 3px solid #ededed;">
                                    <h1><i class="fa fa-building fa-lg"></i></h1>
                                </div>
                                <input class="form-control mt-2" type="file" @change="onFileChange($event,'white_logo')" />
                            </template> 
                            <p class="text-danger col col-12 mb-0" v-show="$has(errors,'white_logo')">{{errors.white_logo}}</p>								
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="first_name">Name</label>
                                <input class="form-control" id="name" type="text" v-model="company.name" >
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'name')">{{errors.name}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input class="form-control" id="email" type="text" v-model="company.email">
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'email')">{{errors.email}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="phone_number">Phone Number</label>
                                <input class="form-control" id="phone_number" type="text" v-model="company.phone_number">
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'phone_number')">{{errors.phone_number}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="address">Address</label>
                                <input class="form-control" id="address" type="text"  v-model="company.address">
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'address')">{{errors.address}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="address">Use Currency Exchange</label>
                                <VueToggles v-model="company.use_exchange_rate"/>
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'use_exchange_rate')">{{errors.use_exchange_rate}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12" v-show="company.use_exchange_rate">
                            <div class="form-group">
                                <label for="address">Currency Exchange</label>
                                <input class="form-control" id="address" type="number" v-model="company.exchange_rate">
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'exchange_rate')">{{errors.exchange_rate}}</p>								
                            </div>                            
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="use_product_fee">Use Product Fee</label>
                                <VueToggles v-model="company.use_product_fee"/>
                                <p class="text-danger col col-12 mb-0" v-show="$has(errors,'use_product_fee')">{{errors.use_product_fee}}</p>								
                            </div>                            
                        </div>
                        <template  v-if="company.use_product_fee">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="product_fee_type">Product Pricing Fee Type</label>
                                    <select class="form-control" id="product_fee_type" v-model="company.product_fee_type">
                                        <option value="">*Select Type</option>
                                        <option value="fixed">Fixed</option>
                                        <option value="percentage">Percentage</option>
                                    </select>
                                    <p class="text-danger col col-12 mb-0" v-show="$has(errors,'product_fee_type')">{{errors.product_fee_type}}</p>								
                                </div>                            
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="product_fee">Product Fee</label>
                                    <input class="form-control" id="product_fee" type="number" v-model="company.product_fee">
                                    <p class="text-danger col col-12 mb-0" v-show="$has(errors,'product_fee')">{{errors.product_fee}}</p>								
                                </div>                            
                            </div>
                        </template>
                        <div class="col-12">
                            <button class="btn btn-primary" :disabled="isDisabled || loading.updating" @click="updateCompany">
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
<script>
import { inject, reactive, ref, watch } from 'vue';
import { cloneDeep, each, debounce, isEmpty, isNull, has, pick } from 'lodash';
import * as yup from "yup";
import vueDropzone from 'dropzone-vue3'
import { CardLoader } from '../components';
import VuePictureCropper, { cropper } from 'vue-picture-cropper'
import moment from 'moment';
import { VueToggles } from "vue-toggles";

export default {
    beforeCreate(){
        this.checkCompany = debounce( (company) => {
            const items = pick(company,['name','phone_number','address','email']), self = this;
            each(
                items,
                (value,key) => {
                    self.validateCompany(key,items);
                }
            );
        },500);
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fetchCompany(),
            next();
        });
    },
    components: {
        CardLoader,
        VuePictureCropper,
        VueToggles
    },
    computed:{
        authToken(){
            return this.$store.getters.authToken;
        }, 
        authUser:{
            get() {
                return this.$store.getters.authUser;
            },
            set(val){
                this.$store.commit('authUser',val);
            }
        },  
        env() {
            return this.$store.getters.env;
        },
        iconCroppingOption: () => ({
            viewMode: 1,
            dragMode: 'move',
            aspectRatio: 1,
            cropBoxResizable: false
        }),
        logoCroppingOption: () => ({
            viewMode: 1,
            dragMode: 'move',
            aspectRatio: 16 / 8,
            cropBoxResizable: false
        }),
        cropBorderStyle: () => ({
            width: '100%',
            height: '100%',
            backgroundColor: '#f8f8f8',
            margin: 'auto',
        }),
        iconPresetMode: () => ({
            mode: 'round',
            width: 100,
            height: 150,
        }),
        logoPresetMode: () => ({
            // mode: 'fixedSize',
            width: 1920,
            height: 720,
        })
    },
    data(){
        return {
            edit: {
                icon: false,
                logo: false,
                white_logo: false
            },
            errors: {},
            company: {
                address:      String(),
                name:         String(),
                email:        String(),
                exchange_rate: Number(),
                icon:         String(),
                logo:         String(),
                white_logo:   String(),
                phone_number: String(),
                product_fee:      Number(),
                product_fee_type: String(),
                use_exchange_rate: Boolean(),
                use_product_fee: Boolean(),
            },
            images: {
                icon: false,
                logo: false,
                white_logo: false,
            },
            form:{
                logo: String(),
                white_logo: String(),
                icon: String()
            },
            loading:{
                icon:     Boolean(),
                logo:     Boolean(),
                white_logo: Boolean(),
                updating: Boolean()
            },      
            isDisabled: true
        }
    },
    created(){
        this.$isEmpty = isEmpty;
        this.$has     = has;
        this.$isNull  = isNull;

        // company schema
        this.companySchema = yup.object().shape({
            address:          yup.string()
                                .required("*Address is required"),
            name:             yup.string()
                                 .required("*Name is required"),  
            logo:             yup.string()
                                 .required("*Logo is required")
                                 .test( val => isNull(val)),  
            logo:             yup.string()
                                 .required("*Logo is required")
                                 .test( val => isNull(val)),  
            icon:             yup.string()
                                 .required("*Icon is required")
                                 .test( val => isNull(val)),                                                                                                                  
            email:            yup.string()
                                .email("*Enter a valid email address")
                                .required("*Email address is required"),                         
            phone_number:     yup.string()
                                .required("*Phone number is required"), 
            exchange_rate:     yup.number()
                                  .when("use_exchange_rate", {
                                    is: true,
                                    then: yup.number().required("Exchange rate amount is required").test( val => val != 0)
                                  }),
            product_fee_type:  yup.string()
                                  .when("use_product_fee", {
                                    is: true,
                                    then: yup.number().required("Exchange rate amount is required").test( val => !isEmpty(val))
                                  }),
            product_fee:     yup.number()
                                  .when("use_product_fee", {
                                    is: true,
                                    then: yup.number().required("Exchange rate amount is required").test( val => val != 0)
                                  }),
            use_exchange_rate: yup.boolean(),                                                                                         
            use_product_fee: yup.boolean(),                                                                                         
        });

        // Finish logo or icon update and trigger refetch of company
        this.imageUpdate = debounce(() => {
            this.fetchCompany();
        },1000);

        /**
         * Handles the change event of the file input element.
         * 
         * @param {Event} event - The event object.
         * @returns {Promise<void>} - A promise that resolves when the image file is loaded.
         */
        this.onFileChange = async (event, type) => {
            if( type == 'logo'){
                // Get the selected file and retrieve its data URL using the getImageFile function
                this.images.logo = await this.getImageFile(event.target);
                this.edit.logo   = true;
            }
            if( type == 'white_logo'){
                // Get the selected file and retrieve its data URL using the getImageFile function
                this.images.white_logo = await this.getImageFile(event.target);
                this.edit.white_logo   = true;
            }
            if( type == 'icon'){
                // Get the selected file and retrieve its data URL using the getImageFile function
                this.images.icon = await this.getImageFile(event.target);
                this.edit.icon   = true;
            }
        }

        /**
         * Asynchronously selects a cropped image from the picture cropper and updates the form with its path.
         *
         * @return {Promise<void>} Resolves when the cropped image is selected and the form is updated.
         */
        this.selectCrop = async (category) => {
            try {
                // Activate logo loading
                if( category == 'logo'){ this.loading.logo = Boolean(true) }
                
                // Activate icon loading
                if( category == 'icon'){ this.loading.icon = Boolean(true) }

                // Activate icon loading
                if( category == 'white_logo'){ this.loading.white_logo = Boolean(true) }
                
                // Check if the cropper is available
                if (!cropper) return;

                // Get the cropped image as a blob
                let blob     = await cropper.getBlob();

                // Get the type of the blob and extract the file extension
                let type     = blob?.type.split('/');
                let filename = moment().unix();

                // Create a new File object with the cropped image and a unique filename
                let file     = new File([blob], `${filename.toString()}.${type[1]}`, {
                    type:         blob?.type,
                    lastModified: new Date().getTime()
                });

                // Send the cropped image to the server for upload
                let { data: { location } } = await this.$api.post(`auth/upload/image`, { file }, { headers: { 'Content-Type': 'multipart/form-data'} });

                if( category == 'logo'){
                    // Update the form with the path of the uploaded image
                    this.form.logo = location;
                    // Reset the picked image
                    this.images.logo  = String();
                    this.edit.logo    = Boolean();
                    this.loading.logo = Boolean();
                }

                if( category == 'icon'){
                    // Update the form with the path of the uploaded image
                    this.form.icon    = location;
                    // Reset the picked image
                    this.images.icon  = String();
                    this.edit.icon    = Boolean();
                    this.loading.icon = Boolean();
                }

                if( category == 'white_logo'){
                    // Update the form with the path of the uploaded image
                    this.form.white_logo    = location;
                    // Reset the picked image
                    this.images.white_logo  = String();
                    this.edit.white_logo    = Boolean();
                    this.loading.white_logo = Boolean();
                }
            } catch (error) {
                // Handle any errors that occur during the process
                this.$toast.error('Oops!! Something went wrong while cropping image.')
                console.log(error);
            }
        }

        /**
         * Asynchronously reads the contents of a file as a data URL and returns it.
         *
         * @param {Object} target - The target input element containing the file to be read.
         * @return {Promise} A Promise that resolves to the data URL of the file.
         */
        this.getImageFile = async (target) => {
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
        async fetchCompany(){
            try {
                this.$store.commit('card_loader',true);

                let { data: { company } } = await this.$api.get('/dashboard/company');
                this.company              = cloneDeep(company);
                
                this.$store.commit('card_loader',false);
            } catch(error) {
               this.$toast.error('Something went wrong while fetching company information.')
               this.$store.commit('card_loader',false);
            }
        },
        // Update company information
        async updateCompany(){
            try {
                this.loading.updating    = true;
                this.isDisabled          = true;

                let { data: {company } } = await this.$api.put(`/dashboard/company/${this.company.id}/update`,this.company);
                
                $store.commit('company',company);
                this.company             = cloneDeep(company);
                this.loading.updating    = false;

                this.$toast.success('Company information updated successfully.');
            } catch(error) {
                console.log(error);
               this.$toast.error('Something went wrong while updating company information.')
               this.loading.updating    = false;
            }
        },
        // Validate the user
        validateCompany(field,company){
            this.companySchema
                .validateAt(field, company)
                .then((value,key) => {
                    delete this.errors[field];
                })
                .catch((err) => {
                    this.errors[err.path] = err.message;
                });
        },
        toggleCurrency(){
            
        }
    },
    watch:{
        errors: {
            handler(errors){
                this.isDisabled = !isEmpty(errors);
            },
            deep: true,
            immediate: true
        },
        "form.icon"(value){
            this.company.icon = String(value);
        },
        "form.logo"(value){
            this.company.logo = String(value);
        },
        "form.white_logo"(value){
            this.company.white_logo = String(value);
        },
        company: {
            handler(company){
                this.checkCompany(company)
            },
            deep: true,
            immediate: true             
        }
    }
}
</script>