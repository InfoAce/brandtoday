<template>
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

</script>