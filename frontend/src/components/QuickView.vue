<template>
    <!-- Quick-view modal popup start-->
    <div class="modal fade bd-example-modal-lg theme-modal" :id="product.fullCode" tabindex="-1" role="dialog" aria-hidden="true" ref="quick_view">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content quick-view-modal">
                <div class="modal-body" style="background-image: none;">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div class="row">
                        <div class="col-lg-6 col-xs-12">
                            <div class="quick-view-img" v-show="$isEmpty(selections.colour)">                                          
                                <img :src="product.images[0].urls[0].url" v-if="!$isEmpty(product.images)" alt="" class="img-fluid blur-up lazyload">
                                <img src="/assets/images/pro3/1.jpg" v-else alt="" class="img-fluid blur-up lazyload">
                            </div>
                            <div class="quick-view-img"  v-if="$has(selections,'colour') && !$isEmpty(selections.colour)">                                          
                                <img :src="selections.colour.images[0].urls[0].url" alt="" class="img-fluid blur-up lazyload">
                            </div>
                        </div>
                        <div class="col-lg-6 rtl-text">
                            <div class="product-right">
                                <h2>{{ product.productName }}</h2>
                                <h3>KSH {{ product.price }}</h3>
                                <ul class="color-variant p-0" v-show="!$isEmpty(product.colourImages)">
                                    <template v-for="(colour,index) in product.colourImages">
                                        <li   
                                            v-if="colour.name == cartItem.colour"                                       
                                            :key="`active_${index}`" 
                                            class="active"
                                            :style="`background-color: ${ $convertToHex(colour.name) }`"                       
                                            @click="($event) => selectColour(colour,$event)"                        
                                        ></li>
                                        <li   
                                            v-else                                  
                                            :key="`inactive_${index}`" 
                                            :style="`background-color: ${ $convertToHex(colour.name) }`"                       
                                            @click="($event) => selectColour(colour,$event)"                        
                                        ></li>
                                    </template>
                                </ul>
								<h6> 
                                    Selected colour: 
                                    <span v-if="$has(errors,'colour')" class="text-danger">{{errors.colour}}</span>
                                    <span v-if="!$isEmpty(form.colour)"><strong>{{ form.colour }}</strong></span>
                                </h6>								
                                <div class="border-product">
                                    <h6 class="product-title">product details</h6>
                                    <p v-html="product.description"></p>
                                </div>
                                <div class="product-description border-product">
                                    <div class="size-box" v-if="isVariant && !$isEmpty(groupedVariants)">
                                        <ul>
                                            <li v-for="(variant,sizeName) of groupedVariants" :key="sizeName" class="my-2 p-2">
                                                <a href="#" @click.prevent="console.log(sizeName)">{{ sizeName }}</a>
                                            </li>
                                        </ul>
								        <p class="text-danger col col-12 mt-0" v-if="$has(errors,'size')">{{errors.size}}</p>								
                                    </div>
                                    <h6 class="product-title">quantity</h6>
                                    <div class="qty-box">
                                        <div class="input-group">
                                            <span class="input-group-prepend">
                                                <button type="button" class="btn quantity-left-minus" data-type="minus" data-field="" @click="() => descreaseQuantity()">
                                                    <i class="ti-angle-left"></i>
                                                </button> 
                                            </span>
                                            <input type="text" :name="`quantity_${product.fullCode}`" class="form-control input-number" :value="form.quantity"> 
                                            <span class="input-group-prepend">
                                                <button type="button" class="btn quantity-right-plus" data-type="plus" data-field="" @click="() => increaseQuantity()">
                                                    <i class="ti-angle-right"></i>
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="product-buttons">
                                    <button class="btn btn-solid" :disabled="isDisabled || !$isEmpty(cartItem)" @click="addToCart">
                                        <span v-show="!$isEmpty(cartItem) == false">add to cart</span>
                                        <span v-show="!$isEmpty(cartItem) == true">already in cart</span> 
                                    </button> 
                                    <a href="#" class="btn btn-solid" @click.prevent="view">view detail</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Quick-view modal popup end-->    
</template>
<script>
import { cloneDeep, each, groupBy, isEmpty, isNull, has } from 'lodash';
import * as yup from "yup";
import convertCssColorNameToHex from 'convert-css-color-name-to-hex';
export default {
    beforeMount(){
        this.initView();               
    },
    computed:{
        cart:{
            get(){
                return this.$store.getters.cart;
            },
            set(value){
                this.$store.commit('cart',value);
            }
        },
        product(){
            return this.data;
        },
        groupedVariants(){
            return groupBy(this.product.variants,'codeSizeName');
        },
        isVariant(){
            return !isEmpty(this.product.variants.filter( val => !isNull(val.codeSizeName) ));
        },
        cartItem(){
            return this.cart.find( val => val.code == this.product.fullCode ) ?? {};
        }
    },
    created(){
        this.$isEmpty      = isEmpty;
        this.$isNull       = isNull;
        this.$has          = has;
        this.$convertToHex = (colour) =>  convertCssColorNameToHex(colour.toLowerCase().split(' ').join(""))       
    },
    data(){
        return {
            errors:      {},
            form:        {},
            isDisabled:  false,
            modal_class: String(),
            schemaShape: {},
            selections:  {}
        }
    },
    methods:{
        addToCart(){
            let { product, selections } = this, data = cloneDeep(this.form);
            if( has(selections,'colour') ){
                data.image = selections.colour.images[0].urls[0].url;
                data.price = product.price;
                data.name  = product.productName;
            }
            this.cart.push(cloneDeep(data));
        },
        close(){
            this.initView();
        },
        initView(){
            $(`input[name="quantity_${this.product.fullCode}"]`).val(1);
            if( this.isVariant ){
                this.form.size        = String();        
                this.schemaShape.size = yup.string().required("*Size is required.");  
                this.selections.size  = {};      
            }
            this.form.colour          = String();
            this.form.code            = String();
            this.form.quantity        = 1;
            this.schemaShape.code   = yup.string().required("*Product code is required.");       
            this.schemaShape.colour   = yup.string().required("*Colour is required.");       
            this.schemaShape.quantity = yup.number().required("*Quantity is required.");       
            this.selections.colour    = {};      
            this.formSchema           = yup.object().shape(this.schemaShape); 
            this.validateForm = (field) => {
                this.formSchema.validateAt(field, this.form)
                    .then((value,key) => {
                        delete this.errors[field];
                    })
                    .catch((err) => {
                        this.errors[err.path] = err.message;
                    })
                    .finally(() => {
                        this.isDisabled = !isEmpty(this.errors);
                    })
            }  
        },
        toBase64(string){
            return btoa(string);
        },
        selectColour(colour,event){
            let variant = window.document.querySelector('.color-variant li.active');
            if( !isNull(variant) ){ variant.classList.remove('active'); }
            event.target.classList.add('active');
            this.selections.colour = colour;      
            this.form.colour       = colour.name;  
        },
        view(){
            $('.btn-close').trigger('click');
            this.$router.push({ name: 'Product', params: { product: this.product.fullCode }})
        },
        descreaseQuantity(){
            let quantity = parseInt($(`input[name="quantity_${this.product.fullCode}"]`).val());
            if( quantity != 1 ){
                const total  = quantity -= 1;   
                $(`input[name="quantity_${this.product.fullCode}"]`).val(total);
                this.form.quantity = total;
            }
        },
        increaseQuantity(){
            let quantity = parseInt($(`input[name="quantity_${this.product.fullCode}"]`).val());
            const total  = quantity += 1;
            $(`input[name="quantity_${this.product.fullCode}"]`).val(total);          
            this.form.quantity = total;
        }
    },
    mounted(){
        this.form.code = this.product.fullCode;
        this.$nextTick( () => {
            if( !isEmpty(this.cartItem) ){
                this.form = cloneDeep(this.cartItem);
            }
        })
    },
    name: "QuickView",
    props:{
        data:{
            default: () => Object(),
            type:    Object
        }
    },
    watch:{
        form:{
            handler(form){
                each(form,(value,key) => {
                    this.validateForm(key);
                });                
            },
            deep: true,
            immediate: true
        },
        modal_class(val) {
            console.log(val);
        }

    }
}
</script>