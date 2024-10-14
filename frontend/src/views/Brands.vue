<template>
    <div>
	<!-- breadcrumb start -->
	<div class="breadcrumb-section">
		<div class="container-fluid">
			<div class="row px-4">
				<div class="col-sm-6">
					<div class="page-title">
						<h4>Our Brands</h4>
					</div>
				</div>
				<div class="col-sm-6">
					<nav aria-label="breadcrumb" class="theme-breadcrumb">
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
							<li class="breadcrumb-item active">Our Brands</li>
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
                <template v-if="!$data.loader" >
                    <div class="col-lg-4 py-4"  v-for="(brand,index) in $data.brands" :key="index" >
                        <div class="product-box">
                            <div class="img-wrapper">
                                <img class="img-fluid blur-up lazyload bg-img" :src="brand.image" width="50%">
                            </div>
                        </div>
                    </div>
                </template>
                <PlaceholderLoader :count="15" v-if="$data.loader"/>
			</div>
		</div>
	</section>
	<!--Section ends-->
		
</div>	
</template>

<script setup>
import { inject, onBeforeMount, reactive } from 'vue';
import { clone } from 'lodash';
import { PlaceholderLoader } from '../components';

const $api = inject('$api');
const $data = reactive({ loader: Boolean(), brands: Array() });

onBeforeMount( 
    async () => {
        try {
            $data.loader         = Boolean(true);
            
            let { data:{ brands} } = await $api.get('website/brands');
            
            $data.loader         = Boolean();
            $data.brands         = clone(brands);

        } catch(error) {
            $data.loader         = Boolean();
        } finally {
            $data.loader         = Boolean();
        }
    }
)
</script>