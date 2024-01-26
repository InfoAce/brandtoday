<template>
    <CCol :md="12" :xs="12">
        <CRow>
            <CCol :xs="4">
                <CWidgetStatsB
                class="mb-3"
                :progress="{ color: 'success', value: 75}"
                >
                <template #text>Widget helper text</template>
                <template #title>Widget title</template>
                <template #value>89.9%</template>
                </CWidgetStatsB>
            </CCol>
            <CCol :xs="4">
                <CWidgetStatsB
                class="mb-3"
                :progress="{ color: 'info', value: 75}"
                text="Widget helper text"
                title="Widget title"
                value="12.124"/>
            </CCol>
            <CCol :xs="4">
                <CWidgetStatsB
                class="mb-3"
                :progress="{ color: 'warning', value: 75}"
                text="Widget helper text"
                title="Widget title"
                value="$98.111,00"/>
            </CCol>
            <CCol :md="12" :xs="12">
                <CCard>
                    <CCardBody>
                        <CChart
                            type="line"
                            wrapper
                            :data="{
                                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                datasets: [
                                {
                                    label: 'My First dataset',
                                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                                    borderColor: 'rgba(220, 220, 220, 1)',
                                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                                    pointBorderColor: '#fff',
                                    data: [40, 20, 12, 39, 10, 40, 39]
                                },
                                {
                                    label: 'My Second dataset',
                                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                                    borderColor: 'rgba(151, 187, 205, 1)',
                                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                                    pointBorderColor: '#fff',
                                    data: [50, 12, 28, 29, 7, 25, 12]
                                }
                                ]
                            }"
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    </CCol>
</template>

<script>
import { CChart } from '@coreui/vue-chartjs'
export default {
    components:{
        CChart
    }
}
</script>