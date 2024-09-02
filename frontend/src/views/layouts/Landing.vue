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
import { onBeforeMount, onMounted, watch } from 'vue';
import { debounce, isEmpty } from 'lodash';

const store   = useStore();

const app_shopping_cart: any  = localStorage.getItem(`${store.getters.env.VITE_APP_NAME.replaceAll(' ','')}_SHOPPING_CART`);

if( !isEmpty(app_shopping_cart) ){
	store.commit('cart',JSON.parse(app_shopping_cart));
}

window.addEventListener("resize", debounce((event) => {
	store.commit('device_width',window.innerWidth)
},200));

watch( 
	() => store.getters.cart,
	(value) => {
		if( isEmpty(value) ){
			localStorage.removeItem(`${store.getters.env.VITE_APP_NAME.replaceAll(' ','')}_SHOPPING_CART`);
		}

		if( !isEmpty(value) ){
			localStorage.setItem(`${store.getters.env.VITE_APP_NAME.replaceAll(' ','')}_SHOPPING_CART`, JSON.stringify(value) );
		}
	},
	{
		deep: true
	}
)


</script>

<style>
.product-right .color-variant li.active:after {
    background-image: url("data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'><path fill='white' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/></svg>");
	/* filter: drop-shadow(0px 3px 3px rgba(1, 1, 0, 1)); */
	/* right: 5px !important; */
	opacity: 1;
	top: 8px !important;
	filter: invert(100%);
    -webkit-filter: invert(100%);
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
.top-header, footer {
	background-color: #7e1414 !important;
	color: #fff !important;
}
* {
	--theme-color: #7e1414 !important
}
.footer-contant > ul > li > a, 
.footer-title > h4, 
.footer-contant > .contact-list > li,
.header-contact > ul > li,
.header-contact > ul > li > i,
.header-dropdown > li,
.header-dropdown > li > a, 
.header-dropdown > li > div > a > i, 
.header-dropdown > li > a > i {
	color: #fff !important;
}

.text-theme {
	color: #7e1414 !important;
}
</style>../src/components