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
                <div class="col-xs-12 col-md-7">
                    <div class="row">
                        <div class="col-md-6 col-xs-12">
                            <div class="card o-hidden widget-cards">
                                <div class="warning-box card-body">
                                    <div class="media static-top-widget align-items-center">
                                        <div class="icons-widgets">
                                            <div class="align-self-center text-center">
                                                <i class="fa fa-users text-white fa-lg"></i>
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
                        <div class="col-md-6 col-xs-12">
                            <div class="card o-hidden widget-cards">
                                <div class="danger-box card-body">
                                    <div class="media static-top-widget align-items-center">
                                        <div class="icons-widgets">
                                            <div class="align-self-center text-center">
                                                <i class="fa fa-users-line text-white fa-lg"></i>
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
                        <div class="col-md-6 col-xs-12">
                            <div class="card o-hidden widget-cards">
                                <div class="secondary-box card-body">
                                    <div class="media static-top-widget align-items-center">
                                        <div class="icons-widgets">
                                            <div class="align-self-center text-center">
                                                <i class="fa fa-box text-white fa-lg"></i>                                
                                            </div>
                                        </div>
                                        <div class="media-body media-doller">
                                            <span class="m-0">Orders</span>
                                            <h3 class="mb-0">
                                                {{  $data.summary.orders }}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-xs-12">
                            <div class="card o-hidden widget-cards">
                                <div class="primary-box card-body">
                                    <div class="media static-top-widget align-items-center">
                                        <div class="icons-widgets">
                                            <div class="align-self-center text-center"> 
                                                <i class="fa fa-box text-white fa-lg"></i>
                                            </div>
                                        </div>
                                        <div class="media-body media-doller"><span class="m-0"></span>
                                            <span class="m-0">Pending Orders</span>
                                            <h3 class="mb-0">
                                                {{  $data.summary.pending_orders }}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12 col-md-5">
                    <div class="row">
                        <div class="col-12">
                            <div class="card o-hidden widget-cards">
                                <div class="success-box card-body">
                                    <div class="media static-top-widget align-items-center">
                                        <div class="icons-widgets">
                                            <div class="align-self-center text-center"> 
                                                <i class="fa fa-solid fa-money-bill-trend-up text-white fa-lg"></i>
                                            </div>
                                        </div>
                                        <div class="media-body media-doller"><span class="m-0"></span>
                                            <span class="m-0 text-success">Revenue Received</span>
                                            <h3 class="mb-0 text-success">
                                                {{ company.currency }} {{  $data.summary.revenue_received }}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>             
                        <div class="col-12">
                            <div class="card o-hidden widget-cards">
                                <div class="primary-box card-body">
                                    <div class="media static-top-widget align-items-center">
                                        <div class="icons-widgets">
                                            <div class="align-self-center text-center"> 
                                                <i class="fa fa-solid fa-money-bill text-white fa-lg"></i>
                                            </div>
                                        </div>
                                        <div class="media-body media-doller"><span class="m-0"></span>
                                            <span class="m-0">Revenue Pending</span>
                                            <h3 class="mb-0">
                                                {{ company.currency }} {{  $data.summary.revenue_pending}}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="card">
                    <div class="card-header">
                        <h5>Orders created for the past 12 months.</h5>
                        <div class="card-header-right">
                            <ul class="list-unstyled card-option">
                                <li><i class="icofont icofont-simple-left"></i></li>
                                <li><i class="view-html fa fa-code"></i></li>
                                <li><i class="icofont icofont-maximize full-card"></i></li>
                                <li><i class="icofont icofont-minus minimize-card"></i></li>
                                <li><i class="icofont icofont-refresh reload-card"></i></li>
                                <li><i class="icofont icofont-error close-card"></i></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body sell-graph">
                        <Bar :data="$ordersChart.config" :options="$ordersChart.options" />
                    </div>
                </div>
            </div>                
        </div>
    </div>
</template>

<script setup>
import { computed, inject, onBeforeMount, reactive, ref, watch } from 'vue';
import { cloneDeep, debounce } from 'lodash';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { useStore } from 'vuex';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const $api         = inject('$api');
const $data        = reactive({ summary: {} });
const $store       = useStore();
const $ordersChart = computed( 
    () => ({
        config: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Data One',
                    backgroundColor: '#f87979',
                    data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    })
);

const company = computed( () => $store.getters.home.company );

onBeforeMount( 
    debounce( 
        async () => {
            try {
                $store.commit('loader',true);
                let { data: { summary} } = await $api.get(`/dashboard/overview`);

                $data.summary = cloneDeep(summary);

                $store.commit('loader',false);

            } catch(error) {

            }
        },
        500
    ) 
)
</script>