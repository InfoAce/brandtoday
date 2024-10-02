<template>
    <div class="card-overlay" v-show="$store.getters.loaders.card || $props.loader">
        <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
</template>
<script setup>
import { defineProps } from 'vue';
import { useStore } from 'vuex';
const $store = useStore();

const $props = defineProps({
  loader:{
    type: Boolean,
    default: false
  }
})

</script>