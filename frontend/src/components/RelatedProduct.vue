<template>
    <div class="col-md-4 col-xs-6">
        <div class="card">
            <div class="card-body">
                <div class="product-box">
                    <div class="img-wrapper">
                        <div v-if="!isEmpty(product.images)">
                            <div class="front">
                                <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.id }})">
                                    <img class="img-fluid blur-up lazyload bg-img" :src="product.images[0].urls[0].url" alt="">
                                </a>
                            </div>
                            <div class="back" v-if="product.images.length > 1">
                                <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.id }})">
                                    <img :src="product.images[1].urls[0].url" class="img-fluid blur-up lazyload bg-img" alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 px-0 pt-3 ">
                        <h6 class="text-wrap p-0 m-0 text-theme">{{ product.full_code }}</h6>
                        <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.fullCode }})" class="text-theme d-flex justify-content-between">
                            <p class="text-wrap p-0 m-0"> {{ product.name }} </p>
                            <p class="m-0 p-0"><strong>{{ currency }} {{ first(get(first(product.__variants__),'price')).amount }}</strong></p>
                        </a>
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
<script setup>
import { computed, defineProps, watch } from 'vue';
import convertCssColorNameToHex from 'convert-css-color-name-to-hex';
import { isEmpty, first, get, isNull } from 'lodash';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const $router  = useRouter();
const $store   = useStore();
const currency = computed( () => $store.getters.home.company.currency );

/**
 * Computed order from component properties
 * 
 * @param {defineProps}
 * @returns {Object}
 */
 const product = computed(() => $props.data);

/**
 * Define component properties
 * 
 * @param {Object}
 * @returns {Object}
 */
const $props = defineProps({
    data:{
        default: () => Object(),
        type:    Object
    },
});

/**
 * Convert a color name to its hex representation.
 *
 * @param {string} colour - The color name to convert.
 * @return {string} The hex representation of the color.
 */
const $convertToHex = (colour) => {
    // Convert the color name to lowercase and remove any spaces.
    const lowerCaseColour = colour.toLowerCase().split(' ').join('');
    
    // Use the convertCssColorNameToHex function to convert the color name to hex.
    return convertCssColorNameToHex(lowerCaseColour);
}
</script>