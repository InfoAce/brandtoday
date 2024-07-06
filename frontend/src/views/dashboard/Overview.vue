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
                        <div class="danger-box card-body">
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
                                    <span class="m-0">Orders</span>
                                    <h3 class="mb-0">
                                        {{  $data.summary.orders }}
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
                <div class="col-xl-3 col-md-6 xl-50">
                    <div class="card order-graph sales-carousel">
                        <div class="card-header b-header">
                            <h6>Total Sales</h6>
                            <div class="row">
                                <div class="col-6">
                                    <div class="small-chartjs">
                                        <div class="flot-chart-placeholder" id="simple-line-chart-sparkline-3">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="value-graph">
                                        <h3>42% <span><i class="fa fa-angle-up font-primary"></i></span></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="media">
                                <div class="media-body">
                                    <span>Sales Last Month</span>
                                    <h2 class="mb-0">9054</h2>
                                    <p>0.25% <span><i class="fa fa-angle-up"></i></span></p>
                                </div>

                                <div class="bg-primary b-r-8">
                                    <div class="small-box">
                                        <i data-feather="briefcase"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="sales-contain">
                                <h5 class="f-w-600">Gross sales of August</h5>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6 xl-50">
                    <div class="card order-graph sales-carousel">
                        <div class="card-header b-header">
                            <h6>Total purchase</h6>
                            <div class="row">
                                <div class="col-6">
                                    <div class="small-chartjs">
                                        <div class="flot-chart-placeholder" id="simple-line-chart-sparkline">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="value-graph">
                                        <h3>20% <span><i class="fa fa-angle-up font-secondary"></i></span></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="media">
                                <div class="media-body">
                                    <span>Monthly purchase</span>
                                    <h2 class="mb-0">2154</h2>
                                    <p>0.13% <span><i class="fa fa-angle-up"></i></span></p>
                                </div>
                                <div class="bg-secondary b-r-8">
                                    <div class="small-box">
                                        <i data-feather="credit-card"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="sales-contain">
                                <h5 class="f-w-600">Avg Gross purchase</h5>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6 xl-50">
                    <div class="card order-graph sales-carousel">
                        <div class="card-header b-header">
                            <h6>Total cash transaction</h6>
                            <div class="row">
                                <div class="col-6">
                                    <div class="small-chartjs">
                                        <div class="flot-chart-placeholder" id="simple-line-chart-sparkline-2">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="value-graph">
                                        <h3>28% <span><i class="fa fa-angle-up font-warning"></i></span></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="media">
                                <div class="media-body">
                                    <span>Cash on hand</span>
                                    <h2 class="mb-0">4672</h2>
                                    <p>0.8% <span><i class="fa fa-angle-up"></i></span></p>
                                </div>
                                <div class="bg-warning b-r-8">
                                    <div class="small-box">
                                        <i data-feather="shopping-cart"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="sales-contain">
                                <h5 class="f-w-600">Details about cash</h5>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6 xl-50">
                    <div class="card order-graph sales-carousel">
                        <div class="card-header b-header">
                            <h6>Daily Deposits</h6>
                            <div class="row">
                                <div class="col-6">
                                    <div class="small-chartjs">
                                        <div class="flot-chart-placeholder" id="simple-line-chart-sparkline-1">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="value-graph">
                                        <h3>75% <span><i class="fa fa-angle-up font-danger"></i></span></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="media">
                                <div class="media-body">
                                    <span>Security Deposits</span>
                                    <h2 class="mb-0">0782</h2>
                                    <p>0.25% <span><i class="fa fa-angle-up"></i></span></p>
                                </div>
                                <div class="bg-danger b-r-8">
                                    <div class="small-box">
                                        <i data-feather="calendar"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="sales-contain">
                                <h5 class="f-w-600">Gross sales of June</h5>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting</p>
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
        <!-- Container-fluid Ends-->
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const $api         = inject('$api');
const $data        = reactive({ summary: {} });
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