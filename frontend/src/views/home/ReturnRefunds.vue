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
				<div class="col-12" v-if="!$data.loader">
                    <div v-html="$data.return_refunds"></div>
                </div>
                <div class="ph-item" v-if="$data.loader">
                    <div class="ph-col-12">
                        <div class="ph-picture"></div>
                        <div class="ph-row">
                            <div class="ph-col-6 big"></div>
                            <div class="ph-col-4 empty big"></div>
                            <div class="ph-col-2 big"></div>
                            <div class="ph-col-4"></div>
                            <div class="ph-col-8 empty"></div>
                            <div class="ph-col-6"></div>
                            <div class="ph-col-6 empty"></div>
                            <div class="ph-col-12"></div>
                        </div>
                    </div>
                    <div class="ph-col-12">
                        <div class="ph-picture"></div>
                        <div class="ph-row">
                            <div class="ph-col-6 big"></div>
                            <div class="ph-col-4 empty big"></div>
                            <div class="ph-col-2 big"></div>
                            <div class="ph-col-4"></div>
                            <div class="ph-col-8 empty"></div>
                            <div class="ph-col-6"></div>
                            <div class="ph-col-6 empty"></div>
                            <div class="ph-col-12"></div>
                        </div>
                    </div>
                </div>                
			</div>
		</div>
	</section>
	<!--Section ends-->
		
</div>	
</template>

<script setup>
import { inject, onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { clone, debounce, each, isEmpty, has } from 'lodash';

const $api  = inject('$api');
const $data = reactive({ loader: Boolean(), return_refunds: String() });

onBeforeMount(() => $data.loader = Boolean(true) )

onMounted(
    debounce( async () => {
        try {
            let { data:{ return_refunds } } = await $api.get('website/return-refunds');

            $data.loader           = Boolean();
            $data.terms_conditions = clone(return_refunds);

        } catch(error) {

            if( has(error,'response') ){

            }

        }
    },500) 
)
</script>