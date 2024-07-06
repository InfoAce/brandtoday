<template>
    <div>
      <!-- Container-fluid starts-->
      <div class="container-fluid">
          <div class="page-header">
              <div class="row">
                  <div class="col-lg-6">
                      <div class="page-header-left">
                        <h3>Staff</h3>
                        <p>List of registered staff members.</p>
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
                          <li class="breadcrumb-item">Data management</li>
                          <li class="breadcrumb-item active">Staff members</li>
                      </ol>
                  </div>
              </div>
          </div>
      </div>
      <!-- Container-fluid Ends-->
  
      <!-- Container-fluid starts-->
      <div class="container-fluid">
          <div class="row">
              <div class="col-sm-12">
                  <div class="card">
                    <CardLoader />
                      <div class="card-header py-4">
                          <form class="form-inline search-form search-box">
                              <div class="form-group">
                                  <input class="form-control-plaintext" type="search" placeholder="Search..">
                              </div>
                          </form>  
                          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addstaff" >Add Staff Member</button>
                      </div>
                      <div class="card-body">                    
                          <div class="table-responsive table-desi">
                              <table class="review-table table">
                                  <thead>
                                      <tr>
                                          <th>#</th>
                                          <th>Avatar</th>
                                          <th>Name</th>
                                          <th>Email</th>
                                          <th>Phone Number</th>
                                          <th>Active</th>
                                          <th>Joined On</th>
                                          <th></th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                    <template v-if="!$isEmpty($data.staff.items)">
                                        <tr v-for="(staff,index) in $data.staff.items" :key="index">
                                          <td>{{ index + 1 }}</td>
                                          <td>
                                            <img v-if="!$isNull(staff.image)" :src="staff.image" :alt="`${staff.first_name} ${staff.last_name}`"/>
                                            <h2 v-else><i class="fa fa-user-circle"></i></h2>
                                          </td>
                                          <td>{{ staff.first_name }} {{ staff.last_name }}</td>
                                          <td>{{ staff.email }}</td>
                                          <td>{{ staff.phone_number }}</td>
                                          <td v-if="!$isEmpty(staff.email_verified_at)" class="td-check">
                                              <i data-feather="check-circle"></i>
                                          </td>
                                          <td v-if="$isEmpty(staff.email_verified_at)" class="td-cross">
                                              <i data-feather="x-circle"></i>
                                          </td>
                                          <td>{{ $moment(staff.created_at).format('Do MMMM, Y')}}</td>                                        
                                      </tr>
                                    </template>
                                    <template v-else>
                                        <tr>
                                            <td colspan="8" class="text-center p-5">
                                                <h4 class="mb-0"><i class="fa fa-exclamation-triangle"></i> No staff members found.</h4>
                                            </td>
                                        </tr>
                                    </template>
                                  </tbody>
                              </table>
                          </div>
                          <div class="col-12 py-4 d-flex justify-content-center" v-if="!$isEmpty($data.staff)">
                              <paginate
                                  :page-count="$data.staff.meta.itemCount"
                                  :click-handler="fetchPaginate"
                                  :prev-text="'Prev'"
                                  :next-text="'Next'"
                                  :container-class="'className'"
                              />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <!-- Container-fluid Ends-->
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
                        <input type="text" class="form-control" id="first_name" v-model="$data.form.first_name">
                        <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'first_name')">{{$data.errors.first_name}}</p>	
                    </div>
                    <div class="form-group">
                        <label for="last_name" class="col-form-label">Last Name</label>
                        <input type="text" class="form-control" id="last_name" v-model="$data.form.last_name">
                        <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'last_name')">{{$data.errors.last_name}}</p>	
                    </div>
                    <div class="form-group">
                        <label for="email" class="col-form-label">Email Address</label>
                        <input type="text" class="form-control" id="email" v-model="$data.form.email">
                        <p class="text-danger col col-12 mb-4" v-show="has($data.errors,'email')">{{$data.errors.email}}</p>	
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="() => addUser()" class="btn btn-primary" type="button" :disabled="$data.isDisabled || $data.loader.register">
                        <i v-if="$data.loader.register" class="fa fa-spinner fa-spin"></i>
                        Create
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- modal end -->      
    </div>
</template>
  
<script setup lang="ts">
import { inject, reactive, ref, watch, onMounted, onBeforeMount } from 'vue';
import { cloneDeep, debounce, each, isEmpty, isNull, has, set, times } from 'lodash';
import { useRouter } from 'vue-router';
import * as yup from "yup";
import { toast  } from "vue3-toastify";
import { useStore } from 'vuex';
import moment from 'moment';
import Paginate from "vuejs-paginate-next";
import { CardLoader } from '../../components';

const store    = useStore();
const router   = useRouter();
const $api     = inject('$api');
const swal     = inject('$swal');
const $moment  = moment;
const $isEmpty = isEmpty;
const $times   = times;
const $isNull  = isNull;
const $data    = reactive({
    errors:  Object(),
    form:{ 
        first_name: String(), 
        last_name:  String(), 
        email:      String(),
    },
    loader: {
        register: false
    },
    isDisabled: true,
    staff: Object(),
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

const fetch = (params = { page: 1, limit: 10}) => {
    let { page, limit } = params;

    store.commit('card_loader',true);
    
    $api.get(`/dashboard/users?type=staff&page=${page}&limit=${limit}`)
        .then( ({ data:{ users } }) => {
            $data.staff = cloneDeep(users);
        })
        .catch( ({ response }) => {
            store.commit('card_loader',false);
        })
        .finally( () => {
            store.commit('card_loader',false);
        });
}

const addUser = () => {
    $data.loader.register = true;
    $api.post(`/dashboard/users`,$data.form)
        .then( () => {
            $('#addstaff').modal('hide');
            toast.info('Staff member has been successfully added. Registration email has been sent.');
            resetForm();
            fetch();
        })
        .catch( ({ response }) => {
            $data.loader.register = false;
        })
        .finally( () => {
            $data.loader.register = false;
        });
}

const fetchPaginate = () => {

}

const resetForm = () => {
    set(data,'form',{
        first_name: String(), 
        last_name:  String(), 
        email:      String(),
    })
}
// Watch form changes
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

onBeforeMount(() => fetch());
</script>

<style scoped>
.review-table thead tr th {
    text-align: center !important;
}
.review-table tbody tr td {
    text-align: center !important;
}
</style>