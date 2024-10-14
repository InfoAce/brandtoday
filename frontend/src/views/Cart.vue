<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h4>Shopping Cart</h4>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <nav aria-label="breadcrumb" class="theme-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#" @click="$router.push({ name: 'Home' })">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Shopping</li>
                                <li class="breadcrumb-item active" aria-current="page">Cart</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <!-- breadcrumb End -->


        <!--section start-->
        <section class="cart-section section-b-space">
            <div class="container">
                <div class="row">
                    <div class="col-sm-12 table-responsive-md">
                        <table class="table cart-table">
                            <thead>
                                <tr class="table-head">
                                    <th scope="col">Image</th>
                                    <th scope="col">Product name</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="!isEmpty(items)">
                                    <template v-for="(item,index) in items" :key="`item_${index}`">
                                        <template v-if="has(item,'sizes')">
                                            <tr v-for="(size,key) in item.sizes" :key="key">
                                                <td>
                                                    <a href="#" @click.prevent="$router.push({ name:'Product',params:{ product: item.code }})">
                                                        <img :src="item.image" :alt="item.name" class="img-thumbnail">
                                                    </a>
                                                </td>
                                                <td>
                                                    <a href="#" @click.prevent="$router.push({ name:'Product',params:{ product: item.code }})"><strong>{{ item.name }} - {{ size.name }}</strong></a>
                                                    <div class="mobile-cart-content row">
                                                        <div class="col">
                                                            <div class="qty-box">
                                                                <div class="input-group">
                                                                    <input type="text" :name="`quantity_${item?.code}`" class="form-control input-number" v-model="item.quantity">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <h2 class="td-color">KSH {{ item.price }}</h2>
                                                        </div>
                                                        <div class="col">
                                                            <h2 class="td-color">
                                                                <a href="#" class="icon" @click.prevent="items.splice(index,1)"><i class="fa fa-trash"></i></a>
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <h2>KSH {{ item.price }}</h2>
                                                </td>
                                                <td>
                                                    <div class="qty-box">
                                                        <div class="input-group">
                                                            <input type="number" :name="`quantity_${item?.code}_${size.name}`" min="1" class="form-control input-number" v-model="size.quantity">
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <h2 class="td-color">KSH {{ (item.price * size.quantity).toFixed(0) }}</h2>
                                                </td>
                                                <td>
                                                    <a href="#" class="icon" @click.prevent="removeSizeItem({ item, key, index})"><i class="fa fa-trash"></i></a>
                                                </td>
                                            </tr>
                                        </template>
                                        <template v-else>
                                            <tr>
                                                <td>
                                                    <a href="#" @click.prevent="$router.push({ name:'Product',params:{ product: item.code }})">
                                                        <img :src="item.image" :alt="item.name" class="img-thumbnail">
                                                    </a>
                                                </td>
                                                <td>
                                                    <a href="#" @click.prevent="$router.push({ name:'Product',params:{ product: item.code }})"><strong>{{ item.name }}</strong></a>
                                                    <div class="mobile-cart-content row">
                                                        <div class="col">
                                                            <div class="qty-box">
                                                                <div class="input-group">
                                                                    <input type="text" :name="`quantity_${item?.code}`" class="form-control input-number" v-model="item.quantity">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col">
                                                            <h2 class="td-color">KSH {{ item.price }}</h2>
                                                        </div>
                                                        <div class="col">
                                                            <h2 class="td-color">
                                                                <a href="#" class="icon" @click.prevent="items.splice(index,1)"><i class="fa fa-trash"></i></a>
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <h2>KSH {{ item.price }}</h2>
                                                </td>
                                                <td>
                                                    <div class="qty-box" v-if="has(item,'sizes')">
                                                        <div class="input-group">
                                                            <input type="text" :name="`quantity_${item?.code}`" class="form-control input-number" disabled :value="sum(item.sizes.map( (size: any) => size.quantity))">
                                                        </div>
                                                    </div>
                                                    <div class="qty-box" v-if="!has(item,'sizes')">
                                                        <div class="input-group">
                                                            <input type="number" :name="`quantity_${item?.code}`" min="1" class="form-control input-number" v-model="item.quantity">
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <h2 class="td-color" v-if="has(item,'sizes')">KSH {{ (sum(item.sizes.map( (size: any) => size.quantity)) * item.price).toFixed(0) }}</h2>
                                                    <h2 class="td-color" v-if="!has(item,'sizes')">KSH {{ (item.quantity * item.price).toFixed(0) }}</h2>
                                                </td>
                                                <td>
                                                    <a href="#" class="icon" @click.prevent="items.splice(index,1)"><i class="fa fa-trash"></i></a>
                                                </td>
                                            </tr>                                            
                                        </template>
                                    </template>
                                    <tr>
                                        <td colspan="3"></td>
                                        <td> 
                                            <h2 class="td-color">total price: </h2>
                                        </td>
                                        <td colspan="2">
                                            <h2 class="td-color">KSH {{ total.toFixed(0) }}</h2>
                                        </td>
                                    </tr>
                                </template>
                                <template v-else>
                                    <tr>
                                        <td colspan="7" class="text-center">
                                            <p class="text-info mb-0">
                                                <i class="fa fa-exclamation-triangle"></i>
                                                Nothing found here.
                                            </p>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row cart-buttons">
                    <div class="col-6"><a href="#" class="btn btn-solid" @click.prevent="$router.push({ name: 'Home' })">continue shopping</a></div>
                    <div class="col-6"><a v-if="!isEmpty(items)" href="#" class="btn btn-solid" @click.prevent="$router.push({ name: 'Checkout' })">check out</a></div>
                </div>
            </div>
        </section>
        <!--section end-->        
    </div>
</template>

<script setup lang="ts">
import { isEmpty, has, sum } from 'lodash';
import { computed } from 'vue';
import { useStore } from 'vuex';

const $store = useStore();

const items = computed({
    get(): any {
        return $store.getters.cart;
    },
    set(value:any): void {
        $store.commit('cart',value);
    }
});

const total = computed( () => { 
    return sum(items.value.map( (val:any) => { 
        return has(val,'sizes') ? (val.price * sum(val.sizes.map( (size: any) => size.quantity))) : (val.price * val.quantity)
    }));
});

const removeSizeItem = ({ item, key, index}) => {

    if( item.sizes.length == 1 ){
        items.value.splice(index,1);
    }

    item.sizes.splice(key,1)
}

</script>
<style scoped>
.cart-section tbody tr td, .wishlist-section tbody tr td {
    text-align: left;
    min-width: 0px;
}
.cart-section .cart-table thead th, .wishlist-section .cart-table thead th{
    text-align: left;
    font-weight: 0;
    padding: 0;
    text-transform:none;
}
.qty-box .input-group {
    justify-content: start;
}
</style>