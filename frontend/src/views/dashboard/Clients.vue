<template>
  <CCol :md="12" :xs="12">
    <CRow>
      <CCol :md="12" :xs="12">
        <h3>List of clients</h3>
          <p>This is a list of registered clients in the system.</p>
      </CCol>
      <CCol :md="12" :xs="12">
          <CCard>
              <CCardBody class="p-4">
                  <DataTable
                      class="display table-stripped"
                      :columns="table.columns"
                      :data="table.clients"
                      :options="table.options"
                      ref="table"
                  >
                      <thead>
                          <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Email Address</th>
                              <th>Phone Number</th>
                              <th>Status</th>
                              <th>Joined On</th>
                              <th>Action</th>
                          </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(client,key) in clients" :key="key">
                          <td>{{ key + 1 }}</td>
                          <td>{{ client.name }}</td>
                          <td>{{ client.email }}</td>
                          <td>{{ client.phone_number }}</td>
                          <td>{{ client.status }}</td>
                          <td>{{ client.created_at }}</td>
                          <td>
                            <CDropdown color="secondary" togglerText="Dropdown button">
                              <CDropdownToggle component="a" color="primary">More</CDropdownToggle>
                              <CDropdownMenu>
                                <CDropdownItem href="#">Edit</CDropdownItem>
                                <CDropdownItem href="#">Deactive</CDropdownItem>
                                <CDropdownItem href="#">Remove</CDropdownItem>
                              </CDropdownMenu>  
                            </CDropdown>
                          </td>
                        </tr>
                      </tbody>
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
        table:{
          columns: [
              { 
                title: '#' 
              },
              {
                data:  'name',
                title: 'Name'
              },
              { 
                data:  'email',
                title: 'Email Address'
              },
              { 
                data:  'phone_number',
                title: 'Phone Number'
              },
              { 
                data: 'status',
                title: 'Account Status'
              },
              { 
                data: 'created_at',
                title: 'Joined On'
              },
              { 
                title: 'Action' 
              },
          ],
          clients: [
            {
              name:"Bryant Rotich",
              email:"bryantkrotich@gmail.com",
              phone_number:"+254712182872",
              status:"active",
              created_at:"1st Feb 2024"
            },
            {
              name:"Bryant Rotich",
              email:"bryantkrotich@gmail.com",
              phone_number:"+254712182872",
              status:"active",
              created_at:"1st Feb 2024"
            },
            {
              name:"Bryant Rotich",
              email:"bryantkrotich@gmail.com",
              phone_number:"+254712182872",
              status:"active",
              created_at:"1st Feb 2024"
            },
            {
              name:"Bryant Rotich",
              email:"bryantkrotich@gmail.com",
              phone_number:"+254712182872",
              status:"active",
              created_at:"1st Feb 2024"
            },
            {
              name:"Bryant Rotich",
              email:"bryantkrotich@gmail.com",
              phone_number:"+254712182872",
              status:"active",
              created_at:"1st Feb 2024"
            },
            {
              name:"Bryant Rotich",
              email:"bryantkrotich@gmail.com",
              phone_number:"+254712182872",
              status:"active",
              created_at:"1st Feb 2024"
            },
            {
              name:"Bryant Rotich",
              email:"bryantkrotich@gmail.com",
              phone_number:"+254712182872",
              status:"active",
              created_at:"1st Feb 2024"
            },
          ],
          options: {
            columnDefs: [
              {
                  targets: -1,
                  className: 'dt-body-right'
              }
            ]
          }
        }
      }
  },
}
</script>

<style>
@import 'datatables.net-bs5';
</style>