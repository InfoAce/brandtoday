<template>
    <div class="page-body">
        <!-- Container-fluid starts-->
        <div class="container-fluid">
            <div class="page-header">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="page-header-left">
                            <h3> Overview <small>Summary report of registered clients, orders, registered staff, messages and transactions</small></h3>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <ol class="breadcrumb pull-right">
                            <li class="breadcrumb-item">
                                <a href="index.html">
                                    <i data-feather="home"></i>
                                </a>
                            </li>
                            <li class="breadcrumb-item active">Overview</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
        <!-- Container-fluid Ends-->

        <!-- Container-fluid starts-->
        <div class="container-fluid">
            <div class="row">
                <div class="col-xxl-3 col-md-6 xl-50">
                    <div class="card o-hidden widget-cards">
                        <div class="warning-box card-body">
                            <div class="media static-top-widget align-items-center">
                                <div class="icons-widgets">
                                    <div class="align-self-center text-center">
                                        <i data-feather="users" class="font-warning"></i>
                                    </div>
                                </div>
                                <div class="media-body media-doller">
                                    <span class="m-0">Clients</span>
                                    <h3 class="mb-0">{{ $data.summary.clients }}</h3>                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xxl-3 col-md-6 xl-50">
                    <div class="card o-hidden widget-cards">
                        <div class="warning-box card-body">
                            <div class="media static-top-widget align-items-center">
                                <div class="icons-widgets">
                                    <div class="align-self-center text-center">
                                        <i data-feather="users" class="font-warning"></i>
                                    </div>
                                </div>
                                <div class="media-body media-doller">
                                    <span class="m-0">Staff</span>
                                    <h3 class="mb-0">{{ $data.summary.staff }}</h3>                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xxl-3 col-md-6 xl-50">
                    <div class="card o-hidden widget-cards">
                        <div class="secondary-box card-body">
                            <div class="media static-top-widget align-items-center">
                                <div class="icons-widgets">
                                    <div class="align-self-center text-center">
                                        <i data-feather="box" class="font-secondary"></i>
                                    </div>
                                </div>
                                <div class="media-body media-doller">
                                    <span class="m-0">Products</span>
                                    <h3 class="mb-0">$ <span class="counter">9856</span><small> This
                                            Month</small>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xxl-3 col-md-6 xl-50">
                    <div class="card o-hidden widget-cards">
                        <div class="primary-box card-body">
                            <div class="media static-top-widget align-items-center">
                                <div class="icons-widgets">
                                    <div class="align-self-center text-center"><i data-feather="message-square"
                                            class="font-primary"></i></div>
                                </div>
                                <div class="media-body media-doller"><span class="m-0">Messages</span>
                                    <h3 class="mb-0">$ <span class="counter">893</span><small> This
                                            Month</small></h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xxl-3 col-md-6 xl-50">
                    <div class="card o-hidden widget-cards">
                        <div class="danger-box card-body">
                            <div class="media static-top-widget align-items-center">
                                <div class="icons-widgets">
                                    <div class="align-self-center text-center"><i data-feather="users"
                                            class="font-danger"></i></div>
                                </div>
                                <div class="media-body media-doller"><span class="m-0">New Vendors</span>
                                    <h3 class="mb-0">$ <span class="counter">5631</span><small> This
                                            Month</small></h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Container-fluid Ends-->
    </div>
</template>

<script setup>
import { inject, onBeforeMount, reactive, ref, watch } from 'vue';
import { cloneDeep, debounce } from 'lodash';

const $api  = inject('$api');
const $data = reactive({
    summary: {}
});

onBeforeMount( 
    debounce( 
        async () => {
            try {

                let { data: { summary} } = await $api.get(`/dashboard/overview`);

                $data.summary = cloneDeep(summary);

            } catch(error) {

            }
        },
        500
    ) 
)
</script>