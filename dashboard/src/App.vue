<template>
  <div class="page-wrapper">
    <DashboardHeader />
    <!-- Page Body Start-->
    <div class="page-body-wrapper">
      <DashboardSidebar />
      <div class="page-body">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DashboardLoader, DashboardHeader, DashboardSidebar } from './components';
import { useStore } from 'vuex'
import { computed, watch } from 'vue';
import { isEmpty } from 'lodash';
import { useRouter } from 'vue-router';

const $store  = useStore();
const $router = useRouter();

const auth    = computed( () => $store.getters.auth );

watch( 
  () => $store.getters.auth,
  (auth) => {
    if( isEmpty(auth) ){
      $router.push({ name: 'AdminLogin'});
    }
  },
  {
    deep: true
  }
)

</script>