import{_ as f,l as a,d as k,e as r,f as c,g as e,w as z,j as y,J as b,k as d,B as u,v as m,t as p,q as C}from"./index-BX7DgPRM.js";import{c as S,a as h}from"./index.esm-BakSTS1U.js";import"./vue-dropzone.vue_vue_type_style_index_0_lang-B11SuGN4.js";import{v as E}from"./vue-dropzone-Do3zfAdq.js";const v="/assets/home/images/dashboard/designer.jpg",U={beforeCreate(){this.checkCompany=a.debounce(s=>{const t=a.pick(s,["name","phone_number","address","email"]),i=this;a.each(t,(n,o)=>{i.validateCompany(o,t)})},500)},beforeRouteEnter(s,t,i){i(n=>{n.fetchCompany(),i()})},components:{vueDropzone:E},computed:{authToken(){return this.$store.getters.authToken},authUser:{get(){return this.$store.getters.authUser},set(s){this.$store.commit("authUser",s)}},backendUri(){return this.env.VITE_API_BASE_URL.replace("api/v1","")},env(){return this.$store.getters.env}},data(){return{edit:{icon:!1,logo:!1},errors:{},company:{address:"",name:"",email:"",icon:"",logo:"",phone_number:""},loading:{updating:!1},dropzoneLogoOptions:{url:"https://httpbin.org/post",thumbnailWidth:300,maxFilesize:2,headers:{}},dropzoneIconOptions:{url:"https://httpbin.org/post",thumbnailWidth:300,maxFilesize:.5,headers:{}},isDisabled:!0}},created(){this.$isEmpty=a.isEmpty,this.$has=a.has,this.companySchema=S().shape({address:h().required("*Address is required"),name:h().required("*Name is required"),email:h().email("*Enter a valid email address").required("*Email address is required"),phone_number:h().required("*Phone number is required")}),this.imageUpdate=a.debounce(()=>{this.fetchCompany()},1e3)},methods:{fetchCompany(){const{authToken:s,env:{VITE_API_BASE_URL:t},edit:i}=this;this.$store.commit("loader",!0),this.$api.get("/auth/company").then(({data:{company:n}})=>{this.company=n,this.dropzoneLogoOptions.url=`${t}/company/${n.id}/upload/logo`,this.dropzoneLogoOptions.headers={Authorization:`${s.token_type} ${s.token}`},this.dropzoneIconOptions.url=`${t}/company/${n.id}/upload/icon`,this.dropzoneIconOptions.headers={Authorization:`${s.token_type} ${s.token}`},this.authUser.company=a.cloneDeep(n)}).catch(({response:n})=>{}).finally(()=>{i.logo&&(this.edit.logo=!1),i.icon&&(this.edit.icon=!1),this.$store.commit("loader",!1)})},updateCompany(){this.$store.commit("loader",!0),this.isDisabled=!0,this.$api.post("/auth/company",a.pick(this.company,["name","phone_number","address","email"])).then(({data:{company:s}})=>{}).catch(({response:s})=>{}).finally(()=>{this.$store.commit("loader",!1)})},validateCompany(s,t){this.companySchema.validateAt(s,t).then((i,n)=>{delete this.errors[s]}).catch(i=>{this.errors[i.path]=i.message})}},watch:{errors:{handler(s){this.isDisabled=!a.isEmpty(s)},deep:!0},company:{handler(s){this.checkCompany(s)},deep:!0,immediate:!0}}},I={class:"container-fluid"},V={class:"page-header"},q={class:"row"},w=e("div",{class:"col-lg-6"},[e("div",{class:"page-header-left"},[e("h3",null,"Company Profile")])],-1),L={class:"col-lg-6"},O={class:"breadcrumb pull-right"},$={class:"breadcrumb-item"},x=e("i",{"data-feather":"home"},null,-1),A=e("li",{class:"breadcrumb-item"},"Settings",-1),B=e("li",{class:"breadcrumb-item active"},"Company",-1),D={class:"container-fluid"},T={class:"row"},N={class:"col-xl-5 col-lg-5 col-md-6"},P={class:"card"},R={class:"card-body"},j={class:"row"},F={class:"col-12 mb-2"},M=e("label",null,"Company Logo",-1),W={key:1,class:"col-12 text-center"},J=["src","alt"],G={key:1,src:v,alt:"",class:"img-fluid blur-up lazyloaded col-12"},H={class:"col-12 mb-2"},K=e("label",null,"Company Icon",-1),Q={key:1,class:"col-12 text-center"},X=["src","alt"],Y={key:1,src:v,alt:"",class:"img-fluid blur-up lazyloaded col-12"},Z={class:"col-12"},ee={class:"form-group"},oe=e("label",{for:"first_name"},"Name",-1),se={class:"col-12"},te={class:"form-group"},ie=e("label",{for:"email"},"Email",-1),ne={class:"col-12"},re={class:"form-group"},ae=e("label",{for:"phone_number"},"Phone Number",-1),le={class:"col-12"},ce={class:"form-group"},de=e("label",{for:"address"},"Address",-1),me=e("input",{class:"form-control",id:"address",type:"text",required:""},null,-1),pe={class:"col-12"},he=["disabled"],ue={key:0,class:"fa fa-spinner fa-spin"};function _e(s,t,i,n,o,_){const g=k("vue-dropzone");return r(),c("div",null,[e("div",I,[e("div",V,[e("div",q,[w,e("div",L,[e("ol",O,[e("li",$,[e("a",{href:"#",onClick:t[0]||(t[0]=z(l=>s.router.push({name:"Overview"}),["prevent"]))},[x,y(" Overview ")])]),A,B])])])])]),e("div",D,[e("div",T,[e("div",N,[e("div",P,[e("div",R,[e("div",j,[e("div",F,[M,o.edit.logo?(r(),b(g,{key:0,ref:"dropzoneLogo",onVdropzoneSuccess:s.imageUpdate,id:"dropzoneLogo",options:o.dropzoneLogoOptions},null,8,["onVdropzoneSuccess","options"])):(r(),c("div",W,[s.$isEmpty(o.company.logo)?(r(),c("img",G)):(r(),c("img",{key:0,src:`${_.backendUri}${o.company.logo}`,alt:`${o.company.name}`,class:"img-fluid blur-up lazyloaded col-12"},null,8,J)),e("button",{class:"btn btn-primary btn-sm my-2",onClick:t[1]||(t[1]=l=>o.edit.logo=!0)},"Edit Logo")]))]),e("div",H,[K,o.edit.icon?(r(),b(g,{key:0,onVdropzoneSuccess:s.imageUpdate,ref:"dropzoneIcon",id:"dropzoneIcon",options:o.dropzoneIconOptions},null,8,["onVdropzoneSuccess","options"])):(r(),c("div",Q,[s.$isEmpty(o.company.icon)?(r(),c("img",Y)):(r(),c("img",{key:0,src:`${_.backendUri}${o.company.icon}`,alt:`${o.company.name}`,class:"img-fluid blur-up lazyloaded col-12"},null,8,X)),e("button",{class:"btn btn-primary btn-sm my-2",onClick:t[2]||(t[2]=l=>o.edit.icon=!0)},"Edit Icon")]))]),e("div",Z,[e("div",ee,[oe,d(e("input",{class:"form-control",id:"name",type:"text","onUpdate:modelValue":t[3]||(t[3]=l=>o.company.name=l)},null,512),[[u,o.company.name]]),d(e("p",{class:"text-danger col col-12 mb-0"},p(o.errors.name),513),[[m,s.$has(o.errors,"name")]])])]),e("div",se,[e("div",te,[ie,d(e("input",{class:"form-control",id:"email",type:"text","onUpdate:modelValue":t[4]||(t[4]=l=>o.company.email=l)},null,512),[[u,o.company.email]]),d(e("p",{class:"text-danger col col-12 mb-0"},p(o.errors.email),513),[[m,s.$has(o.errors,"email")]])])]),e("div",ne,[e("div",re,[ae,d(e("input",{class:"form-control",id:"phone_number",type:"text","onUpdate:modelValue":t[5]||(t[5]=l=>o.company.phone_number=l)},null,512),[[u,o.company.phone_number]]),d(e("p",{class:"text-danger col col-12 mb-0"},p(o.errors.phone_number),513),[[m,s.$has(o.errors,"phone_number")]])])]),e("div",le,[e("div",ce,[de,me,d(e("p",{class:"text-danger col col-12 mb-0"},p(o.errors.address),513),[[m,s.$has(o.errors,"address")]])])]),e("div",pe,[e("button",{class:"btn btn-primary",disabled:o.isDisabled||o.loading.updating},[o.loading.updating?(r(),c("i",ue)):C("",!0),y(" Save Changes ")],8,he)])])])])])])])])}const fe=f(U,[["render",_e]]);export{fe as default};