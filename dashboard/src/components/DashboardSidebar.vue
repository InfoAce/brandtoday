<template>
<!-- Page Sidebar Start-->
<div class="page-sidebar">
	<div class="main-header-left d-none d-lg-block">
		<div class="logo-wrapper m-2 p-0">
			<a href="#" @click.prevent="$router.push({ name: 'Overview' })">
				<i data-feather="bar-chart" v-if="!isEmpty($data.company) && isNull($data.company.logo)"></i>
				<img v-if="!isEmpty($data.company) && !isNull($data.company.logo)" class="d-none d-lg-block blur-up lazyloaded w-100" :src="`${$store.getters.assetsUrl}${$data.company.logo}`"  :alt="`${$data.company.name}`">
			</a>
		</div>
	</div>
	<div class="sidebar custom-scrollbar">
		<a href="javascript:void(0)" class="sidebar-back d-lg-none d-block"><i class="fa fa-times" aria-hidden="true"></i></a>
		<!-- <div class="sidebar-user">
			<i data-feather="bar-chart" v-if="!isEmpty($data.company) && isNull($data.company.logo)"></i>
			<img v-if="!isEmpty(authUser) && !isNull($data.company.logo)" class="img-60" :src="`${backendUri}${auth.user.image}`"  :alt="`${auth.user.first_name} ${auth.user.last_name}`" >
			<div v-if="!isEmpty(authUser) ">
				<h6 class="f-14">{{ auth.user.first_name }} {{ auth.user.last_name }}</h6>
				<p>{{ auth.user.role.name }}</p>
			</div>
		</div> -->
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
							<span :class="`${menu.icon} m-2`"></span>
							<span>{{ menu.name }}</span>
						</a>
					</template>
				</li>
				<template v-if="$has(menu,'children')">
					<li class="sidebar-item" v-for="(child,child_index) in menu.children" :key="child_index">						
						<a class="sidebar-header" href="#" @click.prevent="$router.push({ name: child.to })" :data-route-name="child.to">
							<span :class="`${child.icon} m-2`"></span>
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
import { computed, inject, onMounted, onBeforeMount, reactive, watch} from 'vue';
import { cloneDeep, debounce, has, get, isNull, isEmpty } from 'lodash';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

const $api    = inject('$api');
const $toast  = inject('$toast');
const $route  = useRoute();
const $router = useRouter();
const $store  = useStore();
const menus   = computed( () => $store.getters.sidebarMenus );
const $has    = has;
const $data   = reactive({
	company: Object()
});

// Computed 
const auth       = computed( () => $store.getters.auth );
const backendUri = computed( () => get($store.getters.env,'VITE_API_URL').replace('api/v1','') );
const addIcon    = (icon) => {
	document.querySelector('link[rel="icon"]')?.setAttribute('type','image/x-icon');
	document.querySelector('link[rel="icon"]')?.setAttribute('href',icon);
}
onMounted(
	debounce( async() => {
		// window?.feather.replace();
		$(`a[data-route-name="${$route.name}"]`).addClass('active');	
		try {
            let { data:{ company } } = await $api.get('dashboard/sidebar');
			$data.company = cloneDeep(company);
			addIcon(company.icon);
        } catch(error) {
			$toast.error('Oops!! Something went wrong while fetching company information.')
        }
	},500)
);

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