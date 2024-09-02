<template>
    <ul class="show-div shopping-cart">
        <li v-for="(item,index) in cart" :key="index">
            <div class="close-circle">
                <a href="#" @click.prevent="cart.splice(index,1)">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </a>
            </div>
            <div class="media py-2">
                <a href="#" @click.prevent="$router.push({ name:'Product',params:{ product: item.code }})">
                    <img :aria-atomic="item.name" class="me-3" :src="item.image">
                </a>
                <div class="media-body">
                    <a href="#" @click.prevent="$router.push({ name:'Product',params:{ product: item.code }})">
                        <p>{{ item.name }}</p>
                    </a>
                    <h4>
                        <span>{{ item.quantity }} x KSH {{ item.price.toFixed(0) }}</span>
                    </h4>
                </div>
            </div>
        </li>
        <li>
            <div class="total">
                <h5>Subtotal : <span>KSH: {{ total }}</span></h5>
            </div>
        </li>
        <li>
            <div class="buttons">
                <a href="#" @click.prevent="$router.push({name:'Cart'})" class="view-cart">view cart</a> 
                <a href="#" @click.prevent="$router.push({name:'Checkout'})" class="checkout">checkout</a>
            </div>
        </li>
    </ul>
</template>

<script>
import { sum } from 'lodash';
export default {
    computed:{
        cart:{
            get(){
                return this.$store.getters.cart;
            },
            set(value){
                this.$store.commit('cart',value);
            }
        },
        total(){
            return sum(this.cart.map( val => val.price * val.quantity )).toFixed(0);
        }
    },
    name: "CartPopup"
}
</script>