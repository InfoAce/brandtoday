<template>
<!-- Page Sidebar Start-->
<div class="page-sidebar">
	<div class="main-header-left d-none d-lg-block">
		<div class="logo-wrapper">
			<a href="index.html">
				<img class="d-none d-lg-block blur-up lazyloaded" src="/assets/dashboard/images/dashboard/multikart-logo.png" alt="">
			</a>
		</div>
	</div>
	<div class="sidebar custom-scrollbar">
		<a href="javascript:void(0)" class="sidebar-back d-lg-none d-block"><i class="fa fa-times"
				aria-hidden="true"></i></a>
		<div class="sidebar-user">
			<img class="img-60" src="/assets/dashboard/images/dashboard/user3.jpg" alt="#">
			<div>
				<h6 class="f-14">JOHN</h6>
				<p>general manager.</p>
			</div>
		</div>
		<ul class="sidebar-menu">
			<template v-for="(menu,index) in menus" :key="index">
				<li>
					<template v-if="$has(menu,'children')">
						<a class="sidebar-header" href="#">
							<i :data-feather="menu.icon"></i>
							<span>{{ menu.name }}</span>
							<i class="fa fa-angle-right pull-right"></i>
						</a>
					</template>
					<template v-if="!$has(menu,'children')">
						<a class="sidebar-header" href="#" @click.prevent="router.push({ name: menu.to })">
							<i :data-feather="menu.icon"></i>
							<span>{{ menu.name }}</span>
						</a>
					</template>
					<ul class="sidebar-submenu menu-open" v-if="$has(menu,'children')">
						<li v-for="(child,child_index) in menu.children" :key="child_index">
							<a href="#" @click.prevent="router.push({ name: child.to })">
								<i :class="child.icon"></i>
								<span>{{ child.name }}</span>
							</a>
						</li>
					</ul>
				</li>
			</template>
		</ul>
	</div>
</div>
<!-- Page Sidebar Ends-->	
</template>
<script setup lang="ts">
import { computed, onMounted, onBeforeMount } from 'vue';
import { debounce, has } from 'lodash';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const router = useRouter();
const store  = useStore();
const menus  = computed( () => store.getters.sidebarMenus );
const $has   = has;

onMounted(
	debounce(() => {
		window?.feather.replace();
	},500)
);

onBeforeMount( () =>{ 

  const scripts = [
    '/assets/dashboard/js/feather.min.js',
	'/assets/dashboard/js/sidebar-menu.js'
  ].map( 
    async (url) => new Promise( 
      resolve => setTimeout( async() => resolve(addScript(url)),10)
    ) 
  );
  
  const addScript = (url:string) => {
    let script    = document.createElement('script');
    script.type   = 'text/javascript';
    script.src    = url;
    document.body.appendChild(script);
  }

  Promise.all(scripts);

});
</script>