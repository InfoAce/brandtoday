<template>
	<div>
		<LandingLoader />
		<LandingHeader />
		<router-view></router-view>
		<LandingFooter />
	</div>
</template>

<script setup lang="ts">
import { LandingFooter, LandingHeader, LandingLoader } from '../../components';
import { useStore } from 'vuex'
import { watch } from 'vue';
import { isEmpty } from 'lodash';

const store   = useStore();

const scripts = [
	'/assets/js/exit.js',
	'/assets/js/slick.js',
	'/assets/js/fly-cart.js',
	'/assets/js/menu.js',
	'/assets/js/lazysizes.min.js',
	'/assets/js/script.js'	
].map( 
	async (url) => new Promise( 
		resolve => setTimeout( async() => resolve(addScript(url)),100)
	) 
)

const addScript = (url:string) => {
    let script  = document.createElement('script');
    script.type = 'text/javascript';
    script.src  = url;
    document.body.appendChild(script);
}

const app_shopping_cart: any  = localStorage.getItem(`${store.getters.env.VITE_APP_NAME.replaceAll(' ','')}_SHOPPING_CART`);

if( !isEmpty(app_shopping_cart) ){
	store.commit('cart',JSON.parse(app_shopping_cart));
}

Promise.all(scripts);

watch( 
	() => store.getters.cart,
	(value) => {
		localStorage.setItem(`${store.getters.env.VITE_APP_NAME.replaceAll(' ','')}_SHOPPING_CART`, JSON.stringify(value) );
	},
	{
		deep: true
	}
)

</script>

<style>
@import '~/assets/css/vendors/font-awesome.css';
@import '~/assets/css/vendors/slick.css';
@import '~/assets/css/vendors/slick-theme.css';
@import '~/assets/css/vendors/animate.css';
@import '~/assets/css/vendors/themify-icons.css';
@import '~/assets/css/style.css';

.product-right .color-variant li.active:after {
    background-image: url("data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'><path fill='white' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/></svg>");
	filter: drop-shadow(0px 3px 3px rgba(1, 1, 0, 1));
	/* right: 5px !important; */
	opacity: 1;
	top: 8px !important;
}

/* .product-right .color-variant li.active {
	border: 2px solid #000;
} */

.product-right .color-variant li {
	border: 2px solid #ababab;
}

</style>