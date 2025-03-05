<template>
<div class="col-12 px-0 mb-4 position-sticky"> 
    <div class="card">
        <div class="card-body">
            <div class="row">
                <div class="col-12 d-flex justify-content-between">
                    <div class="row">
                        <div class="col-12">
                            <label>Search Name</label>
                            <input class="form-control" v-model="filters.name" placeholder="Search Name"/>
                        </div>
                        <div class="col-12 mt-2">
                            <label class="mr-2">Clearance Items</label>
                            <VueToggles v-model="filters.clearance" checkedText="Yes" uncheckedText="No" checkedBg="#7e1414" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <label>Price Range</label>
                            <VueSlider 
                                v-model="form.price" 
                                :min="slider_options.min" 
                                :max="slider_options.max" 
                                :processStyle="slider_options.processStyle"
                            />
                        </div>
                        <div class="col">
                            <label>Sort Pricing</label>
                            <select class="form-control" placeholder="Sort Pricing" v-model="filters.sort_pricing">
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>                            
                        </div>
                        <div class="col">
                            <label>Per Page</label>
                            <select class="form-control" placeholder="Per Page" v-model.number="filters.per_page">
                                <option value="10">10 Per Page</option>
                                <option value="25">25 Per Page</option>
                                <option value="50">50 Per Page</option>
                                <option value="100">100 Per Page</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>                                                      
</div>  
</template>
<script setup lang="ts">
import { isEmpty } from 'lodash';
import { computed, defineEmits, defineProps } from 'vue';
import VueToggles from "vue-toggles";
import VueSlider from "vue-3-slider-component";

const $props = defineProps({
    filters: {
        default: Object(),
        type:    Object
    },
    form: {
        default: Object(),
        type:    Object
    },
    brands: {
        default: Array(),
        type:    Array
    },
    child_sub_categories: {
        default: Array(),
        type:    Array
    }
});
const $emit = defineEmits(['update:filters','update:form']);

const child_sub_categories = computed(() => $props.child_sub_categories);
const brands               = computed(() => $props.brands);
const filters              = computed({
    get: ()      => $props.filters,
    set: (value) => $emit('update:filters', value)
});
const form                = computed({
    get: ()      => $props.form,
    set: (value) => $emit('update:form', value)
});
const slider_options       = computed(() => ({
    // tooltip:      "",
    processStyle: { backgroundColor: "#7e1414" },
    min: 1,
    max: 20000
}));
</script>