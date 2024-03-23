<template>
	<div class="theme-color-1">
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
	'/assets/home/js/exit.js',
	'/assets/global/js/slick.js',
	'/assets/home/js/fly-cart.js',
	'/assets/home/js/menu.js',
	'/assets/home/js/lazysizes.min.js',
	'/assets/home/js/addtocart.js',
	'/assets/home/js/script.js'	
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
@import '~/assets/home/css/vendors/font-awesome.css';
@import '~/assets/home/css/vendors/slick.css';
@import '~/assets/home/css/vendors/slick-theme.css';
@import '~/assets/home/css/vendors/animate.css';
@import '~/assets/home/css/vendors/themify-icons.css';
@import '~/assets/home/css/style.css';

.product-right .color-variant li.active:after {
    background-image: url("data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'><path fill='white' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/></svg>");
	filter: drop-shadow(0px 3px 3px rgba(1, 1, 0, 1));
	/* right: 5px !important; */
	opacity: 1;
	top: 8px !important;
}

.product-right .color-variant li.inactive {
    position: relative;
}

.product-right .color-variant li.inactive {
	pointer-events: none;
}

.product-right .color-variant li.inactive:after {
	content: '\d7';
	filter: drop-shadow(0px 3px 3px rgba(1, 1, 0, 1));
    right: 2px;
	top: 3px !important;
    height: 15px;
    width: 15px;
    background-size: 70%;
    background-repeat: no-repeat;
    position: absolute;
    opacity: 1;
	color: #fff;
}

.product-right .color-variant li {
	border: 2px solid #ababab;
}

</style>