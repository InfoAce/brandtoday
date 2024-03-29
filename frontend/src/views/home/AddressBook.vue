<template>
    <div class="tab-pane fade active show" id="address">
        <div class="row">
            <div class="col-12">
                <div class="card mt-0">
                    <div class="card-body">
                        <div class="top-sec">
                            <h3>Address Book</h3>
                            <a href="#" class="btn btn-sm btn-solid" data-bs-target="#edit-address" data-bs-toggle="modal">
                                <i class="fa fa-plus"></i>
                                Add New
                            </a>
                        </div>
                        <div class="address-book-section">
                            <div class="row g-4">
                                <div class="select-box active col-xl-4 col-md-6">
                                    <div class="address-box">
                                        <div class="top">
                                            <h6>mark jecno <span>home</span></h6>
                                        </div>
                                        <div class="middle">
                                            <div class="address">
                                                <p>549 Sulphur Springs Road</p>
                                                <p>Downers Grove, IL</p>
                                                <p>60515</p>
                                            </div>
                                            <div class="number">
                                                <p>mobile: <span>+91 123 - 456 - 7890</span></p>
                                            </div>
                                        </div>
                                        <div class="bottom">
                                            <a href="javascript:void(0)" data-bs-target="#edit-address" data-bs-toggle="modal" class="bottom_btn">edit</a>
                                            <a href="#" class="bottom_btn">remove</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Modal start -->
                <div class="modal theme-modal fade bd-example-modal-lg" id="addstaff" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Add Staff Member</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="form-group">
                                    <label for="first_name" class="col-form-label">First Name</label>
                                    <input type="text" class="form-control" id="first_name" v-model="data.form.first_name">
                                    <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'first_name')">{{data.errors.first_name}}</p>	
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button @click="() => addUser()" class="btn btn-primary" type="button" :disabled="data.isDisabled || data.loader.register">
                                    <i v-if="data.loader.register" class="fa fa-spinner fa-spin"></i>
                                    Create
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
import { isEmpty } from 'lodash';
console.log('here');

const data     = reactive({
    clients: Object(),
    errors:  Object(),
    form:{ 
        first_name: String(), 
        last_name:  String(), 
        email:      String(),
    },
    loader: {
        register: false
    },
    isDisabled: true
});

const formSchema = yup.object().shape({
	first_name:       yup.string()
						 .required("*First name is required"),
	email:            yup.string()
						 .email("*Enter a valid email address")
						 .required("*Email address is required"),                         
    last_name:        yup.string()
						 .required("*Last name is required"),                       
});

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
</script>