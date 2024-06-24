<template>
  <div>
    <template v-if="!$isEmpty(auth)">
      <div class="page-wrapper">
        <DashboardHeader />
        <!-- Page Body Start-->
        <div class="page-body-wrapper">
          <DashboardSidebar />
          <div class="page-body px-0">
            <router-view />
          </div>
        </div>
      </div>
    </template>
    <template v-if="$isEmpty(auth)">
      <router-view />
    </template>
  </div>
</template>
<style>
  body{
    background: #ededed;
  }
  .page-body {
    background: #ededed !important;
  }
</style>
<script setup lang="ts">
import { DashboardLoader, DashboardHeader, DashboardSidebar } from '../../components';
import { useStore } from 'vuex'
import { computed } from 'vue';
import { isEmpty } from 'lodash';

const $isEmpty = isEmpty;
const store   = useStore();

const auth = computed( () => store.getters.auth );

// const scripts = [
//   // '/assets/dashboard/js/sidebar-menu.js',
//   '/assets/dashboard/js/lazysizes.min.js',
//   '/assets/dashboard/js/admin-customizer.js',
//   '/assets/dashboard/js/default.js',
//   '/assets/dashboard/js/admin-script.js'	
// ].map( 
//   async (url) => new Promise( 
//     resolve => setTimeout( async() => resolve(addScript(url)),100)
//   ) 
// );
</script>