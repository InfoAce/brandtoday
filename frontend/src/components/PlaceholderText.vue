<template>
    <div class="row margin-res" >
        <div class="col-12 mt-3" >
            <div class="ssc">
                <div class="ssc-wrapper py-0 px-0" v-for="(i,index) in $props.count" :key="index">
                    <div class="ssc-line w-100 mbs"></div>
                    <div class="ssc-line w-80 mbs"></div>
                    <div class="ssc-line w-70 mbs"></div>
                    <div class="ssc-line w-0 mbs"></div>
                </div>
            </div>
        </div>  
    </div> 
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

/**
 * Define component properties
 * 
 * @param {Object}
 * @returns {Object}
 */
 const $props = defineProps({
    count:{
        default: () => Number(),
        type:    Number
    },
});

</script>