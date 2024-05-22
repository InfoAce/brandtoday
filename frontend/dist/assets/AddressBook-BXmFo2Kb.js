import{z as k,i as q,u as A,r as B,o as V,A as h,e as u,f as m,g as s,j as g,h as n,l as d,F as b,m as L,t as l,k as a,B as i,v as c,q as U}from"./index-BX7DgPRM.js";import{c as D,a as _}from"./index.esm-BakSTS1U.js";const T={class:"tab-pane fade active show",id:"address"},j={class:"row"},E={class:"col-12"},F={class:"card mt-0"},N={class:"card-body"},M={class:"top-sec"},P=s("h3",null,"Address Book",-1),z=s("i",{class:"fa fa-plus"},null,-1),O={class:"address-book-section"},G={class:"row g-4"},H={class:"address-box"},I={class:"top mb-6"},J={class:"middle"},K={class:"address"},Q=s("p",null,[s("strong",null,"Address Line 1")],-1),R={class:"address"},W=s("p",null,[s("strong",null,"Address Line 2")],-1),X={class:"address"},Y=s("p",null,[s("strong",null,"Country")],-1),Z=s("p",null,[s("strong",null,"Country / State")],-1),ss=s("p",null,[s("strong",null,"City / Town")],-1),os=s("p",null,[s("strong",null,"Postal Code")],-1),es=s("div",{class:"bottom"},[s("a",{href:"javascript:void(0)","data-bs-target":"#edit-address","data-bs-toggle":"modal",class:"bottom_btn"},"edit"),s("a",{href:"#",class:"bottom_btn"},"remove")],-1),ts={class:"modal fade bd-example-modal-lg",id:"add-address",tabindex:"-1",role:"dialog"},ls={class:"modal-dialog modal-dialog-centered",role:"document"},as={class:"modal-content"},ds={class:"modal-header d-flex"},rs=s("h5",{class:"modal-title",id:"exampleModalLabel"},"Add Address",-1),ns=s("i",{class:"fa fa-times-circle"},null,-1),is=[ns],cs={class:"modal-body"},_s={class:"form-group"},us=s("label",{for:"address_line_1",class:"col-form-label"},"Address Line 1",-1),ms={class:"form-group"},ps=s("label",{for:"address_line_1",class:"col-form-label"},"Address Line 2",-1),fs={class:"form-group"},ys=s("label",{for:"postal_code",class:"col-form-label"},"Postal Code",-1),hs={class:"form-group"},gs=s("label",{for:"country",class:"col-form-label"},"Country",-1),bs={class:"form-group"},vs=s("label",{for:"county_state",class:"col-form-label"},"County/State",-1),xs={class:"form-group"},Ss=s("label",{for:"city_town",class:"col-form-label"},"City/Town",-1),ws={class:"form-group"},Cs=s("label",{for:"category",class:"col-form-label"},"Category",-1),ks={class:"modal-footer"},qs=["disabled"],As={key:0,class:"fa fa-spinner fa-spin"},Ls=k({__name:"AddressBook",setup(Bs){const f=q("$api"),p=A(),o=B({addresses:Array(),errors:Object(),form:{address_line_1:"",address_line_2:"",county_state:"",country:"",postal_code:"",city_town:"",category:""},loader:{save:!1},isDisabled:!0,modals:{add:!1}}),v=D().shape({address_line_1:_().required("*Address Line 1 is required"),address_line_2:_(),city_town:_().required("*City / Town is required"),county_state:_().required("*County / State is required"),country:_().required("*Country is required"),postal_code:_().required("*Postal Code is required"),category:_().required("*Category is required")}),x=r=>{v.validateAt(r,o.form).then((t,e)=>{delete o.errors[r]}).catch(t=>{o.errors[t.path]=t.message}).finally(()=>{o.isDisabled=!d.isEmpty(o.errors)})},y=()=>{p.commit("loader",!0),f.get("/addresses").then(({data:{addresses:r}})=>{o.addresses=d.cloneDeep(r)}).catch(()=>{p.commit("loader",!1)}).finally(()=>{p.commit("loader",!1)})},S=()=>{o.loader.save=!0,f.post("/addresses",o.form).then(()=>{y(),w()}).catch(()=>{o.loader.save=!1}).finally(()=>{o.loader.save=!1})},w=()=>{o.form={address_line_1:"",address_line_2:"",county_state:"",country:"",postal_code:"",city_town:"",category:""},o.modals.add=!1};return V(()=>y()),h(()=>o.form,r=>{d.each(r,(t,e)=>{x(e)})},{deep:!0}),h(()=>o.modals.add,r=>{r&&$("#add-address").modal("show"),r||$("#add-address").modal("hide")}),(r,t)=>(u(),m("div",T,[s("div",j,[s("div",E,[s("div",F,[s("div",N,[s("div",M,[P,s("a",{href:"#",class:"btn btn-sm btn-solid",onClick:t[0]||(t[0]=e=>o.modals.add=!0)},[z,g(" Add New ")])]),s("div",O,[s("div",G,[n(d.isEmpty)(o.addresses)?(u(),m(b,{key:1},[],64)):(u(!0),m(b,{key:0},L(o.addresses,(e,C)=>(u(),m("div",{class:"select-box active col-xl-4 col-md-6",key:C},[s("div",H,[s("div",I,[s("h6",null,[s("span",null,l(e.category),1)])]),s("div",J,[s("div",K,[Q,s("p",null,l(e.address_line_1),1)]),s("div",R,[W,s("p",null,l(e.address_line_2),1)]),s("div",X,[Y,s("p",null,l(e.country),1),Z,s("p",null,l(e.county_state),1),ss,s("p",null,l(e.city_town),1),os,s("p",null,l(e.postal_code),1)])]),es])]))),128))])])])]),s("div",ts,[s("div",ls,[s("div",as,[s("div",ds,[rs,s("button",{type:"button",class:"btn-close mt-3 text-danger",onClick:t[1]||(t[1]=e=>o.modals.add=!1),"aria-label":"Close"},is)]),s("div",cs,[s("div",_s,[us,a(s("input",{type:"text",class:"form-control",id:"address_line_1","onUpdate:modelValue":t[2]||(t[2]=e=>o.form.address_line_1=e)},null,512),[[i,o.form.address_line_1]]),a(s("p",{class:"text-danger col col-12 mb-4"},l(o.errors.address_line_1),513),[[c,n(d.has)(o.errors,"address_line_1")]])]),s("div",ms,[ps,a(s("input",{type:"text",class:"form-control",id:"address_line_1","onUpdate:modelValue":t[3]||(t[3]=e=>o.form.address_line_2=e)},null,512),[[i,o.form.address_line_2]]),a(s("p",{class:"text-danger col col-12 mb-4"},l(o.errors.addreaddress_line_2ss_line_1),513),[[c,n(d.has)(o.errors,"address_line_1")]])]),s("div",fs,[ys,a(s("input",{type:"text",class:"form-control",id:"postal_code","onUpdate:modelValue":t[4]||(t[4]=e=>o.form.postal_code=e)},null,512),[[i,o.form.postal_code]]),a(s("p",{class:"text-danger col col-12 mb-4"},l(o.errors.postal_code),513),[[c,n(d.has)(o.errors,"postal_code")]])]),s("div",hs,[gs,a(s("input",{type:"text",class:"form-control",id:"country","onUpdate:modelValue":t[5]||(t[5]=e=>o.form.country=e)},null,512),[[i,o.form.country]]),a(s("p",{class:"text-danger col col-12 mb-4"},l(o.errors.country),513),[[c,n(d.has)(o.errors,"country")]])]),s("div",bs,[vs,a(s("input",{type:"text",class:"form-control",id:"county_state","onUpdate:modelValue":t[6]||(t[6]=e=>o.form.county_state=e)},null,512),[[i,o.form.county_state]]),a(s("p",{class:"text-danger col col-12 mb-4"},l(o.errors.county_state),513),[[c,n(d.has)(o.errors,"county_state")]])]),s("div",xs,[Ss,a(s("input",{type:"text",class:"form-control",id:"city_town","onUpdate:modelValue":t[7]||(t[7]=e=>o.form.city_town=e)},null,512),[[i,o.form.city_town]]),a(s("p",{class:"text-danger col col-12 mb-4"},l(o.errors.city_town),513),[[c,n(d.has)(o.errors,"city_town")]])]),s("div",ws,[Cs,a(s("input",{type:"text",class:"form-control",id:"category","onUpdate:modelValue":t[8]||(t[8]=e=>o.form.category=e)},null,512),[[i,o.form.category]]),a(s("p",{class:"text-danger col col-12 mb-4"},l(o.errors.category),513),[[c,n(d.has)(o.errors,"category")]])])]),s("div",ks,[s("button",{onClick:S,class:"btn btn-solid btn-sm",type:"button",disabled:o.isDisabled||o.loader.save},[o.loader.save?(u(),m("i",As)):U("",!0),g(" Save ")],8,qs)])])])])])])]))}});export{Ls as default};