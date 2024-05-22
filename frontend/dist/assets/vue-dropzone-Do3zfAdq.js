import{$ as h}from"./vue-dropzone.vue_vue_type_style_index_0_lang-B11SuGN4.js";import{_ as c,e as u,f as l,H as z,q as m,G as g,j as v}from"./index-BX7DgPRM.js";const f={getSignedURL(e,t){let o={filePath:e.name,contentType:e.type};return new Promise((r,s)=>{var p=new FormData;let n=new XMLHttpRequest,d=typeof t.signingURL=="function"?t.signingURL(e):t.signingURL;n.open("POST",d),n.onload=function(){n.status==200?r(JSON.parse(n.response)):s(n.statusText)},n.onerror=function(i){console.error("Network Error : Could not send request to AWS (Maybe CORS errors)"),s(i)},t.withCredentials===!0&&(n.withCredentials=!0),Object.entries(t.headers||{}).forEach(([i,a])=>{n.setRequestHeader(i,a)}),o=Object.assign(o,t.params||{}),Object.entries(o).forEach(([i,a])=>{p.append(i,a)}),n.send(p)})},sendFile(e,t,o){var r=o?this.setResponseHandler:this.sendS3Handler;return this.getSignedURL(e,t).then(s=>r(s,e)).catch(s=>s)},setResponseHandler(e,t){t.s3Signature=e.signature,t.s3Url=e.postEndpoint},sendS3Handler(e,t){let o=new FormData,r=e.signature;return Object.keys(r).forEach(function(s){o.append(s,r[s])}),o.append("file",t),new Promise((s,p)=>{let n=new XMLHttpRequest;n.open("POST",e.postEndpoint),n.onload=function(){if(n.status==201){var d=new window.DOMParser().parseFromString(n.response,"text/xml"),i=d.firstChild.children[0].innerHTML;s({success:!0,message:i})}else{var d=new window.DOMParser().parseFromString(n.response,"text/xml"),a=d.firstChild.children[0].innerHTML;p({success:!1,message:a+". Request is marked as resolved when returns as status 201"})}},n.onerror=function(){var d=new window.DOMParser().parseFromString(n.response,"text/xml"),i=d.firstChild.children[1].innerHTML;p({success:!1,message:i})},n.send(o)})}},S={props:{id:{type:String,required:!0,default:"dropzone"},options:{type:Object,required:!0},includeStyling:{type:Boolean,default:!0,required:!1},awss3:{type:Object,required:!1,default:null},destroyDropzone:{type:Boolean,default:!0,required:!1},duplicateCheck:{type:Boolean,default:!1,required:!1},useCustomSlot:{type:Boolean,default:!1,required:!1}},emits:["vdropzone-thumbnail","vdropzone-duplicate-file","vdropzone-file-added","vdropzone-files-added","vdropzone-removed-file","vdropzone-success","vdropzone-error","vdropzone-s3-upload-success","vdropzone-s3-upload-error","vdropzone-success-multiple","vdropzone-error-multiple","vdropzone-sending","vdropzone-sending-multiple","vdropzone-complete","vdropzone-complete-multiple","vdropzone-canceled","vdropzone-canceled-multiple","vdropzone-max-files-reached","vdropzone-max-files-exceeded","vdropzone-processing","vdropzone-processing-multiple","vdropzone-upload-progress","vdropzone-total-upload-progress","vdropzone-reset","vdropzone-queue-complete","vdropzone-drop","vdropzone-drag-start","vdropzone-drag-end","vdropzone-drag-enter","vdropzone-drag-over","vdropzone-drag-leave","vdropzone-mounted","vdropzone-file-added-manually"],data(){return{aws:null,isS3:!1,isS3OverridesServerPropagation:!1,wasQueueAutoProcess:!0,files:[],dropzoneSettings:{thumbnailWidth:200,thumbnailHeight:200}}},watch:{options:{handler(){this.updateSettings()},deep:!0},awss3:{handler(){this.updateAWSSettings()},deep:!0}},beforeMount(){this.updateSettings(),this.updateAWSSettings()},mounted(){this.$isServer&&this.hasBeenMounted||(this.hasBeenMounted=!0,this.dropzone=new h(this.$refs.dropzoneElement,this.dropzoneSettings),this.dropzone.on("thumbnail",(e,t)=>{this.$emit("vdropzone-thumbnail",e,t)}),this.dropzone.on("addedfile",e=>{this.duplicateCheck&&this.dropzone.getQueuedFiles().length&&this.getQueuedFiles().forEach(t=>{t.name===e.name&&t.size===e.size&&t.lastModifiedDate.toString()===e.lastModifiedDate.toString()&&t.dataUrl===e.dataUrl&&(this.removeFile(e),this.$emit("vdropzone-duplicate-file",e))}),this.$emit("vdropzone-file-added",e),this.isS3&&this.wasQueueAutoProcess&&!e.manuallyAdded&&this.getSignedAndUploadToS3(e)}),this.dropzone.on("addedfiles",e=>{this.$emit("vdropzone-files-added",e)}),this.dropzone.on("removedfile",e=>{this.$emit("vdropzone-removed-file",e),e.manuallyAdded&&this.dropzone.options.maxFiles!==null&&this.dropzone.options.maxFiles++}),this.dropzone.on("success",(e,t)=>{if(this.$emit("vdropzone-success",e,t),this.isS3){if(this.isS3OverridesServerPropagation){let r=new window.DOMParser().parseFromString(t,"text/xml").firstChild.children[0].innerHTML;this.$emit("vdropzone-s3-upload-success",r)}this.wasQueueAutoProcess&&this.setOption("autoProcessQueue",!1)}}),this.dropzone.on("successmultiple",(e,t)=>{this.$emit("vdropzone-success-multiple",e,t)}),this.dropzone.on("error",(e,t,o)=>{this.$emit("vdropzone-error",e,t,o),this.isS3&&this.$emit("vdropzone-s3-upload-error")}),this.dropzone.on("errormultiple",(e,t,o)=>{this.$emit("vdropzone-error-multiple",e,t,o)}),this.dropzone.on("sending",(e,t,o)=>{if(this.isS3)if(this.isS3OverridesServerPropagation){let r=e.s3Signature;Object.keys(r).forEach(function(s){o.append(s,r[s])})}else o.append("s3ObjectLocation",e.s3ObjectLocation);this.$emit("vdropzone-sending",e,t,o)}),this.dropzone.on("sendingmultiple",(e,t,o)=>{this.$emit("vdropzone-sending-multiple",e,t,o)}),this.dropzone.on("complete",e=>{this.$emit("vdropzone-complete",e)}),this.dropzone.on("completemultiple",e=>{this.$emit("vdropzone-complete-multiple",e)}),this.dropzone.on("canceled",e=>{this.$emit("vdropzone-canceled",e)}),this.dropzone.on("canceledmultiple",e=>{this.$emit("vdropzone-canceled-multiple",e)}),this.dropzone.on("maxfilesreached",e=>{this.$emit("vdropzone-max-files-reached",e)}),this.dropzone.on("maxfilesexceeded",e=>{this.$emit("vdropzone-max-files-exceeded",e)}),this.dropzone.on("processing",e=>{this.$emit("vdropzone-processing",e)}),this.dropzone.on("processingmultiple",e=>{this.$emit("vdropzone-processing-multiple",e)}),this.dropzone.on("uploadprogress",(e,t,o)=>{this.$emit("vdropzone-upload-progress",e,t,o)}),this.dropzone.on("totaluploadprogress",(e,t,o)=>{this.$emit("vdropzone-total-upload-progress",e,t,o)}),this.dropzone.on("reset",()=>{this.$emit("vdropzone-reset")}),this.dropzone.on("queuecomplete",()=>{this.$emit("vdropzone-queue-complete")}),this.dropzone.on("drop",e=>{this.$emit("vdropzone-drop",e)}),this.dropzone.on("dragstart",e=>{this.$emit("vdropzone-drag-start",e)}),this.dropzone.on("dragend",e=>{this.$emit("vdropzone-drag-end",e)}),this.dropzone.on("dragenter",e=>{this.$emit("vdropzone-drag-enter",e)}),this.dropzone.on("dragover",e=>{this.$emit("vdropzone-drag-over",e)}),this.dropzone.on("dragleave",e=>{this.$emit("vdropzone-drag-leave",e)}),this.$emit("vdropzone-mounted"))},beforeUnmount(){this.destroyDropzone&&this.dropzone.destroy()},methods:{updateAWSSettings(){this.awss3!==null&&(this.aws={...this.awss3},this.dropzoneSettings.autoProcessQueue=!1,this.isS3=!0,this.isS3OverridesServerPropagation=this.aws.sendFileToServer===!1,this.options.autoProcessQueue!==void 0&&(this.wasQueueAutoProcess=this.options.autoProcessQueue),this.isS3OverridesServerPropagation&&(this.dropzoneSettings.url=e=>e[0].s3Url))},updateSettings(){this.dropzoneSettings=Object.assign(this.dropzoneSettings,this.options)},manuallyAddFile:function(e,t){e.manuallyAdded=!0,this.dropzone.emit("addedfile",e);let o=!1;if((t.indexOf(".svg")>-1||t.indexOf(".png")>-1||t.indexOf(".jpg")>-1||t.indexOf(".jpeg")>-1||t.indexOf(".gif")>-1||t.indexOf(".webp")>-1)&&(o=!0),this.dropzone.options.createImageThumbnails&&o&&e.size<=this.dropzone.options.maxThumbnailFilesize*1024*1024){t&&this.dropzone.emit("thumbnail",e,t);let r=e.previewElement.querySelectorAll("[data-dz-thumbnail]");for(let s=0;s<r.length;s++)r[s].style.width=this.dropzoneSettings.thumbnailWidth+"px",r[s].style.height=this.dropzoneSettings.thumbnailHeight+"px",r[s].style["object-fit"]="contain"}this.dropzone.emit("complete",e),this.dropzone.options.maxFiles&&this.dropzone.options.maxFiles--,this.dropzone.files.push(e),this.$emit("vdropzone-file-added-manually",e)},setOption:function(e,t){this.dropzone.options[e]=t},removeAllFiles:function(e){this.dropzone.removeAllFiles(e)},processQueue:function(){let e=this.dropzone;this.isS3&&!this.wasQueueAutoProcess?this.getQueuedFiles().forEach(t=>{this.getSignedAndUploadToS3(t)}):this.dropzone.processQueue(),this.dropzone.on("success",function(){e.options.autoProcessQueue=!0}),this.dropzone.on("queuecomplete",function(){e.options.autoProcessQueue=!1})},init:function(){return this.dropzone.init()},destroy:function(){return this.dropzone.destroy()},updateTotalUploadProgress:function(){return this.dropzone.updateTotalUploadProgress()},getFallbackForm:function(){return this.dropzone.getFallbackForm()},getExistingFallback:function(){return this.dropzone.getExistingFallback()},setupEventListeners:function(){return this.dropzone.setupEventListeners()},removeEventListeners:function(){return this.dropzone.removeEventListeners()},disable:function(){return this.dropzone.disable()},enable:function(){return this.dropzone.enable()},filesize:function(e){return this.dropzone.filesize(e)},accept:function(e,t){return this.dropzone.accept(e,t)},addFile:function(e){return this.dropzone.addFile(e)},removeFile:function(e){this.dropzone.removeFile(e)},getAcceptedFiles:function(){return this.dropzone.getAcceptedFiles()},getRejectedFiles:function(){return this.dropzone.getRejectedFiles()},getFilesWithStatus:function(){return this.dropzone.getFilesWithStatus()},getQueuedFiles:function(){return this.dropzone.getQueuedFiles()},getUploadingFiles:function(){return this.dropzone.getUploadingFiles()},getAddedFiles:function(){return this.dropzone.getAddedFiles()},getActiveFiles:function(){return this.dropzone.getActiveFiles()},getSignedAndUploadToS3(e){let t=f.sendFile(e,this.aws,this.isS3OverridesServerPropagation);this.isS3OverridesServerPropagation?t.then(()=>{setTimeout(()=>this.dropzone.processFile(e))}):t.then(o=>{o.success?(e.s3ObjectLocation=o.message,setTimeout(()=>this.dropzone.processFile(e)),this.$emit("vdropzone-s3-upload-success",o.message)):typeof o.message<"u"?this.$emit("vdropzone-s3-upload-error",o.message):this.$emit("vdropzone-s3-upload-error","Network Error : Could not send request to AWS. (Maybe CORS error)")}),t.catch(o=>{alert(o)})},setAWSSigningURL(e){this.isS3&&this.aws&&(this.aws.signingURL=e)}}},F=["id"],w={key:0,class:"dz-message"};function $(e,t,o,r,s,p){return u(),l("div",{id:o.id,ref:"dropzoneElement",class:g({"vue-dropzone dropzone":o.includeStyling})},[o.useCustomSlot?(u(),l("div",w,[z(e.$slots,"default",{},()=>[v("Drop files here to upload")])])):m("",!0)],10,F)}const O=c(S,[["render",$]]);export{O as v};