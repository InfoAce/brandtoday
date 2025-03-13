<template>
    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12 mb-4">
        <div class="card">
            <div class="card-body">
                <div class="product-box">
                    <div class="img-wrapper">
                        <div v-if="!isEmpty(product.images)">
                            <div class="front">
                                <a href="#" @click.prevent="$emit('show',product)">
                                    <img class="img-fluid blur-up lazyload bg-img" :src="product.images[0].urls[0].url" alt="">
                                </a>
                            </div>
                            <div class="back" v-if="product.images.length > 1">
                                <a href="#" @click.prevent="$emit('show',product)">
                                    <img :src="product.images[1].urls[0].url" class="img-fluid blur-up lazyload bg-img" alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 px-0 pt-3 ">
                        <p class="text-wrap p-0 m-0 text-theme">{{ product.full_code }}</p>
                        <a href="#" @click.prevent="$router.push({ name: 'Product', params: { product: product.id }})" class="text-theme">
                            <h5 class="text-wrap p-0 m-0"> {{ product.name }} </h5>
                        </a>
                        <h6 class="m-0 p-0" v-if="!isNull(product.branded)">Brand: {{ product.branded.name }}</h6>
                        <h6 class="m-0 p-0">{{ currency }} {{ product.price.toFixed(2) }}</h6>                                                    
                        <p class="m-0 p-0">Excl. VAT & Excl. Branding</p>
                        <h6 class="m-0 p-0">Stock: {{ product.stock }}</h6>
                        <ul class="color-variant p-0" v-if="!isEmpty(product.colour_images) && !isNull(product.colour_images)">
                            <li 
                                v-for="(colour,index) in product.colour_images" 
                                :key="index" 
                                :style="`border: 1px solid #cdcdcd; background: ${ colour.hex.length > 1 ? `linear-gradient(to right, ${colour.hex.map( hex => `${hex} ${100/colour.hex.length}%` ).join(',')} )`: colour.hex.map( hex => `${hex}` ).join(',') }`"
                            ></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { has, isEmpty, isNull } from 'lodash';
import { useStore } from 'vuex';

const $store  = useStore();
const $props  = defineProps({
    data:{
        default: Object(),
        type: Object
    }
});
const $emit = defineEmits(['show'])

const currency     = computed( () => $store.getters.home.company.currency );
const product: any = computed( () => $props.data );
</script>