<template>
    <div class="col-xl-3 col-6 col-grid-box mb-4">
        <div class="card">
            <div :class="`card-body product-card ${selected ? 'selected-card' : ''}`">
                <a href="#" @click.prevent="$emit('show',category)">
                    <div class="product-box">
                        <div class="img-wrapper">
                            <div class="front">                                                    
                                <img style="object-fit: cover !important;" v-if="!isEmpty(category.image)" :src="category.image" :alt="category.name" height="250" width="100%">
                            </div>
                        </div>
                        <div class="product-detail">
                            <h4>{{ category.name }}</h4>
                            <h6 class="text-muted">{{ category.products_count }} products</h6>
                        </div>
                    </div>
                </a>                                                        
            </div>
        </div>                                            
    </div>
</template>
<script setup lang="ts">
import { computed, defineEmits, defineProps } from 'vue';
import { has, isEmpty } from 'lodash';
import { useRoute } from 'vue-router';

const $route = useRoute();
const $props = defineProps({
    data: {
        default: Object(),
        type: Object
    }
});
const $emit = defineEmits(['show'])

const category: any = computed( () => $props.data);
const selected: any = computed( () => has($route.query, 'category') ? $route.query.category == category.value.code : false );
</script>