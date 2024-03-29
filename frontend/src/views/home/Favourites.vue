<template>
<div class="tab-pane fade show active" id="wishlist">
    <div class="row">
        <div class="col-12">
            <div class="card dashboard-table mt-0">
                <div class="card-body table-responsive-sm">
                    <div class="top-sec">
                        <h3>My Wishlist</h3>
                    </div>
                    <div class="table-responsive-xl">
                        <table class="table cart-table wishlist-table">
                            <thead>
                                <tr class="table-head">
                                    <th scope="col">#</th>
                                    <th scope="col">Image</th>
                                    <th scope="col">Product name</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="has($data.favourites,'data') && !isEmpty($data.favourites.data)">
                                    <tr v-for="(favourite, index) in $data.favourites.data" :key="index">
                                        <td>{{ index + 1 }}</td>
                                        <td>
                                            <a href="javascript:void(0)">
                                                <img :src="favourite.product.images[0].urls[0].url" class="blur-up lazyloaded" alt="">
                                            </a>
                                        </td>
                                        <td>
                                            <span class="mt-0">{{ favourite.product.productName }}</span>
                                        </td>
                                        <td>
                                            <span>KSH {{  favourite.content.price }}</span>
                                        </td>
                                        <template v-if="has(favourite.content,'sizes')">
                                            <td>
                                                <span class="theme-color fs-6"> {{ sum(favourite.content.sizes.map( (size) => size.quantity)) }}</span>
                                            </td>
                                            <td>
                                                <span>KSH {{  favourite.content.price * sum(favourite.content.sizes.map( (size) => size.quantity)) }}</span>                                    
                                            </td>
                                        </template>
                                        <template v-else>
                                            <td>
                                                <span class="theme-color fs-6"> {{ favourite.content.quantity }}</span>
                                            </td>
                                            <td>
                                                <span>KSH {{  favourite.content.price * favourite.content.quantity }}</span>                                    
                                            </td>
                                        </template>
                                        <td>
                                            <a href="javascript:void(0)" class="btn btn-xs btn-solid" @click.prevent="moveToCart(favourite)">
                                                Move to Cart
                                            </a>
                                        </td>
                                    </tr>
                                </template>
                                <template v-else>
                                    <tr>
                                        <td colspan="7">
                                            <p class="text-info my-4"><i class="fa fa-exclamation-triangle"></i> Nothing found here.</p>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, inject, reactive } from 'vue';
import { useStore } from 'vuex';
import { cloneDeep, isEmpty, has, sum } from 'lodash';

const $api   = inject('$api');
const $store = useStore();
const $data  = reactive({ favourites: Object() });
const cart   = computed({
    get(){
        return $store.getters.cart;
    },
    set(value){
        console.log(value);
        $store.commit('cart',value);
    }
});

const fetch = () => {
    $store.commit('loader',true);
    $api.get('/favourites')
        .then( ({ data:{ favourites }}) => {
            $data.favourites = cloneDeep(favourites);
        })
        .catch( () => {
            $store.commit('loader',false);
        })
        .finally( () => {
            $store.commit('loader',false);
        });      
}

const moveToCart = (favourite: any) => {
    let { product: { productName, images:[ { urls: [ { url } ] } ] } } = favourite;
    cart.value.push({ ...favourite.content, name: productName, image: url });
}

onBeforeMount( () => fetch() );
</script>