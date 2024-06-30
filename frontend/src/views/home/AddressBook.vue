<template>
    <div class="tab-pane fade active show" id="address">
        <div class="row">
            <div class="col-12">
                <div class="card mt-0">
                    <div class="card-body">
                        <div class="top-sec">
                            <h3>Address Book</h3>
                            <a href="#" class="btn btn-sm btn-solid" @click.prevent="data.modals.add = true">
                                <i class="fa fa-plus"></i>
                                Add New
                            </a>
                        </div>
                        <div class="address-book-section">
                            <div class="row g-4">
                                <template v-if="!isEmpty(data.addresses)">
                                    <div class="select-box active col-xl-4 col-md-6" v-for="(address, index) in data.addresses" :key="index">
                                        <div class="address-box">
                                            <div class="top mb-6">+-----------------------------------------------------
                                                <h6><span>{{ address.category }}</span></h6>
                                            </div>
                                            <div class="middle">
                                                <div class="address">
                                                    <p><strong>Address Line 1</strong></p>
                                                    <p>{{ address.address_line_1 }}</p>
                                                </div>
                                                <div class="address">
                                                    <p><strong>Address Line 2</strong></p>
                                                    <p>{{ address.address_line_2 }}</p>
                                                </div>
                                                <div class="address">
                                                    <p><strong>Country</strong></p>
                                                    <p>{{ address.country }}</p>
                                                    <p><strong>Country / State</strong></p>
                                                    <p>{{ address.county_state }}</p>
                                                    <p><strong>City / Town</strong></p>
                                                    <p>{{ address.city_town }}</p>
                                                    <p><strong>Postal Code</strong></p>
                                                    <p>{{ address.postal_code }}</p>
                                                </div>
                                            </div>
                                            <div class="bottom">
                                                <a href="javascript:void(0)" data-bs-target="#edit-address" data-bs-toggle="modal" class="bottom_btn">edit</a>
                                                <a href="#" class="bottom_btn">remove</a>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>

                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Modal start -->
                <div class="modal fade bd-example-modal-lg" id="add-address" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header d-flex">
                                <h5 class="modal-title" id="exampleModalLabel">Add Address</h5>
                                <button type="button" class="btn-close mt-3 text-danger" @click="data.modals.add = false" aria-label="Close">
                                    <i class="fa fa-times-circle"></i>
                                </button>
                            </div>
                            <div class="modal-body">                            
                                <div class="form-group">
                                    <label for="address_line_1" class="col-form-label">Address Line 1</label>
                                    <input type="text" class="form-control" id="address_line_1" v-model="data.form.address_line_1">
                                    <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'address_line_1')">{{data.errors.address_line_1}}</p>	
                                </div>
                                <div class="form-group">
                                    <label for="address_line_1" class="col-form-label">Address Line 2</label>
                                    <input type="text" class="form-control" id="address_line_1" v-model="data.form.address_line_2">
                                    <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'address_line_1')">{{data.errors.addreaddress_line_2ss_line_1}}</p>	
                                </div>
                                <div class="form-group">
                                    <label for="postal_code" class="col-form-label">Postal Code</label>
                                    <input type="text" class="form-control" id="postal_code" v-model="data.form.postal_code">
                                    <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'postal_code')">{{data.errors.postal_code}}</p>	
                                </div>
                                <div class="form-group">
                                    <label for="country" class="col-form-label">Country</label>
                                    <input type="text" class="form-control" id="country" v-model="data.form.country">
                                    <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'country')">{{data.errors.country}}</p>	
                                </div>
                                <div class="form-group">
                                    <label for="county_state" class="col-form-label">County/State</label>
                                    <input type="text" class="form-control" id="county_state" v-model="data.form.county_state">
                                    <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'county_state')">{{data.errors.county_state}}</p>	
                                </div>  
                                <div class="form-group">
                                    <label for="city_town" class="col-form-label">City/Town</label>
                                    <input type="text" class="form-control" id="city_town" v-model="data.form.city_town">
                                    <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'city_town')">{{data.errors.city_town}}</p>	
                                </div>  
                                <div class="form-group">
                                    <label for="category" class="col-form-label">Category</label>
                                    <input type="text" class="form-control" id="category" v-model="data.form.category">
                                    <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'category')">{{data.errors.category}}</p>	
                                </div>                                                                                            
                            </div>
                            <div class="modal-footer">
                                <button @click="store" class="btn btn-solid btn-sm" type="button" :disabled="data.isDisabled || data.loader.save">
                                    <i v-if="data.loader.save" class="fa fa-spinner fa-spin"></i>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- modal end -->                      
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { cloneDeep, each, isEmpty, has, add} from 'lodash';
import { inject, onBeforeMount, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import * as yup from "yup";

// Data variables
const $api   = inject('$api');
const $store = useStore();
const data   = reactive({
    addresses: Array(),
    errors:  Object(),
    form:{ 
        address_line_1: String(), 
        address_line_2: String(), 
        county_state:   String(), 
        country:        String(),  
        postal_code:    String(), 
        city_town:      String(),
        category:       String()
    },
    loader: {
        save: false
    },
    isDisabled: true,
    modals: {
        add: Boolean()
    }
});

const formSchema = yup.object().shape({
	address_line_1: yup.string().required("*Address Line 1 is required"),
    address_line_2: yup.string(),				       
    city_town:      yup.string().required("*City / Town is required"),                       
    county_state:   yup.string().required("*County / State is required"),                       
    country:        yup.string().required("*Country is required"),                       
    postal_code:    yup.string().required("*Postal Code is required"),                       
    category:       yup.string().required("*Category is required"),                       
});

// Methods
const validateForm = (field) => {
  formSchema.validateAt(field, data.form)
            .then((value,key) => {
                delete data.errors[field];
            })
            .catch((err) => {
                data.errors[err.path] = err.message;
            })
            .finally( () => {
                data.isDisabled = !isEmpty(data.errors);
            })
}

const fetch = () => {
	$store.commit('loader',true);
	$api.get('/addresses')
		.then( ({ data:{ addresses }}) => {
            data.addresses = cloneDeep(addresses);
		})
		.catch( () => {
            $store.commit('loader',false);
		})
		.finally( () => {
            $store.commit('loader',false);
		});
}

const store = () => {
    data.loader.save = Boolean(true);
	$api.post('/addresses',data.form)
		.then( () => {
            fetch();
            clearForm();
		})
		.catch( () => {
			data.loader.save = Boolean();
		})
		.finally( () => {
			data.loader.save = Boolean();
		});
}

const clearForm = () => {
    data.form = {
        address_line_1: String(), 
        address_line_2: String(), 
        county_state:   String(), 
        country:        String(),  
        postal_code:    String(), 
        city_town:      String(),
        category:       String()
    };
    data.modals.add = Boolean();
}

// Lifecycle
onBeforeMount( () => fetch());

// Watchers
watch(
	() => data.form, 
	(form) => {
		each(form,(value,key) => {
			validateForm(key);
		});
	},
	{ 
		deep: true,
	}
);

watch(
    () => data.modals.add,
    (value) => {
        if(value){
            $('#add-address').modal('show');
        }
        if(!value){
            $('#add-address').modal('hide');
        }
    },
)

</script>