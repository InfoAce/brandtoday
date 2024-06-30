<template>
<div class="tab-pane fade show active" id="info">
    <div class="counter-section">
        <div class="row">
            <div class="col-md-4">
                <div class="counter-box">
                    <img src="/assets/home/images/icon/dashboard/sale.png" class="img-fluid">
                    <div>
                        <h3>{{ user.order_count }}</h3>
                        <h5>Total Order</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="counter-box">
                    <img src="/assets/home/images/icon/dashboard/homework.png" class="img-fluid">
                    <div>
                        <h3>{{ user.pending_order_count }}</h3>
                        <h5>Pending Orders</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="counter-box">
                    <img src="/assets/home/images/icon/dashboard/order.png" class="img-fluid">
                    <div>
                        <h3>{{ user.favourite_count }}</h3>
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
            user: {},
            isDisabled: true            
        }
    },
    methods:{
        fetchUser(){
            this.$store.commit('loader',true);
            this.$api.get('/account')
                .then( ({ data:{ user }}) => {
                    this.user = user;
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