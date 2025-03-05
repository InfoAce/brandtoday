<template>
<div class="col-12 px-0 mb-4 position-sticky">
    <div class="row mt-2">
        <div class="col">
            <div class="collapse multi-collapse" id="filterDropdown">
                <div class="card card-body">
                    <div class="row">
                        <div class="col-12">
                            <h3>Brands</h3>
                            <div class="d-flex flex-wrap">
                                <template v-for="(brand,index) in brands" :key="`${brand.id}_${index}`">
                                    <div class="form-group text-nowrap mb-0 mr-3">
                                        <input type="checkbox" :name="brand.id" :value="brand.code" v-model="form.brands" />
                                        {{ brand.name }}
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div class="col-12 mt-4">
                            <h3>Product Categories</h3>
                            <div class="d-flex flex-wrap">
                                <template v-for="(category,index) in child_sub_categories" :key="`${category.id}_${index}`">
                                    <div class="form-group text-nowrap mb-0 mr-3">
                                        <input type="checkbox" :name="category.id" :value="category.code" v-model="form.child_sub_categories" />
                                        {{ category.name }}
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div class="col-12 mt-4">
                            <h3>Price Range</h3>
                            <VueSlider 
                                v-model="form.price" 
                                :min="slider_options.min" 
                                :max="slider_options.max" 
                                :processStyle="slider_options.processStyle"
                                :tooltip="slider_options.tooltip"
                            />
                        </div>
                        <div class="col-md-12 d-flex justify-content-between mt-2">
                            <button class="btn btn-solid btn-sm" data-toggle="collapse" data-target="#filterDropdown" aria-expanded="false" aria-controls="filterDropdown" @click="fetchProducts(false)">Apply</button>
                            <button class="btn btn-solid btn-sm mx-2" data-toggle="collapse" data-target="#filterDropdown" aria-expanded="false" aria-controls="filterDropdown" @click="clearFilters">Clear Filter</button>
                            <button class="btn btn-solid btn-sm" data-toggle="collapse" data-target="#filterDropdown" aria-expanded="false" aria-controls="filterDropdown">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
    <div class="card">
        <div class="card-body">
            <div class="row">
                <div class="col col-xs-12">
                    <label>Search Name</label>
                    <input class="form-control" v-model="filters.name" placeholder="Search Name"/>
                </div>
                <div class="col col-xs-12 d-flex flex-column">
                    <label>View Filters</label>
                    <a arial-caret="true" data-toggle="collapse" data-target="#filterDropdown" aria-expanded="false" aria-controls="filterDropdown" class="form-control d-flex justify-content-between w-100">
                        <span>Filter</span>
                        <i class="fa fa-chevron-down"></i>
                    </a>
                </div>
                <div class="col col-xs-12">
                    <label>Sort Pricing</label>
                    <select class="form-control" placeholder="Sort Pricing" v-model="filters.sort_pricing">
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <div class="col col-xs-12">
                    <label>Per Page</label>
                    <select class="form-control" placeholder="Per Page" v-model.number="filters.per_page">
                        <option value="10">10 Per Page</option>
                        <option value="25">25 Per Page</option>
                        <option value="50">50 Per Page</option>
                        <option value="100">100 Per Page</option>
                    </select>
                </div>
                <div class="col-12 mt-4">
                    <h4>
                        Brand Filter:
                        <span class="badge badge-primary mx-2" v-if="!isEmpty(brands)">{{ brands.join(', ') }}</span>
                        <span class="badge badge-primary mx-2" v-if="isEmpty(brands)">No Filters</span>
                    </h4>
                    <!-- <h4>
                        Category Filter:
                        <span class="badge badge-primary mx-2" v-if="!isEmpty(filter_child_sub_categories)">{{ filter_child_sub_categories.join(', ') }}</span>
                        <span class="badge badge-primary mx-2" v-if="isEmpty(filter_child_sub_categories)">No Filters</span>
                    </h4> -->
                    <h4 class="d-flex flex-wrap">
                        <span class="mr-2">Clearance Filter:</span>
                        <VueToggles v-model="filters.clearance" checkedText="Yes" uncheckedText="No" checkedBg="#7e1414" />
                    </h4>
                </div>
            </div>
        </div>
    </div>                                                      
</div>  
</template>
<script setup lang="ts">
import { isEmpty } from 'lodash';
import { computed } from 'vue';

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

const child_sub_categories = computed(() => $props.child_sub_categories);
const brands               = computed(() => $props.brands);
const filter               = computed(() => $props.filters);
const form                 = computed(() => $props.form);
const slider_options       = computed(() => ({
    tooltip:      "always",
    processStyle: { backgroundColor: "#7e1414" },
    min: 1,
    max: 20000
}));
</script>