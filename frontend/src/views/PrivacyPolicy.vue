<template>
    <div>
	<!-- breadcrumb start -->
	<div class="breadcrumb-section">
		<div class="container-fluid">
			<div class="row px-4">
				<div class="col-sm-6">
					<div class="page-title">
						<h4>Privacy Policy</h4>
					</div>
				</div>
				<div class="col-sm-6">
					<nav aria-label="breadcrumb" class="theme-breadcrumb">
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
							<li class="breadcrumb-item active">Privacy Policy</li>
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
                    <div v-html="$data.privacy_policy"></div>
                </div>
                <PlaceholderText :count="20" v-if="$data.loader"/>
			</div>
		</div>
	</section>
	<!--Section ends-->
		
</div>	
</template>

<script setup>
import { inject, onBeforeMount, reactive } from 'vue';
import { clone } from 'lodash';
import { PlaceholderText } from '../components';

const $api = inject('$api');
const $data = reactive({ loader: Boolean(true), privacy_policy: String() });

onBeforeMount( 
    async () => {
        try {
            $data.loader         = Boolean(true);
            
            let { data:{ privacy_policy} } = await $api.get('website/privacy-policy');
            
            $data.loader         = Boolean();
            $data.privacy_policy = clone(privacy_policy);

        } catch(error) {
            $data.loader         = Boolean();
        } finally {
            $data.loader         = Boolean();
        }
    }
)
</script>