<template>
    <div class="tab-pane fade active show" id="address">
        <div class="row">
            <div class="col-12">
                <div class="card mt-0">
                    <div class="card-body">
                        <CardLoader :loader="$data.loader.fetch" />
                        <div class="row">
                            <div class="col-12 mb-4">
                                <div class="row">
                                    <div class="col-md-8 col-xs-12">
                                        <h2>Address Book</h2>
                                    </div>
                                    <div class="col-md-4 col-xs-12">
                                        <a href="#" class="btn btn-sm btn-solid" @click.prevent="$data.modals.add = true">
                                            <i class="fa fa-plus"></i>
                                            Add New
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="address-book-section col-12">
                                <div class="row" style="height:">
                                    <template v-if="!isEmpty($data.addresses)">
                                        <div class="select-box active col-xl-4 col-md-6" v-for="(address, index) in $data.addresses" :key="index">
                                            <div class="address-box">
                                                <div class="top mb-6">
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
                                                    <a href="#" class="bottom_btn" @click.prevent="$fetchAddress(address, index)">
                                                        Edit
                                                        <i class="fa fa-spinner fa-spin" v-if="address.fetch"></i>
                                                    </a>
                                                    <a href="#" class="bottom_btn text-danger" @click.prevent="$deleteAddress(address, index)">Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="col-12 d-flex justify-content-center">
                                            <h4 class="text-center"><i class="fa fa-exclamation-circle pl-2"></i><br>No addresses found.</h4>
                                        </div>
                                    </template>
                                </div>
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
                                <button type="button" class="btn-close mt-3 text-danger" @click="$data.modals.add = false" aria-label="Close">
                                    <i class="fa fa-times-circle"></i>
                                </button>
                            </div>
                            <div class="modal-body">                            
                                <div class="form-group">
                                    <label for="address_line_1" class="col-form-label">Address Line 1</label>
                                    <input type="text" class="form-control" id="address_line_1" v-model="$data.form.address_line_1">
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'address_line_1')">{{$data.errors.address_line_1}}</p>	
                                </div>
                                <div class="form-group">
                                    <label for="address_line_1" class="col-form-label">Address Line 2</label>
                                    <input type="text" class="form-control" id="address_line_1" v-model="$data.form.address_line_2">
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'address_line_1')">{{$data.errors.addreaddress_line_2ss_line_1}}</p>	
                                </div>
                                <div class="form-group">
                                    <label for="postal_code" class="col-form-label">Postal Code</label>
                                    <input type="text" class="form-control" id="postal_code" v-model="$data.form.postal_code">
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'postal_code')">{{$data.errors.postal_code}}</p>	
                                </div>
                                <div class="form-group">
                                    <label for="country" class="col-form-label">Country</label>
                                    <input type="text" class="form-control" id="country" v-model="$data.form.country">
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'country')">{{$data.errors.country}}</p>	
                                </div>
                                <div class="form-group">
                                    <label for="county_state" class="col-form-label">County/State</label>
                                    <input type="text" class="form-control" id="county_state" v-model="$data.form.county_state">
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'county_state')">{{$data.errors.county_state}}</p>	
                                </div>  
                                <div class="form-group">
                                    <label for="city_town" class="col-form-label">City/Town</label>
                                    <input type="text" class="form-control" id="city_town" v-model="$data.form.city_town">
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'city_town')">{{$data.errors.city_town}}</p>	
                                </div>  
                                <div class="form-group">
                                    <label for="category" class="col-form-label">Category</label>
                                    <input type="text" class="form-control" id="category" v-model="$data.form.category">
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'category')">{{$data.errors.category}}</p>	
                                </div>                                                                                            
                            </div>
                            <div class="modal-footer">
                                <button @click="store" class="btn btn-solid btn- btn-sm" type="button" :disabled="$data.isDisabled || $data.loader.save">
                                    <i v-if="$data.loader.save" class="fa fa-spinner fa-spin"></i>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade bd-example-modal-lg" id="edit-address" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header d-flex align-items-center">
                                <h4 class="modal-title" id="exampleModalLabel">Edit Address</h4>
                                <a href="#" @click.prevent="$data.modals.edit = false" class="text-muted">
                                    <i class="fa fa-times"></i>
                                </a>
                            </div>
                            <div class="modal-body">                            
                                <div class="form-group">
                                    <label for="address_line_1" class="col-form-label">Address Line 1</label>
                                    <input type="text" class="form-control" id="address_line_1" v-model="$data.form.address_line_1">
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'address_line_1')">{{$data.errors.address_line_1}}</p>	
                                </div>
                                <div class="form-group">
                                    <label for="address_line_1" class="col-form-label">Address Line 2</label>
                                    <input type="text" class="form-control" id="address_line_1" v-model="$data.form.address_line_2">
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'address_line_1')">{{$data.errors.address_line_2}}</p>	
                                </div>
                                <div class="form-group">
                                    <label for="postal_code" class="col-form-label">Postal Code</label>
                                    <input type="text" class="form-control" id="postal_code" v-model="$data.form.postal_code">
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'postal_code')">{{$data.errors.postal_code}}</p>	
                                </div>
                                <div class="form-group">
                                    <label for="country" class="col-form-label">Country</label>
                                    <input type="text" class="form-control" id="country" v-model="$data.form.country">
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'country')">{{$data.errors.country}}</p>	
                                </div>
                                <div class="form-group">
                                    <label for="county_state" class="col-form-label">County/State</label>
                                    <input type="text" class="form-control" id="county_state" v-model="$data.address.county_state">
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'county_state')">{{$data.errors.county_state}}</p>	
                                </div>  
                                <div class="form-group">
                                    <label for="city_town" class="col-form-label">City/Town</label>
                                    <input type="text" class="form-control" id="city_town" v-model="$data.form.city_town">
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'city_town')">{{$data.errors.city_town}}</p>	
                                </div>  
                                <div class="form-group">
                                    <label for="category" class="col-form-label">Category</label>
                                    <input type="text" class="form-control" id="category" v-model="$data.form.category">
                                    <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'category')">{{$data.errors.category}}</p>	
                                </div>                                                                                            
                            </div>
                            <div class="modal-footer">
                                <button @click="$updateAddress" class="btn btn-solid btn- btn-sm" type="button" :disabled="$data.isDisabled || $data.loader.update">
                                    <i v-if="$data.loader.update" class="fa fa-spinner fa-spin"></i>
                                    Update
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
import { cloneDeep, each, isEmpty, has, pick} from 'lodash';
import { inject, onBeforeMount, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import * as yup from "yup";
import { CardLoader } from '../components';

// Data variables
const $api: any = inject('$api');
const $store    = useStore();
const $swal     = inject('$swal');
const $data     = reactive({
    addresses: Array(),
    address:   Object(),
    errors:    Object(),
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
        fetch:  Boolean(),
        update: false,
        save:   false
    },
    isDisabled: true,
    modals: {
        add: Boolean(),
        edit: Boolean()
    }
});

const formSchema = yup.object().shape({
	address_line_1: yup.string().required("*Address Line 1 is required"),
    address_line_2: yup.string(),
    id:             yup.string(),				       
    city_town:      yup.string().required("*City / Town is required"),                       
    county_state:   yup.string().required("*County / State is required"),                       
    country:        yup.string().required("*Country is required"),                       
    postal_code:    yup.string().required("*Postal Code is required"),                       
    category:       yup.string().required("*Category is required"),                       
});

// Methods
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

/**
 * Deletes an address after confirming with the user.
 * Updates the address list after successful deletion.
 *
 * @param {Object} address - The address object containing the id to be deleted.
 */
 const $fetchAddress = async ({ id, fetch }: any, index: number) => {
    try {
        // Set loader state to true
        $data.addresses[index].fetch = true;

        // Send a DELETE request to the API to delete the address
        const { data: { address } } = await $api.put(`/addresses/${id}/show`);

        // Edit the address
        $data.form = pick(address,['id','address_line_1','address_line_2','city_town','county_state','country','postal_code','category']);

        // Open modal
        $data.modals.edit = true;

    } catch (error) {
        // Handle errors by resetting the loader state
        $data.addresses[index].fetch = false;
    } finally {
        // Ensure the loader is reset to false after the operation completes
        $data.addresses[index].fetch = false;
    }
}

/**
 * Deletes an address after confirming with the user.
 * Updates the address list after successful deletion.
 *
 * @param {Object} address - The address object containing the id to be deleted.
 */
 const $updateAddress = async () => {
    try {
        // Set loader state to true
        $data.loader.update = true;

        // Destructure form data
        const { id }: any = $data.form;

        // Send a DELETE request to the API to delete the address
        await $api.put(`/addresses/${id}/update`,$data.form);

        // Edit address book
        $data.modals.edit = false;

        clearForm();

        // Refresh the address list
        await fetch();

    } catch (error) {
        // Handle errors by resetting the loader state
        $data.loader.update = false;
    } finally {
        // Ensure the loader is reset to false after the operation completes
        $data.loader.update = false;
    }
}

/**
 * Deletes an address after confirming with the user.
 * Updates the address list after successful deletion.
 *
 * @param {Object} address - The address object containing the id to be deleted.
 */
const $deleteAddress = async ({ id }: any, index) => {
    try {
        // Show a confirmation dialog to the user
        const { isConfirmed } = await $swal.fire({
            icon: 'question', // Icon to display in the dialog
            title: 'Delete Address', // Title of the dialog
            text: 'Are you sure you want to delete this address?', // Text content of the dialog
            showCancelButton: true // Whether to show a "Cancel" button
        });

        // If the user does not confirm, exit the function
        if (!isConfirmed) { return; }

        // Set loader state to true
        $data.addresses[index].fetch = true;

        // Send a DELETE request to the API to delete the address
        await $api.delete(`/addresses/${id}/delete`);

        // Refresh the address list
        await fetch();

    } catch (error) {
        // Handle errors by resetting the loader state
        $data.addresses[index].fetch = false;

    } finally {
        // Ensure the loader is reset to false after the operation completes
        $data.addresses[index].fetch = false;
    }
}

const fetch = () => {
	$data.loader.fetch = Boolean(true);
	$api.get('/addresses')
		.then( ({ data:{ addresses }}: any) => {
            $data.addresses = cloneDeep(addresses).map( (address: any) => ({ ...address, fetch: false }));
		})
		.catch( () => {
            $data.loader.fetch = Boolean();
		})
		.finally( () => {
            $data.loader.fetch = Boolean();
		});
}

const store = () => {
    $data.loader.save = Boolean(true);
	$api.post('/addresses',$data.form)
		.then( () => {
            fetch();
            clearForm();
		})
		.catch( () => {
			$data.loader.save = Boolean();
		})
		.finally( () => {
			$data.loader.save = Boolean();
		});
}

const clearForm = () => {
    $data.form = {
        address_line_1: String(), 
        address_line_2: String(), 
        county_state:   String(), 
        country:        String(),  
        postal_code:    String(), 
        city_town:      String(),
        category:       String()
    };
    $data.modals.add = Boolean();
}

// Lifecycle
onBeforeMount( () => fetch());

// Watchers
watch(
	() => $data.form, 
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
    () => $data.modals.add,
    (value) => {
        if(value){
            $('#add-address').modal('show');
        }
        if(!value){
            $('#add-address').modal('hide');
        }
    },
)

watch(
    () => $data.modals.edit,
    (value) => {
        if(value){
            $('#edit-address').modal('show');
        }
        if(!value){
            $('#edit-address').modal('hide');
        }
    },
)

</script>