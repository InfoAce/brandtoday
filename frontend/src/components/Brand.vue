<template>
    <div class="col-xl-3 col-6 col-grid-box mb-4">
        <div class="card">
            <div class="card-body product-card">
                <a href="#" @click.prevent="$emit('show',brand)">
                    <div class="product-box">
                        <div class="img-wrapper">
                            <div class="front">                                                    
                                <img style="object-fit: cover !important;" v-if="!isEmpty(brand.image)" :src="brand.image" :alt="brand.name" height="100" width="100%">
                            </div>
                        </div>
                        <div class="product-detail">
                            <h4>{{ brand.name }}</h4>
                            <h6 class="text-muted">{{ brand.product_count }} products</h6>
                        </div>
                    </div>
                </a>                                                        
            </div>
        </div>                                            
    </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps } from 'vue';
import { isEmpty } from 'lodash';

const $props = defineProps({
    data: {
        default: Object(),
        type: Object
    }
});
const $emit = defineEmits(['show'])

const brand: any = computed(() => $props.data);
</script>