<template>
<div class="tab-pane fade show active" id="info">
    <CardLoader :loader="loader" />
    <div class="counter-section">
        <div class="row">
            <div class="col-md-4">
                <div class="counter-box text-theme">
                    <h3>{{ summary.order_count }}</h3>
                    <h5><span class="fa fa-box fa-lg m-2"></span>Total Order</h5>
                </div>
            </div>
            <div class="col-md-4">
                <div class="counter-box">
                    <h3>{{ summary.pending_order_count }}</h3>
                    <h5><span class="fa fa-cart-arrow-down fa-lg m-2"></span>Pending Order</h5>
                </div>
            </div>
            <div class="col-md-4">
                <div class="counter-box">
                    <h3>{{ summary.favourite_count }}</h3>
                    <h5><span class="fa fa-heart fa-lg m-2"></span>Whislist</h5>
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
import { CardLoader } from '../components';

export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fetchUser(),
            next();
        });
    },
    components:{
        CardLoader,
        VueTelInput
    },
    data(){
        return{
            errors: Object(),
            loader: Boolean(),
            user:   Object(),
            summary: {
                favourite_count:     0,
                pending_order_count: 0,
                order_count:         0,
            },
            isDisabled: Boolean(true)            
        }
    },
    methods:{
        fetchUser(){
            this.loader = Boolean(true);
            this.$api.get('/account')
                .then( ({ data:{ favourite_count, pending_order_count, order_count, user}}) => {
                    this.summary.favourite_count     = favourite_count;
                    this.summary.pending_order_count = pending_order_count;
                    this.summary.order_count         = order_count;
                    this.user                        = user;
                })
                .catch( ({ response }) => {
                    this.loader = Boolean();
                    if( !isEmpty(response.data) && response.data.statusCode == 400 ){
                        response.data.message.forEach( (value) => {
                            toast.info(value);
                        });
                    }
                })
                .finally( () => {
                    this.loader = Boolean();
                });            
        },
        getPhoneNumber($event) {
            this.user.phone_number = $event.constructor == String ? $event : $event.target.value 
        }        
    }
}
</script>