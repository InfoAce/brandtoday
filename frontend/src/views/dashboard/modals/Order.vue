<template>
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
                    <div class="form-group">
                        <label for="last_name" class="col-form-label">Last Name</label>
                        <input type="text" class="form-control" id="last_name" v-model="data.form.last_name">
                        <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'last_name')">{{data.errors.last_name}}</p>	
                    </div>
                    <div class="form-group">
                        <label for="email" class="col-form-label">Email Address</label>
                        <input type="text" class="form-control" id="email" v-model="data.form.email">
                        <p class="text-danger col col-12 mb-4" v-show="has(data.errors,'email')">{{data.errors.email}}</p>	
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
</template>