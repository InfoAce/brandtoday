<template>
	<div>
		<LandingHeader />
		<router-view></router-view>
	</div>
</template>
<script lang="ts">
import { LandingHeader } from '../../components';
export default {
	beforeCreate(){
		[
			'/assets/js/jquery-3.3.1.min.js',
			'/assets/js/jquery-ui.min.js',
			'/assets/js/jquery.exitintent.js',
			'/assets/js/exit.js',
			'/assets/js/slick.js',
			'/assets/js/menu.js',
			'/assets/js/lazysizes.min.js',
			'/assets/js/bootstrap.bundle.min.js',
			'/assets/js/bootstrap-notify.min.js',
			'/assets/js/fly-cart.js',
			'/assets/js/theme-setting.js',
			'/assets/js/theme-setting.js',
			'/assets/js/script.js'
		].forEach( async(url) => {
			var script = document.createElement("script");  // create a script DOM node
			script.src = url;  // set its src to the provided URL	
			document.body.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
		})
	},
	components:{
		LandingHeader
	},
	methods:{
		dynamicallyLoadScript(url) {
			var script = document.createElement("script");  // create a script DOM node
			script.src = url;  // set its src to the provided URL
		
			document.body.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
		}
	}
}
</script>

<style>
@import url('~/assets/css/vendors/font-awesome.css');
@import url('~/assets/css/vendors/slick.css');
@import url('~/assets/css/vendors/slick-theme.css');
@import url('~/assets/css/vendors/animate.css');
@import url('~/assets/css/vendors/animate.css');
@import url('~/assets/css/vendors/themify-icons.css');
@import url('~/assets/css/style.css');
</style>