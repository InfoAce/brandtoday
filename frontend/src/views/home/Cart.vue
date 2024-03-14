<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h2>Shopping Cart</h2>
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
                    <div class="col-sm-12 table-responsive-xs">
                        <table class="table cart-table">
                            <thead>
                                <tr class="table-head">
                                    <th scope="col">image</th>
                                    <th scope="col">product name</th>
                                    <th scope="col">price</th>
                                    <th scope="col">quantity</th>
                                    <th scope="col">action</th>
                                    <th scope="col">total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in items" :key="index">
                                    <td>
                                        <a href="#" @click.prevent="$router.push({ name:'Product',params:{ product: item.code }})"><img :src="item.image" alt=""></a>
                                    </td>
                                    <td>
                                        <a href="#" @click.prevent="$router.push({ name:'Product',params:{ product: item.code }})">{{ item.name }}</a>
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
                                                    <a href="#" class="icon" @click.prevent="items.splice(index,1)"><i class="ti-close"></i></a>
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
                                                <input type="text" :name="`quantity_${item?.code}`" class="form-control input-number" v-model="item.quantity">
                                            </div>
                                        </div>
                                    </td>
                                    <td><a href="#" class="icon" @click.prevent="items.splice(index,1)"><i class="ti-close"></i></a></td>
                                    <td>
                                        <h2 class="td-color">KSH {{ item.quantity * item.price }}</h2>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="table-responsive-md">
                            <table class="table cart-table ">
                                <tfoot>
                                    <tr>
                                        <td>total price: KSH</td>
                                        <td>
                                            <h2>{{ total }}</h2>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="row cart-buttons">
                    <div class="col-6"><a href="#" class="btn btn-solid" @click.prevent="$router.push({ name: 'Products' })">continue shopping</a></div>
                    <div class="col-6"><a href="#" class="btn btn-solid" @click.prevent="$router.push({ name: 'Checkout' })">check out</a></div>
                </div>
            </div>
        </section>
        <!--section end-->        
    </div>
</template>

<script lang="ts">
import { sum } from 'lodash';
export default {
    computed:{
        items:{
            get(): any {
                return this?.$store.getters.cart;
            },
            set(value:any): void {
                this?.$store.commit('cart',value);
            }
        },
        total(): number{
            return sum(this?.items.map( (val:any) => val.price * val.quantity ));
        }
    },
    name: "CartPage"
}
</script>