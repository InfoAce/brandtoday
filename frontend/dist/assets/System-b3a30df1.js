import{l,d as n,o as u,n as V,f as s,e,g as q,c as g,t as C,L as m,m as x,k as y}from"./index-0242c6eb.js";import{c as B,a as b}from"./index.esm-eb5145b9.js";import{_ as D}from"./_plugin-vue_export-helper-c27b6911.js";const R={beforeCreate(){this.checkConfig=l.debounce(o=>{const t=this;l.each(o,(i,c)=>{t.validateConfigurations(c,o)})},500)},beforeRouteEnter(o,t,i){i(c=>{c.fetchConfigurations(),i()})},data(){return{errors:{},configurations:{amrod:{auth_uri:"",username:"",password:"",account_number:"",vendor_uri:""}},isDisabled:!0}},created(){this.$has=l.has,this.$isEmpty=l.isEmpty,this.configSchema=B().shape({auth_uri:b().required("*Auth URI is required"),username:b().email("*Enter a valid email address").required("*Username is required"),password:b().required("*Password is required"),account_number:b().required("*Account Number is required"),vendor_uri:b().required("*Vendor URI is required")})},methods:{fetchConfigurations(){this.$store.commit("loader",!0),this.$api.get("/system").then(({data:{configurations:o}})=>{this.configurations=l.cloneDeep(o)}).catch(({response:o})=>{}).finally(()=>{this.$store.commit("loader",!1)})},updateConfigurations(){this.$store.commit("loader",!0),this.isDisabled=!0,this.$api.post("/system/configurations",this.configurations).then(({data:{company:o}})=>{}).catch(({response:o})=>{}).finally(()=>{this.$store.commit("loader",!1)})},validateConfigurations(o,t){this.configSchema.validateAt(o,t).then((i,c)=>{delete this.errors[o]}).catch(i=>{this.errors[i.path]=i.message})}},watch:{errors:{handler(o){this.isDisabled=!l.isEmpty(o)},deep:!0},"configurations.amrod":{handler(o){this.checkConfig(o)},deep:!0,immediate:!0}}},A=y("h5",{class:"mb-0"},"System Configurations",-1),N=y("hr",{class:"mb-2 mt-2"},null,-1),F=y("h6",{class:"my-4"},"API Settings",-1),G={key:0,class:"text-danger col col-12 mb-0"},P={key:0,class:"text-danger col col-12 mb-0"},T={key:0,class:"text-danger col col-12 mb-0"},j={key:0,class:"text-danger col col-12 mb-0"},z={key:0,class:"text-danger col col-12 mb-0"};function L(o,t,i,c,r,v){const d=n("CCol"),p=n("CIcon"),f=n("CInputGroupText"),h=n("CFormInput"),_=n("CInputGroup"),w=n("CSpinner"),S=n("CButton"),k=n("CForm"),I=n("CRow"),E=n("CCardBody"),U=n("CCard");return u(),V(d,{lg:"6",md:"8",xs:"12"},{default:s(()=>[e(U,{style:{"min-height":"100vh"}},{default:s(()=>[e(E,null,{default:s(()=>[e(I,null,{default:s(()=>[e(d,{md:"12",xs:"12"},{default:s(()=>[A,N]),_:1}),e(d,{md:"8",xs:"12"},{default:s(()=>[e(k,{autocomplete:"off",onSubmit:q(v.updateConfigurations,["prevent"])},{default:s(()=>[e(d,{md:12,xs:12},{default:s(()=>[F]),_:1}),e(_,{class:"mb-3"},{default:s(()=>[e(f,null,{default:s(()=>[e(p,{icon:"cil-user"})]),_:1}),e(h,{placeholder:"Vendor URI",modelValue:r.configurations.amrod.vendor_uri,"onUpdate:modelValue":t[0]||(t[0]=a=>r.configurations.amrod.vendor_uri=a),autocomplete:"off"},null,8,["modelValue"]),!o.$isEmpty(r.errors)&&o.$has(r.errors,"vendor_uri")?(u(),g("p",G,C(r.errors.vendor_uri),1)):m("",!0)]),_:1}),e(_,{class:"mb-3"},{default:s(()=>[e(f,null,{default:s(()=>[e(p,{icon:"cil-user"})]),_:1}),e(h,{placeholder:"Auth URI",modelValue:r.configurations.amrod.auth_uri,"onUpdate:modelValue":t[1]||(t[1]=a=>r.configurations.amrod.auth_uri=a),autocomplete:"off"},null,8,["modelValue"]),!o.$isEmpty(r.errors)&&o.$has(r.errors,"auth_uri")?(u(),g("p",P,C(r.errors.auth_uri),1)):m("",!0)]),_:1}),e(_,{class:"mb-3"},{default:s(()=>[e(f,null,{default:s(()=>[e(p,{icon:"cil-envelope"})]),_:1}),e(h,{placeholder:"Username",name:"username",modelValue:r.configurations.amrod.username,"onUpdate:modelValue":t[2]||(t[2]=a=>r.configurations.amrod.username=a),autocomplete:"off"},null,8,["modelValue"]),!o.$isEmpty(r.errors)&&o.$has(r.errors,"username")?(u(),g("p",T,C(r.errors.username),1)):m("",!0)]),_:1}),e(_,{class:"mb-3"},{default:s(()=>[e(f,null,{default:s(()=>[e(p,{icon:"cil-phone"})]),_:1}),e(h,{placeholder:"Password",type:"password",name:"password",modelValue:r.configurations.amrod.password,"onUpdate:modelValue":t[3]||(t[3]=a=>r.configurations.amrod.password=a),autocomplete:"off"},null,8,["modelValue"]),!o.$isEmpty(r.errors)&&o.$has(r.errors,"password")?(u(),g("p",j,C(r.errors.password),1)):m("",!0)]),_:1}),e(_,{class:"mb-3"},{default:s(()=>[e(f,null,{default:s(()=>[e(p,{icon:"cil-address-book"})]),_:1}),e(h,{placeholder:"Account Number",modelValue:r.configurations.amrod.account_number,"onUpdate:modelValue":t[4]||(t[4]=a=>r.configurations.amrod.account_number=a),autocomplete:"off"},null,8,["modelValue"]),!o.$isEmpty(r.errors)&&o.$has(r.errors,"account_number")?(u(),g("p",z,C(r.errors.account_number),1)):m("",!0)]),_:1}),e(d,{md:12,xs:12,class:"d-flex justify-content-end"},{default:s(()=>[e(S,{color:"success",class:"text-light",disabled:r.isDisabled,type:"submit"},{default:s(()=>[r.isDisabled&&o.$store.getters.loader?(u(),V(w,{key:0,component:"span",size:"sm",variant:"grow","aria-hidden":"true"})):m("",!0),x(" Save Changes ")]),_:1},8,["disabled"])]),_:1})]),_:1},8,["onSubmit"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}const K=D(R,[["render",L]]);export{K as default};
