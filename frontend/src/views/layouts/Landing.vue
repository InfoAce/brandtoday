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

watch( 
	() => store.getters.cart,
	(value) => {
		localStorage.setItem(`${store.getters.env.VITE_APP_NAME.replaceAll(' ','')}_SHOPPING_CART`, JSON.stringify(value) );
	},
	{
		deep: true
	}
)

onMounted( 
	debounce(
		() => {
			$(function() {
				$.exitIntent('enable');
				$(document).bind('exitintent', function() {
					if(typeof(Storage) !== "undefined") {
						if(sessionStorage.exit_popup == 'true'){
						}
						else{
							sessionStorage.exit_popup = 'true';
							setTimeout(function () {
								if( $.cookie("exit-popup") == 'hide_exit_popup' ){
								}
								else{
									$("#exit_popup").modal('show');
								}
							}, 100);
						}
					}
				});
				$("#exit_popup a").bind('click', function() {
					$("#exit_popup").hide();
					return false;
				});
			});
		},
		0
	)
)

</script>

<style>
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