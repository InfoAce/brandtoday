<template>
    <div class="card h-100">
        <div class="card-body px-0">
            <div class="row product-right px-3">
                <div class="col-12 mb-2">
                    <label>Search Name</label>
                    <input class="form-control" v-model="filters.name" placeholder="Search Name"/>
                </div>
                <div class="col-12 mb-2">
                    <label class="mr-2">Clearance Items</label>
                    <VueToggles v-model="filters.clearance" checkedText="Yes" uncheckedText="No" checkedBg="#7e1414" />
                </div>
                <div class="col-12 mb-2">
                    <label>Sort Pricing</label>
                    <select class="form-control" placeholder="Sort Pricing" v-model="filters.sort_pricing">
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>                            
                </div>
                <div class="col-12 mb-2">
                    <label>Per Page</label>
                    <select class="form-control" placeholder="Per Page" v-model.number="filters.per_page">
                        <option value="10">10 Per Page</option>
                        <option value="25">25 Per Page</option>
                        <option value="50">50 Per Page</option>
                        <option value="100">100 Per Page</option>
                    </select>
                </div>
                <div class="col-12">
                    <label>Price Range</label>
                    <div class="col-12 px-2">
                        <VueSlider 
                            v-model="form.price" 
                            :min="slider_options.min" 
                            :max="slider_options.max" 
                            :processStyle="slider_options.processStyle"
                        />
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