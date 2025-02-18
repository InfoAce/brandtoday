<template>
<div class="tab-pane fade show active" id="wishlist">
    <div class="row">
        <div class="col-12">
            <div class="card mt-0">
                <div class="card-body">
                    <CardLoader :loader="$data.loader" />
                    <div class="row">
                        <div class="top-sec col-12 mb-0">
                            <h2 class="mb-0">My Wishlist</h2>
                        </div>
                        <div class="address-book-section col-12">
                            <div class="row">
                                <template v-if="!isEmpty($data.favourites)">
                                    <div class="col-xl-4 col-md-6" v-for="({product}, index) in $data.favourites" :key="index">
                                        <div class="card bg-white product-card">
                                            <div class="card-body">
                                                <div class="product-box">
                                                    <div class="img-wrapper">
                                                        <div v-if="!isEmpty(product.images)">
                                                            <div class="front">
                                                                <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.full_code }})">
                                                                    <img class="img-fluid blur-up lazyload bg-img" :src="product.images[0].urls[0].url" alt="">
                                                                </a>
                                                            </div>
                                                            <div class="back" v-if="product.images.length > 1">
                                                                <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.full_code }})">
                                                                    <img :src="product.images[1].urls[0].url" class="img-fluid blur-up lazyload bg-img" alt="" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-12 px-0 pt-3 ">
                                                        <h6 class="text-wrap p-0 m-0 text-theme">{{ product.full_code }}</h6>
                                                        <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.fullCode }})" class="text-theme d-flex justify-content-between">
                                                            <p class="text-wrap p-0 m-0"> {{ product.name }} </p>
                                                        </a>
                                                        <p class="m-0 p-0"><strong>{{ currency }} {{ product.price }}</strong></p>
                                                        <p class="m-0 p-0"><strong>Excl. VAT & Excl. Branding</strong></p>
                                                        <ul class="color-variant p-0" v-if="!isEmpty(product.colour_images) && !isNull(product.colour_images)">
                                                            <li v-for="(colour,index) in product.colour_images.map( color => color.hex).flat()" :key="index" :style="`background-color: ${colour}; border: 1px solid #cdcdcd;`"></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="col-12 d-flex justify-content-center">
                                        <h4 class="text-center"><i class="fa fa-exclamation-circle pl-2"></i><br>Nothing found here.</h4>
                                    </div>
                                </template>
                            </div>
                        </div>
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
import { cloneDeep, isEmpty, isNull, first, get, has, sum } from 'lodash';
import { CardLoader } from '../components';

const $api   = inject('$api');
const $store = useStore();
const $data  = reactive({ favourites: Object(), loader: Boolean() });
const cart   = computed({
    get(){
        return $store.getters.cart;
    },
    set(value){
        console.log(value);
        $store.commit('cart',value);
    }
});
const home     = computed( () => $store.getters.home);
const currency = computed( () => $store.getters.home.company.currency );

/**
 * Fetches the favourites from the backend API and updates the local store.
 * 
 * @returns {Promise<void>} A promise that resolves when the favourites are fetched and the local store is updated.
 */
const fetch = async () => {
    // Show loader
    try {

        $data.loader = true;

        // Fetch favourites from the backend API
        const { data: { favourites } } = await $api.get('/favourites');

        // Update the local store with the fetched favourites
        $data.favourites = cloneDeep(favourites);

    } catch (error) {
        // Do nothing, the loader will be removed in the finally block
    } finally {
        // Hide loader
        $data.loader = false;
    }
}

/**
 * Deletes a favourite from the backend API and updates the local store.
 * 
 * @param {number} id - The ID of the favourite to delete.
 * @returns {Promise<void>} A promise that resolves when the favourite is deleted and the local store is updated.
 */
const deleteFavourite = async (favourite: any) => {
    try {
        $data.loader = true;

        const { id } = favourite;

        // Delete the favourite from the backend API
        const { data: { favourites } } = await $api.delete(`/favourites/${id}`);

        // Update the local store with the deleted favourites
        $data.favourites = cloneDeep(favourites);
    } catch (error) {
        // Do nothing, the loader will be removed in the finally block
    } finally {
        // Hide loader
        $data.loader = false;
    }

}

const moveToCart = (favourite: any) => {
    let { product: { productName, images:[ { urls: [ { url } ] } ] } } = favourite;
    cart.value.push({ ...favourite.content, name: productName, image: url });
}

onBeforeMount( () => fetch() );
</script>../../src/components