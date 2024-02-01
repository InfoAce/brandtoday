<template>
    <CCol :md="12" :xs="12">
      <CRow>
        <CCol :md="12" :xs="12">
          <h3>List of orders.</h3>
          <p>This is a list of orders created.</p>
        </CCol>
        <CCol :md="12" :xs="12">
            <CCard>
                <CCardBody>
                    <DataTable
                        class="display"
                        :columns="columns"
                        :data="data"
                        :options="{ select: true }"
                        ref="table"
                    >
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Office</th>
                                <th>Extn.</th>
                                <th>Start date</th>
                                <th>Salary</th>
                            </tr>
                        </thead>
                    </DataTable>
                </CCardBody>
            </CCard>      
        </CCol>
      </CRow>
    </CCol>
</template>

<script>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
 
DataTable.use(DataTablesCore);

export default {
    components:{
        DataTable
    },
    data: () => {
        return {
            columns: [
                { data: 'name' },
                { data: 'position' },
                { data: 'office' },
                { data: 'extn' },
                { data: 'start_date' },
                { data: 'salary' },
            ],
            data: []
        }
    },
}
</script>

<style>
@import 'datatables.net-bs5';
</style>