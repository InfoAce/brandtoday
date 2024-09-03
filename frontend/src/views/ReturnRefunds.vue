<template>
    <div>
	<!-- breadcrumb start -->
	<div class="breadcrumb-section">
		<div class="container">
			<div class="row">
				<div class="col-sm-6">
					<div class="page-title">
						<h2>Return Refunds</h2>
					</div>
				</div>
				<div class="col-sm-6">
					<nav aria-label="breadcrumb" class="theme-breadcrumb">
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
							<li class="breadcrumb-item active">Return Refunds</li>
						</ol>
					</nav>
				</div>
			</div>
		</div>
	</div>
	<!-- breadcrumb End -->


	<!--section start-->
	<section class="login-page section-b-space">
		<div class="container">
			<div class="row">
				<div class="col-12">
                    <div v-html="$data.return_refunds"></div>
                </div>          
			</div>
		</div>
	</section>
	<!--Section ends-->
		
</div>	
</template>

<script setup>
import { inject, onBeforeMount, reactive, ref, watch } from 'vue';
import { clone, debounce, each, isEmpty, has } from 'lodash';

const $api  = inject('$api');
const $data = reactive({ return_refunds: String() });

onBeforeMount(
    debounce( async () => {
        try {
            let { data:{ return_refunds } } = await $api.get('website/return-refunds');

            $data.return_refunds = clone(return_refunds);

        } catch(error) {

            if( has(error,'response') ){

            }

        }
    },500) 
)
</script>