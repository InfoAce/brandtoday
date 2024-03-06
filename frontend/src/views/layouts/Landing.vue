<template>
	<div>
		<LandingLoader />
		<LandingHeader />
		<router-view></router-view>
		<LandingFooter />
	</div>
</template>
<script lang="ts">
import { LandingFooter, LandingHeader, LandingLoader } from '../../components';
import { loadScript } from "vue-plugin-load-script";
export default {
	created() {
		[
			'/assets/js/jquery.exitintent.js',
			'/assets/js/bootstrap.bundle.min.js',
			'/assets/js/bootstrap-notify.min.js',	
			'/assets/js/exit.js',
			'/assets/js/slick.js',
			'/assets/js/menu.js',
			'/assets/js/lazysizes.min.js',
			'/assets/js/fly-cart.js',
			'/assets/js/theme-setting.js',
			'/assets/js/theme-setting.js',
			'/assets/js/script.js'	
		].forEach( async(url) => {
			await loadScript(url);
		}) 
	},
	components:{
		LandingFooter,
		LandingHeader,
		LandingLoader
	},
}
</script>