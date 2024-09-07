<template>
    <div class="modal theme-modal fade bd-example-modal-lg" id="addbrand" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Add Image Brand</h5>
                    <button type="button" class="btn-close" @click="$emit('update-modal',false)" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">                                            
                        <div class="col-12">
                            <label>Image</label>
                            <input class="form-control" type="file" @change="onFileChange($event)" v-if="isEmpty($data.pickedImage) && isEmpty($data.form.path)" />
                            <div class="col-12 text-center" v-if="!isEmpty($data.pickedImage) && isEmpty($data.form.path)">
                                <VuePictureCropper                                
                                    :boxStyle="{
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: '#f8f8f8',
                                        margin: 'auto',
                                    }"
                                    :img="$data.pickedImage"
                                    :options="{
                                        viewMode: 1,
                                        dragMode: 'move',
                                        aspectRatio: 16 / 6,
                                        cropBoxResizable: false
                                    }"
                                    :presetMode="{
                                        mode: 'fixedSize',
                                        width: 3840,
                                        height: 2160,
                                    }"
                                />   
                                <div class="d-flex justify-content-between mt-2">
                                    <button class="btn btn-primary ml-2" type="button" @click="selectCrop"><i class="fa fa-spin fa-spinner" v-if="$data.crop"></i><span v-if="!$data.crop">Crop</span></button>
                                    <button class="btn btn-primary ml-2" type="button" @click="$data.pickedImage = String()">Cancel</button>
                                </div>
                            </div>    
                            <div class="col-12" v-if="isEmpty($data.pickedImage) && !isEmpty($data.form.path)">
                                <img :src="`${$store.getters.assetsUrl}/images/${$data.form.path}`" alt="" class="img-fluid blur-up lazyloaded col-12">
                            </div>             
                            <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'path')">{{$data.errors.path}}</p>	                            
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="addBanner" class="btn btn-primary" type="button" :disabled="$data.isDisabled || $data.loader">
                        <i v-if="$data.loader" class="fa fa-spinner fa-spin"></i>
                        Upload
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, inject, onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { each, isEmpty, has, get } from 'lodash';
import vueDropzone from 'dropzone-vue3'
import { useStore } from 'vuex';
import * as yup from "yup";
import VuePictureCropper, { cropper } from 'vue-picture-cropper'
import moment from 'moment';

// Magic variables
const $api   = inject("$api");
const $emit  = defineEmits(['fetch','update-modal']);
const $toast = inject('$toast');
const $data = reactive({
    errors: {},
    form: {
        path:  String(),
    },
    loader:     false,
    crop:        false,
    pickedImage: String(),
    isDisabled: false,
});
const $props = defineProps({
    show: {
        type:    Boolean,
        default: Boolean()
    },
});
const $store         = useStore();
const auth           = computed( () => $store.getters.auth );
const env            = computed( () => $store.getters.env );


// Banner Schema
const formSchema = yup.object().shape({                   
    path:        yup.string().required("*Image Path is required"),                      
});

/**
 * Adds a new banner to the website.
 *
 * Sends a POST request to the server with the form data containing the banner description, path, and title.
 * If the request is successful, triggers a success toast message and resets the form.
 * If the request fails, sets the loader to false.
 */
const addBanner = () => {
    // Set the loader to true to indicate that a request is being made
    $data.loader = true;

    // Send a POST request to the server with the form data
    $api.post(`/dashboard/website/brand`, $data.form)
        .then( () => { // If the request is successful
            // Trigger a success toast message
            $toast.success(`Banner added successfully`);
            // Reset the form
            resetForm();
        }) 
        .catch( () => { // If the request fails
            // Set the loader to false to indicate that the request has failed
            $data.loader = false;
        })
        .finally( () => { // Always executed
            // Set the loader to false to indicate that the request is complete
            $data.loader = false;
        })
}

/**
 * Updates the form's path with the uploaded image file path.
 * 
 * @param {Object} file - The uploaded image file object.
 * @returns {void}
 */
const imageUpdate = (file) => {
    // Parse the response from the server which contains the uploaded image file information
    let { xhr: { response } } = file, 
    // Parse the response as JSON to get the uploaded image file information
    upload                   = JSON.parse(response);
    
    // Set the form's path to the uploaded image file path
    $data.form.path = `images/${upload.file.filename}`;
};

/**
 * Validates the form field and updates the error state accordingly.
 * 
 * @param {string} field - The name of the field to validate.
 * @returns {void}
 */
const validateForm = (field) => {
    // Validate the form field using the form schema
    formSchema.validateAt(field, $data.form)
            .then((value,key) => {
                // If the validation is successful, remove the error message for the field
                delete $data.errors[field];
            })
            .catch((err) => {
                // If there is an error, set the error message for the field
                $data.errors[err.path] = err.message;
            })
            .finally( () => {
                // Update the isDisabled state based on whether there are any errors
                $data.isDisabled = !isEmpty($data.errors);
            });
}

/**
 * Handles the change event of the file input element.
 * 
 * @param {Event} event - The event object.
 * @returns {Promise<void>} - A promise that resolves when the image file is loaded.
 */
const onFileChange = async (event) => {
    // Get the selected file and retrieve its data URL using the getImageFile function
    $data.pickedImage = await getImageFile(event.target);
}

/**
 * Asynchronously selects a cropped image from the picture cropper and updates the form with its path.
 *
 * @return {Promise<void>} Resolves when the cropped image is selected and the form is updated.
 */
const selectCrop = async () => {
    try {

        $data.crop = true;

        // Check if the cropper is available
        if (!cropper) return;

        // Get the cropped image as a blob
        let blob: Blob = await cropper.getBlob();

        // Get the type of the blob and extract the file extension
        let type: any = blob?.type.split('/');
        let filename: number = moment().unix();

        // Create a new File object with the cropped image and a unique filename
        let file: object = new File([blob], `${filename.toString()}.${type[1]}`, {
            type: blob?.type,
            lastModified: new Date().getTime()
        });

        // Send the cropped image to the server for upload
        let { data: { file: storedFile } } = await $api!.post(`dashboard/website/upload`, {
            file
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        $data.crop = false;

        // Update the form with the path of the uploaded image
        $data.form.path = get(storedFile, 'filename');

        // Reset the picked image
        $data.pickedImage = String();

    } catch (error) {

        $data.crop = false;

        // Handle any errors that occur during the process
    }
}
/**
 * Asynchronously reads the contents of a file as a data URL and returns it.
 *
 * @param {Object} target - The target input element containing the file to be read.
 * @return {Promise} A Promise that resolves to the data URL of the file.
 */
const getImageFile = (target) => {
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

/**
 * Resets the form data and emits events to update the modal and fetch data.
 */
const resetForm = () => {
    // Reset the form data
    $data.form = {
        path:        String(), // Reset path to an empty string
    };

    // Emit an event to update the modal
    $emit('update-modal', false);

    // Emit an event to fetch data
    $emit('fetch');
}
// Watch open modal
watch(
    () => $props.show,
    (modal) => {
        if( modal === true){
            $('#addbrand').modal('show');
        }
        if( modal === false){
            $('#addbrand').modal('hide');
        }
    }
)

watch(
    () => $data.form, 
    (form) => {
        each(form,(value,key) => {
            validateForm(key);
        });
    },
    { 
        deep: true,
        immediate: true
    }
); 

</script>