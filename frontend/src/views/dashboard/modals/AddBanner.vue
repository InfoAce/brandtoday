<template>
    <div class="modal theme-modal fade bd-example-modal-lg" id="addbanner" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Add Image Banner</h5>
                    <button type="button" class="btn-close" @click="$emit('update-modal',false)" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" name="title" class="form-control" v-model="$data.form.title" placeholder="Title">
                            <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'title')">{{$data.errors.title}}</p>	
                        </div>  
                        <div class="form-group col-md-12 col-sm-12 col-xs-12">
                            <label>Description</label>
                            <input type="text" name="description" class="form-control" v-model="$data.form.description" placeholder="Description">
                            <p class="text-danger col col-12 mb-0" v-show="has($data.errors,'description')">{{$data.errors.description}}</p>	
                        </div>                                              
                        <div class="col-12">
                            <label>Image</label>
                            <vue-dropzone
                                ref="dropzoneBanner" 
                                @vdropzone-success="imageUpdate"                       
                                id="dropzoneBanner" 
                                :options="$data.dropzoneOptions"
                            /> 
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
import { each, isEmpty, has } from 'lodash';
import vueDropzone from 'dropzone-vue3'
import { useStore } from 'vuex';
import * as yup from "yup";

// Magic variables
const $api   = inject("$api");
const $emit  = defineEmits(['fetch-data','update-modal']);
const $toast = inject('$toast');
const $data = reactive({
    errors: {},
    form: {
        description: String(),
        path:  String(),
        title:       String(),
    },
    dropzoneOptions:     {
        url: 'https://httpbin.org/post',
        thumbnailWidth: 300,
        maxFilesize:    3.0,   
        maxFiles:       1,
        acceptedFiles:  'image/*',
        dictRemoveFile: 'Remove file',
        headers:        {}             
    }, 
    loader:     false,
    isDisabled: false,
});
const $props = defineProps({
    show: {
        type:    Boolean,
        default: Boolean()
    },
});
const $store         = useStore();
const dropzoneBanner = ref(null);


// Banner Schema
const formSchema = yup.object().shape({
    description: yup.string().required("*Description is required"),                      
    path:  yup.string().required("*Image Path is required"),                      
    title:       yup.string().required("*Title is required"),                      
});

// Methods
const addBanner = () => {
    $data.loader = true;
    $api.post(`/dashboard/website/banner`,$data.form)
        .then( () => {
            $toast.success(`Banner added successfully`);
            resetForm();
        }) 
        .catch( () => {
            $data.loader = false;
        })
        .finally( () => {
            $data.loader = false;
        })
}

const imageUpdate = (file) => {
    let { xhr: { response } } = file, 
    upload          = JSON.parse(response);
    $data.form.path = `images/${upload.file.filename}`;
};

const validateForm = (field) => {
    formSchema.validateAt(field, $data.form)
            .then((value,key) => {
                delete $data.errors[field];
            })
            .catch((err) => {
                $data.errors[err.path] = err.message;
            })
            .finally( () => {
                $data.isDisabled = !isEmpty($data.errors);
            })
}

const resetForm = () => { 
    dropzoneBanner.value.removeAllFiles();
    $data.form = {
        description: String(),
        path:        String(),
        title:       String(),
    }
    $emit('update-modal',false);
    $emit('fetch-data');
}

// Watch open modal
watch(
    () => $props.show,
    (modal) => {
        if( modal === true){
            $('#addbanner').modal('show');
        }
        if( modal === false){
            $('#addbanner').modal('hide');
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

onBeforeMount( () => {
    let { authToken, env: { VITE_API_BASE_URL } } = $store.getters;
    $data.dropzoneOptions.url     = `${VITE_API_BASE_URL}/dashboard/website/upload`;
    $data.dropzoneOptions.headers = { "Authorization": `${authToken.token_type} ${authToken.token}`};    
});

</script>