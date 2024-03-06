<template>
<div class="tab-pane fade show active" id="info">
    <div class="counter-section">
        <div class="row">
            <div class="col-md-4">
                <div class="counter-box">
                    <img src="/assets/images/icon/dashboard/sale.png" class="img-fluid">
                    <div>
                        <h3>{{ summary.orders }}</h3>
                        <h5>Total Order</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="counter-box">
                    <img src="/assets/images/icon/dashboard/homework.png" class="img-fluid">
                    <div>
                        <h3>{{ summary.pending_orders }}</h3>
                        <h5>Pending Orders</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="counter-box">
                    <img src="/assets/images/icon/dashboard/order.png" class="img-fluid">
                    <div>
                        <h3>{{ summary.favourites }}</h3>
                        <h5>Wishlist</h5>
                    </div>
                </div>
            </div>
        </div>
        <div class="box-account box-info">
            <div class="box-head">
                <h4>Account Information</h4>
            </div>
            <div class="row">
                <div class="col-sm-12 theme-card">
                    <form class="theme-form">
                        <div class="form-row row">
                            <div class="col-md-6 my-2">
                                <label for="first_name">First Name</label>
                                <input type="text" class="form-control" id="first_name" placeholder="Enter Your first name"  required="" v-model="user.first_name">
                            </div>
                            <div class="col-md-6 my-2">
                                <label for="last_name">Last Name</label>
                                <input type="text" class="form-control" id="last_name" placeholder="Enter Your first name" required="" v-model="user.last_name">
                            </div>
                            <div class="col-md-6 my-2">
                                <label for="review">Phone number</label>
                                <vue-tel-input 
                                    @input="getPhoneNumber" 
                                    defaultCountry="KE" 
                                    :inputOptions="{ styleClasses: 'form-control m-0', placeholder: 'Phone Number' }" 
                                    mode="international"
                                    :value="user.phone_number"
                                />
                            </div>
                            <div class="col-md-6 my-2">
                                <label for="email">Email</label>
                                <input type="text" class="form-control" id="email" placeholder="Email" required="" :value="user.email" disabled>                          
                            </div>
                            <div class="col-md-6 my-2">
                                <label for="address">Address</label>
                                <input type="text" class="form-control" id="address" placeholder="Enter address" required="" v-model="user.address">                          
                            </div>                            
                        </div>
                    </form>
                </div>
            </div>
            <div class="box mt-3">
                <div class="box-title">
                    <h3>Address Book</h3><a href="#">Manage Addresses</a>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <h6>Default Billing Address</h6>
                        <address>You have not set a default billing address.<br><a href="#">Edit
                                Address</a></address>
                    </div>
                    <div class="col-sm-6">
                        <h6>Default Shipping Address</h6>
                        <address>You have not set a default shipping address.<br><a
                                href="#">Edit Address</a></address>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>    
</template>

<script>
import { each, isEmpty, has } from 'lodash';
import * as yup from "yup";
import { VueTelInput } from 'vue3-tel-input'
import 'vue3-tel-input/dist/vue3-tel-input.css'
export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fetchUser(),
            next();
        });
    },
    components:{
        VueTelInput
    },
    data(){
        return{
            errors: {},
            summary: {
                orders:         Number(),
                pending_orders: Number(),
                favourites:     Number()
            },
            user: {},
            isDisabled: true            
        }
    },
    methods:{
        fetchUser(){
            this.$store.commit('loader',true);
            console.log('here');
            this.$api.get('/auth/user')
                .then( ({ data:{ user }}) => {
                    this.user = user;
                    console.log(user);
                })
                .catch( ({ response }) => {
                    this.$store.commit('loader',false);
                    if( !isEmpty(response.data) && response.data.statusCode == 400 ){
                        response.data.message.forEach( (value) => {
                            toast.info(value);
                        });
                    }
                })
                .finally( () => {
                    this.$store.commit('loader',false);
                });            
        },
        getPhoneNumber($event) {
            this.user.phone_number = $event.constructor == String ? $event : $event.target.value 
        }        
    }
}
</script>