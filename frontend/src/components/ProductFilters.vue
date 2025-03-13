<template>
    <div class="card vh-100">
        <div class="card-body px-0" style="overflow-y: scroll;">
            <div class="row product-right px-3">
                <div class="col-12 mb-2">
                    <p class="badge badge-primary" v-if="!isEmpty(filters.colours)">
                        <span> 
                            <a href="#" @click="filters.colours.splice(0)" class="text-white">
                                <i class="fa fa-times-circle" ></i>
                            </a>
                            Colours: {{ selected_colours.join(', ') }}
                        </span>
                    </p>
                </div>
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
                            :tooltip="slider_options.tooltip"
                        />
                    </div>
                </div>
                <div class="col-12">
                    <label>Colours</label>
                    <ul class="color-variant p-0 m-0">
                        <template v-for="(colour,index) in colours" :key="`colour_${index}`">
                            <li   
                                v-if="filters.colours.includes(colour.code)"    
                                class="text-center m-1"           
                                :data-code="colour.code"      
                                :data-tick="colour.tickColour"                   
                                :ref="`colour_hex_${index}`"                     
                                :style="`color: ${colour.tickColour}; background: ${ colour.hexValue.length > 1 ? `linear-gradient(to right, ${colour.hexValue.map( (hex: any) => `${hex} ${100/colour.hexValue.length}%` ).join(',')} )`: colour.hexValue.map( (hex: any) => `${hex}` ).join(',') }`"                       
                                @click="($event) => selectColour(colour,$event)"                        
                            ><i class="fa fa-check"></i></li>
                            <li    
                                v-if="!filters.colours.includes(colour.code)"    
                                class="m-1"                                           
                                :style="`background: ${ colour.hexValue.length > 1 ? `linear-gradient(to right, ${colour.hexValue.map( (hex: any) => `${hex} ${100/colour.hexValue.length}%` ).join(',')} )`: colour.hexValue.map( (hex: any) => `${hex}` ).join(',') }`"                                     
                                :ref="`colour_hex_${index}`"
                                @click="($event) => selectColour(colour,$event)"                        
                            ></li>
                        </template>
                    </ul>
                </div>
            </div>
        </div>
    </div>                                                      
</template>
<script setup lang="ts">
import { computed, defineEmits, defineProps } from 'vue';
import VueToggles from "vue-toggles";
import VueSlider from "vue-3-slider-component";
import { isEmpty } from 'lodash';

const $props: any = defineProps({
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
    },
    colours: {
        default: Array(),
        type:    Array
    },
});
const $emit = defineEmits(['update:filters','update:form']);

const filters: any         = computed({
    get: ()      => $props.filters,
    set: (value) => $emit('update:filters', value)
});
const form                = computed({
    get: ()      => $props.form,
    set: (value) => $emit('update:form', value)
});
const colours: any          = computed(() => $props.colours);
const selected_colours: any = computed(
    () => filters.value.colours.map( 
        (code: any) => colours.value.find( (value: any) => value.code == code ) 
    ).map( (colour: any) => colour.name )
);
const slider_options        = computed(() => ({
    tooltip:      "always",
    processStyle: { backgroundColor: "#7e1414" },
    min: 1,
    max: 20000
}));

const selectColour = (colour:any ) => {
    filters.value.colours.push(colour.code);
}
</script>