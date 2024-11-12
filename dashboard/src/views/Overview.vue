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
                <div class="col-xs-12 col-md-8">
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
                <div class="col-xs-12 col-md-4">
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
                                                {{ company.currency }} {{ $data.summary.revenue_received.toFixed(2) }}
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
                                                {{ company.currency }} {{  $data.summary.revenue_pending.toFixed(2) }}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
                <div class="col-12">
                    <div class="row">
                        <div class="col-md-5 col-xs-12">
                            <div class="row">
                                <div class="col-12">
                                    <div class="card o-hidden widget-cards">
                                        <div class="danger-box card-body">
                                            <div class="media static-top-widget align-items-center">
                                                <div class="icons-widgets">
                                                    <div class="align-self-center text-center"> 
                                                        <i class="fas fa-list text-white fa-lg"></i>
                                                    </div>
                                                </div>
                                                <div class="media-body media-doller"><span class="m-0"></span>
                                                    <span class="m-0">Products</span>
                                                    <h3 class="mb-0">
                                                        {{ $data.amrod.products }}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="card o-hidden widget-cards">
                                        <div class="danger-box card-body">
                                            <div class="media static-top-widget align-items-center">
                                                <div class="icons-widgets">
                                                    <div class="align-self-center text-center"> 
                                                        <i class="fas fa-layer-group text-white fa-lg"></i>
                                                    </div>
                                                </div>
                                                <div class="media-body media-doller"><span class="m-0"></span>
                                                    <span class="m-0">Product Variants</span>
                                                    <h3 class="mb-0">
                                                        {{ $data.amrod.product_variants }}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-7 col-xs-12">
                            <div class="card">
                                <div class="card-header">
                                    <h4>Recent Transactions</h4>
                                </div>
                                <div class="card-body">                    
                                    <div class="table-responsive table-desi">
                                        <table class="review-table table">
                                            <thead>
                                                <tr>
                                                    <th>Transaction No.</th>
                                                    <th>Amount</th>
                                                    <th>Order No.</th>
                                                    <th>Items</th>
                                                    <th>Status</th>
                                                    <th>Created At</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(transaction,index) in $data.transactions" :key="index">
                                                    <td>#{{ transaction.confirmation_code }}</td>
                                                    <td>{{ transaction.amount }}</td>
                                                    <td>#{{ transaction.order.num_id }}</td>
                                                    <td>{{ transaction.order.items.length }}</td>
                                                    <td>
                                                        <span class="badge badge-success" v-if="transaction.status_code == 1">Complete</span>
                                                        <span class="badge badge-warning" v-if="isNull(transaction.status_code)">Pending</span>
                                                    </td>
                                                    <td>{{ moment(transaction.created_at).format('Do MMMM, Y') }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
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
                        <h4>Orders created for the past 12 months.</h4>
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
import { computed, inject, onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { cloneDeep, debounce, get, isNull } from 'lodash';
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
import moment from 'moment';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const $api         = inject('$api');
const $toast       = inject('$toast');
const $data        = reactive({ 
    listMonths:      Array(),
    amrod:{
        categories:       0,
        products:         0,
        product_variants: 0,
        prices:           0
    },
    summary: {
        clients:          0, 
        staff:            0, 
        orders:           0,
        pending_orders:   0,
        revenue_received: 0, 
        revenue_pending:  0, 
    },
    orderStatus: [
        {
            label: 'Paid',
            backgroundColor: '#cce5ff',
            data: []
        },
        {
            label: 'Pending',
            backgroundColor: '#ffbc58',
            data: []
        },
        {
            label: 'Confirmed',
            backgroundColor: '#d1ecf1',
            data: []
        },
        {
            label: 'Cancelled',
            backgroundColor: '#7e1414',
            data: []
        },
        {
            label: 'In Transit',
            backgroundColor: '#a5a5a5',
            data: []
        },
        {
            label: 'Delivered',
            backgroundColor: '#d4edda',
            data: []
        } 
    ],
    transactions: Array()
});
const $store       = useStore();
const $ordersChart = computed( 
    () => ({
        config: {
            labels: $data.listMonths.map( item => item.name ),
            datasets: $data.orderStatus
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    })
);

const company = computed( () => $store.getters.home.company );

const getListOfMonths = () => {
    let startdate          = moment().add(1,'day');
    let enddate            = moment().subtract(11,'month');

    if (enddate < startdate){
        let date = enddate.startOf('month');
        while (date < startdate.endOf('month')) {
            $data.listMonths.push({ date: date.format('YYYY-MM'), name: date.format('MMMM'), data: Array() });
            date.add(1,'month');
        }
    }

    $data.orderStatus = $data.orderStatus.map(
        (order) => {
            order.data = $data.listMonths.map( item => 0 );
            return order;
        }
    );

}

onBeforeMount( () => getListOfMonths() )

onMounted( 
    async () => {
        try {
            $store.commit('loader',true);

            let { data: { amrod,order_distribution, summary, transactions } } = await $api.get(`/dashboard/overview`);

            $data.summary      = cloneDeep(summary);

            $data.amrod        = cloneDeep(amrod);
            
            $data.transactions = cloneDeep(transactions);
            
            $data.orderStatus = $data.orderStatus.map(
                (order) => {
                    order.data = $data.listMonths.map( item => parseInt(get(order_distribution.find( dist => dist.date == item.date && dist.status == order.label.toLowerCase() ),'count')) || 0  );
                    return order;
                }
            );

            $store.commit('loader',false);

        } catch(error) {
            console.log(error);

            $toast.error(`Something went wrong in fetching data.`);

        }
    },
)

</script>