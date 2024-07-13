<template>
    <div class="col-xl-2 col-md-4 col-6">
        <div class="product-box">
            <div class="img-wrapper">
                <div v-if="!isEmpty(product.images)">
                    <div class="front">
                        <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.fullCode }})">
                            <img class="img-fluid blur-up lazyload bg-img" :src="product.images[0].urls[0].url" alt="">
                        </a>
                    </div>
                    <div class="back" v-if="product.images.length > 1">
                        <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.fullCode }})">
                            <img :src="product.images[1].urls[0].url" class="img-fluid blur-up lazyload bg-img" alt="" />
                        </a>
                    </div>
                </div>
                <div class="cart-info cart-wrap">
                    <button data-bs-toggle="modal" data-bs-target="#addtocart" title="Add to cart">
                        <i class="ti-shopping-cart"></i>
                    </button> 
                    <a href="javascript:void(0)" title="Add to Wishlist">
                        <i class="ti-heart" aria-hidden="true"></i>
                    </a> 
                    <a href="#" data-bs-toggle="modal" :data-bs-target="`#${product.fullCode}`" title="Quick View">
                        <i class="ti-search" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
            <div class="product-detail">
                <div>
                    <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.fullCode }})">
                        <h6>{{ product.productName }}</h6>
                    </a>
                    <h4>KSH {{ product.price }}</h4>
                    <ul class="color-variant p-0" v-show="!isEmpty(product.colourImages)">
                        <li v-for="(colour,index) in product.colourImages" :key="index" :style="`background-color: ${ $convertToHex(colour.name) }; border: 1px solid #ededed;`"></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>    
</template>
<script setup>
import { computed, defineProps, watch } from 'vue';
import convertCssColorNameToHex from 'convert-css-color-name-to-hex';
import { isEmpty } from 'lodash';
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