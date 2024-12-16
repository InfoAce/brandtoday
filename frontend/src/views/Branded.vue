<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container-fluid">
                <div class="row px-4">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h4 class="m-0">{{ $data.product.name }}</h4>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <nav aria-label="breadcrumb" class="theme-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#" @click="$router.push({ name: 'Home' })">Home</a></li>
                                <li class="breadcrumb-item"><a href="#" @click="$router.go(-1)">Products</a></li>
                                <li class="breadcrumb-item"><a href="#">Buy Branded</a></li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <!-- breadcrumb End -->
                 <!-- section start -->
        <section>
            <div class="collection-wrapper">
                <div class="container-fluid">
                    <div class="row px-4">
                        <div class="col-12 mb-4 text-center">
                            <h2>{{ $data.product.name }}</h2>
                        </div>
                        <div class="col-12 d-flex justify-content-center">
                            <div class="col-md-6 col-xs-12">
                                <div class="progresses">
                                    <div class="steps">
                                        <span><i class="fa fa-check" v-if="$data.steps.one.complete"></i></span>
                                        <span class="font-weight-bold" v-if="!$data.steps.one.complete">1</span>
                                    </div>
                                    <span class="line"></span>
                                    <div class="steps">
                                        <span><i class="fa fa-check" v-if="$data.steps.two.complete"></i></span>
                                        <span class="font-weight-bold" v-if="!$data.steps.two.complete">2</span>
                                    </div>                    
                                </div>                                     
                            </div>
                        </div>
                        <div class="col-12 text-center my-3">
                            <h3 class="text-theme mb-0">Select Branding Position(s)</h3>
                        </div>
                        <div class="col-12 my-4 d-flex align-items-center flex-column" v-if="$data.steps.current == 1">
                            <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 d-flex flex-column">
                                <div class="form-group d-flex" v-for="(branding,index) in $branding" :key="index">
                                    <input type="checkbox" @change="() => selectPosition(branding)" :id="branding.full_code" :value="branding.full_code" :checked="!isEmpty($data.form.positions.find( value => value.full_code == branding.full_code))" />
                                    <label class="mb-0 ml-2"><strong>{{ branding.name }}</strong></label>
                                </div>
                            </div>
                            <h5 class="text-danger" v-if="!isEmpty($data.errors) && has($data.errors,'positions')">{{  $data.errors.positions }}</h5>
                        </div>
                        <div class="col-12 my-4" v-if="$data.steps.current == 2">
                            <div class="container">
                                <div class="row">
                                    <div class="col-md-6 col-xs-12">
                                        <div class="card mb-3" v-for="(position,index) in $selectedPositions" :key="index">
                                            <div class="card-header">
                                                <label class="mb-0"><strong>{{ position.name }} - Position {{ position.code }}</strong></label>
                                            </div>
                                            <div class="card-body">
                                                <div class="form-group mb-0">
                                                    <select class="form-control" :value="$data.form.positions[index].method" @change="() => selectMethod(index)">
                                                        <option value="">Select Method</option>
                                                        <option v-for="(method,key) in position.methods" :key="`method_${key}`" :name="`${method.full_code}_method`" :value="method.full_code"> {{ method.name }} ({{ method.simple_code }}) - {{ method.colours }}</option>
                                                    </select>
                                                </div>
                                                <p class="text-danger mb-0"><strong>{{ get($data.errors,`positions[${index}].method`) }}</strong></p>
                                            </div>
                                            <div class="card-footer" v-if="!isEmpty($data.form.positions[index].method)">
                                                <div class="form-group mb-0">
                                                    <input type="file" :name="`${position.full_code}_file`" @change="() => uploadFile(index)" accept="application/pdf"/>
                                                </div>
                                                <p class="text-danger mb-0"><strong>{{ get($data.errors,`positions[${index}].file`) }}</strong></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-xs-12">
                                        <embed :src="`${$data.product.full_branding_guide}#toolbar=0`" style="width: 100%; height: 75vh; -webkit-transform:scale(1); -moz-transform-scale(1);" type="application/pdf"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 mb-4">
                            <div class="row justify-content-center">
                                <div :class="`d-flex ${$data.steps.current == 2 ? 'justify-content-between' : 'justify-content-center'} col-md-6 col-xs-12`">
                                    <button class="btn btn-theme btn-lg w-100 mx-2" v-if="$data.steps.current == 2" @click="$data.steps.current = 1">Back</button>   
                                    <button class="btn btn-theme btn-lg w-100 mx-2" :disabled="isEmpty($data.form.positions)" v-if="$data.steps.current == 1" @click="$data.steps.current = 2">Next</button>   
                                    <button class="btn btn-theme btn-lg w-100 mx-2" v-if="$data.steps.current == 2" @click="addToCart">Add To Cart</button>   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>


<script setup>
import { cloneDeep, each, get, isEmpty, has, set } from 'lodash';
import { computed, inject, reactive, ref, onBeforeMount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import * as yup from "yup";

const $api         = inject('$api');
const $data        = reactive({ 
    errors:  Object(),
    form:    { 
        step:      1,
        positions: Array()
    },
    isDisabled: Boolean(),
    product: Object(), 
    steps:   {
        current: 1,
        one:{
            complete: false,
        },
        two:{
            complete: false,
        },
    },
});
const $router      = useRouter();
const $route       = useRoute();
const $store       = useStore();

const $branding    = computed( () => $data.product.__branding__);
const $branded     = computed({
    get(){
        return $store.getters.branded;
    },
    set(value){
        $store.commit('branded',value);
    }
});
const $cart     = computed({
    get(){
        return $store.getters.cart;
    },
    set(value){
        $store.commit('cart',value);
    }
});
const $selectedPositions = computed( () => $data.form.positions.map(position => $data.product.__branding__.find( branding => branding.full_code == position.full_code)) );

const $formSchema = yup.object().shape({
    step: yup.number(),
    positions: yup.array().of(
        yup.object().shape({
            full_code: yup.string()
                          .required("*Branding full code is required."),
            code:      yup.string()
                          .required("*Branding position is required."),
            branding_name: yup.string()
                          .required("*Branding name is required."),                          
            method:    yup.string().when("step",{
                            is:   (step) => step == 2,
                            then: yup.string().strict().required("*Branding method is required.").test('Method is required', 'Method cannot be empty', value => !isEmpty(value) )
                        }),
            method_name:yup.string().when("step",{
                            is:   (step) => step == 2,
                            then: yup.string().strict().required("*Branding method is required.").test('Method is required', 'Method cannot be empty', value => !isEmpty(value) )
                        }),                        
            setup:    yup.number().when("step",{
                is:   (step) => step == 2,
                then: yup.number().strict().required("*Branding method is required.").test('Method is required', 'Method cannot be empty', value => value != 0  )
            }),   
            price:    yup.number().when("step",{
                is:   (step) => step == 2,
                then: yup.number().strict().required("*Branding method is required.").test('Method is required', 'Method cannot be empty', value => value != 0 )
            }),                                 
            file:      yup.mixed().when("step",{
                            is:   (step) => step == 2,
                            then: yup.mixed().strict().test('File is required', 'At least one file is required', value => !isEmpty(value) )
                        })        
        })
    ).strict().min(1).test('Positions are required', 'At least one position should be selected', value => !isEmpty(value) ),
});

/**
 * Validates a form field based on the provided field name.
 * Uses the formSchema to validate the field and updates the errors object accordingly.
 * Updates the isDisabled property based on the presence of errors.
 *
 * @param {string} field - The name of the field to validate.
 */
const validateForm = async (field) => {
    try {
        // Validate the field using the formSchema
        await $formSchema.validate($data.form,{ abortEarly: false });
        // If the field is valid, delete the corresponding error from the errors object
        delete $data.errors[field];
    } catch(error) {
        console.log(transformYupErrorsIntoObject(error));
        // If the field is invalid, update the errors object with the error message
        $data.errors = transformYupErrorsIntoObject(error);
    } finally {
        // Update the isDisabled property based on the presence of errors
        $data.isDisabled = !isEmpty($data.errors);
    }
} 
/**
 * Fetches the product details from the server and initializes the view.
 * @returns {Promise} A promise that resolves when the product details and related products are fetched and the view is initialized.
 */
const fetchProduct = async () => {
    try {
        $store.commit('loader',true); // Set loader

        // Destructure route params
        const { params: { full_code } } = $route;        
        
        // Fetch product details
        const { data:{ product } } = await $api.get(`/branding/${full_code}`);

        $data.product = cloneDeep(product);
        document.querySelector('meta[name="keywords"]')
                .setAttribute(
                    'content',
                    `${document.querySelector('meta[name="keywords"]').attributes.content.value}, ${product.full_code}, ${product.name}`
                );

    } catch (error) {
        $store.commit('loader',false);
        console.log(error);
    } finally {

    }          
}

const transformYupErrorsIntoObject = (errors) => {
  const validationErrors = {};

  errors.inner.forEach((error) => {
    if (error.path !== undefined) {
      validationErrors[error.path] = error.errors[0];
    }
  });

  return validationErrors;
};

const addToCart = () => {
    let data = cloneDeep($branded.value);
    set(data,'positions',$data.form.positions);
    $cart.value.push(data);
    $branded.value = {};
    $router.push({ name: "Cart" });
}

const selectMethod = (index) => {
    let method = $selectedPositions.value.map( position => position.methods ).flat().find( method => method.full_code == event.target.value );
    $data.form.positions[index].method = event.target.value;
    $data.form.positions[index].method_name = method.name;
    $data.form.positions[index].price  = method.price;
    $data.form.positions[index].setup = method.setup;
}

/**
 * Handles the file upload for the specified position index.
 * Logs the selected file to the console.
 *
 * @param {number} index - The index of the position for which the file is being uploaded.
 */
const uploadFile = (index) => {
    let file   = event.target.files[0];
    let reader = new FileReader();
    reader.addEventListener('load', (e) => {
        $data.form.positions[index].file = e.target.result;
    });
    reader.readAsDataURL(file);
}

const selectPosition = (branding) => {
    switch(event.target.checked){
        case true:
            $data.form.positions.push({
                full_code:     branding.full_code,
                code:          branding.code,
                branding_name: branding.name,
                method:        String(),
                method_name:   String(),
                setup:         Number(),
                price:         Number(),
                file:          Object()
            });    
        break;
        case false:
            $data.form.positions = $data.form.positions.filter(position => position.full_code != branding.full_code);
        break;
    }
}



onBeforeMount( () => fetchProduct() );

watch(
	() => $data.form, 
	(form) => {
        console.log(form);
		each(form,(value,key) => {
			validateForm(key);
		});
	},
	{ 
		deep: true,
        immediate: true
	}
);

watch(
	() => $data.steps.current, 
	(step) => {
        $data.form.step = step;
	}
);

</script>