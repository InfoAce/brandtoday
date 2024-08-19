<template>
    <div class="row margin-res p-2" >
        <div class="col-xl-3 col-6 col-grid-box mt-4" v-for="(i,index) in $props.count" :key="index">
            <div class="ssc ssc-card">
                <div class="ssc-wrapper">
                    <div class="ssc-square mb"></div>
                    <div class="flex align-center justify-between">
                        <div class="w-40">
                            <div class="ssc-line w-70 mbs"></div>
                            <div class="ssc-line w-100 mbs"></div>
                        </div>
                        <div class="ssc-head-line w-50"></div>
                    </div>
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