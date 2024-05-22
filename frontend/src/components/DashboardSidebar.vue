<template>
<!-- Page Sidebar Start-->
<div class="page-sidebar">
	<div class="main-header-left d-none d-lg-block">
		<div class="logo-wrapper">
			<a href="#" @click.prevent="$router.push({ name: 'Overview' })">
				<img v-if="isNull(authUser.company.logo)" class="d-none d-lg-block blur-up lazyloaded" src="/assets/dashboard/images/dashboard/multikart-logo.png" :alt="`${authUser.company.name}`">
				<img v-else class="d-none d-lg-block blur-up lazyloaded w-100" :src="`${backendUri}${authUser.company.logo}`"  :alt="`${authUser.company.name}`">
			</a>
		</div>
	</div>
	<div class="sidebar custom-scrollbar">
		<a href="javascript:void(0)" class="sidebar-back d-lg-none d-block"><i class="fa fa-times" aria-hidden="true"></i></a>
		<div class="sidebar-user">
			<img v-if="isNull(authUser.company.logo)" class="img-60" src="/assets/dashboard/images/dashboard/user3.jpg" alt="#">
			<img v-else class="img-60" :src="`${backendUri}${authUser.image}`"  :alt="`${authUser.first_name} ${authUser.last_name}`" >
			<div>
				<h6 class="f-14">{{ authUser.first_name }} {{ authUser.last_name }}</h6>
				<p>{{ authUser.role.name }}</p>
			</div>
		</div>
		<ul class="sidebar-menu">
			<template v-for="(menu,index) in menus" :key="index">
				<li>
					<template v-if="$has(menu,'children')">
						<a class="sidebar-title" href="#">
							<span>{{ menu.name }}</span>
						</a>
					</template>
					<template v-if="!$has(menu,'children')">
						<a class="sidebar-header" :data-route-name="menu.to" href="#" @click.prevent="$router.push({ name: menu.to })">
							<i :data-feather="menu.icon"></i>
							<span>{{ menu.name }}</span>
						</a>
					</template>
				</li>
				<template v-if="$has(menu,'children')">
					<li class="sidebar-item" v-for="(child,child_index) in menu.children" :key="child_index">						
						<a class="sidebar-header" href="#" @click.prevent="$router.push({ name: child.to })" :data-route-name="child.to">
							<i :data-feather="child.icon"></i>
							<span>{{ child.name }}</span>
						</a>
					</li>					
				</template>
			</template>
		</ul>
	</div>
</div>
<!-- Page Sidebar Ends-->	
</template>
<script setup lang="ts">
import { computed, onMounted, onBeforeMount, watch} from 'vue';
import { debounce, has, isNull } from 'lodash';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

const $route  = useRoute();
const $router = useRouter();
const $store  = useStore();
const menus   = computed( () => $store.getters.sidebarMenus );
const $has    = has;

// Computed 
const authUser   = computed( () => $store.getters.authUser );
const backendUri = computed( () => $store.getters.env.VITE_API_BASE_URL.replace('api/v1','') );

onMounted(
	debounce(() => {
		window?.feather.replace();
		$(`a[data-route-name="${$route.name}"]`).addClass('active');
	},500)
);

onBeforeMount( () =>{ 

  const scripts = [
    '/assets/dashboard/js/feather.min.js',
	'/assets/dashboard/js/sidebar-menu.js'
  ].map( 
    async (url) => new Promise( 
      resolve => setTimeout( async() => resolve(addScript(url)),0)
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

// Watch Routes
watch( 
	() => $route.name,
	(name) => {
		$('a[class="sidebar-header active"]').removeClass('active');
		$(`a[data-route-name="${name}"]`).addClass('active');
	}
)
</script>
<style>
.sidebar-header.active {
	margin-bottom: 0px !important;
}
.sidebar-item a {
	padding-left: 30px !important;
}
.sidebar-title {
	background-color: #ff4c3b !important;
	font-size: 14px !important;
    letter-spacing: .5px !important;
    padding-bottom: 12px !important;
    padding-top: 12px !important;
    text-transform: capitalize !important;
    font-weight: 500 !important;
    color: #fff !important;
    padding: 15px 18px !important;
}

.sidebar-title::hover {
	background-color: #ff4c3b !important;
	border-radius: 0px !important;
}
</style>