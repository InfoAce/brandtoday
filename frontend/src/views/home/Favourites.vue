<template>
<div class="tab-pane fade show active" id="wishlist">
    <div class="row">
        <div class="col-12">
            <div class="card mt-0">
                <div class="card-body">
                    <CardLoader :loader="$data.loader" />
                    <div class="row">
                        <div class="top-sec col-12">
                            <h3>My Wishlist</h3>
                        </div>
                        <div class="address-book-section col-12">
                            <div class="row">
                                <template v-if="!isEmpty($data.favourites)">
                                    <div class="col-xl-4 col-md-6" v-for="(favourite, index) in $data.favourites" :key="index">
                                        <div class="select-box active mx-2">
                                            <div class="address-box row">
                                                <div class="top mb-6 col-12">
                                                    <h6><span>KSH {{ get(first(get(first(favourite.product.variants),'price')),'amount') }}</span></h6>
                                                </div>
                                                <div class="middle col-12">
                                                    <div class="row">
                                                        <div class="col-12 px-0">
                                                            <a href="#" @click.prevent="$router.push({ name:'Product',params:{ product: favourite.product.id }})"><h4 class="mb-0 text-theme"><strong>{{ favourite.product.name }}</strong></h4></a>
                                                        </div>
                                                        <div class="col-12 px-0 py-2">
                                                            <img :src="favourite.product.images[0].urls[0].url" style="width:100%; box-sizing: content-box;"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="bottom px-0">
                                                    <button 
                                                        class="btn btn-solid btn-xs hover-solid" 
                                                        @click="$router.push({ name:'Product',params:{ product: favourite.product.id }})"
                                                    ><i class="fa fa-eye"></i></button>
                                                    <button class="btn btn-solid btn-xs hover-solid" @click="deleteFavourite(favourite)">
                                                        <i class="fa fa-trash" v-if="!$store.getters.loader"></i>
                                                        <i class="fa fa-spin fa-spinner" v-if="$store.getters.loader"></i>
                                                    </button>
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
import { cloneDeep, isEmpty, first, get, has, sum } from 'lodash';
import { CardLoader } from '../../components';

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
</script>