<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h4>Shopping Cart</h4>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <nav aria-label="breadcrumb" class="theme-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#" @click="$router.push({ name: 'Home' })">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Shopping</li>
                                <li class="breadcrumb-item active" aria-current="page">Cart</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <!-- breadcrumb End -->

        <!--section start-->
        <section class="section-b-space">
            <div class="container-fluid">
                <div class="row" v-if="!isEmpty(items)">
                    <div class="col-md-8 col-sm-12 col-xs-12">
                        <template v-if="!isEmpty(items)">
                            <div class="card mb-4" v-for="(item,index) in items" :key="`item_${index}`">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-8 col-xs-12 d-flex align-items-center">
                                            <div>
                                                <a href="#" @click.prevent="$router.push({ name:'Product',params:{ product: item.full_code }})">
                                                    <img :src="item.image" :alt="item.name" class="img-thumbnail" width="100px">
                                                </a>
                                            </div>
                                            <div class="d-flex flex-column pl-4">
                                                <a href="#" class="text-theme " @click.prevent="$router.push({ name:'Product',params:{ product: item.full_code }})">
                                                    <strong> {{ item.name }}</strong>
                                                </a>
                                                <h6> Colour: {{ item.colour }}</h6>
                                                <template v-if="isEmpty(item.sizes)">
                                                    <h6> Quantity: {{ item.quantity }}</h6>
                                                </template>
                                                <template v-if="!isEmpty(item.sizes)">
                                                    <h6> Sizes (Quantity): {{ item.sizes.map( size => `${size.name}(${size.quantity})` ).join(', ') }}</h6>
                                                </template>
                                                <h6 v-if="!isEmpty(item.positions)"> Branding: {{ item.sizes.map( size => size.name ).join(',') }}</h6>
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-xs-12 d-flex align-items-center">
                                            <table class="w-100 mt-2">
                                                <tr>
                                                    <td><strong>Unit Price:</strong></td>
                                                    <td> <span class="ml-4">{{ currency }} {{ item.price.toFixed(2) }}</span> </td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Quantity:</strong></td>
                                                    <td><span class="ml-4">{{ item.total_quantity }}</span></td>
                                                </tr>
                                                <template v-if="has(item,'positions')">
                                                    <tr>
                                                        <td><strong>Branding Cost:</strong></td>
                                                        <td> <span class="ml-4">{{ currency }} {{ item.total_branding_cost }}</span> </td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Setup Cost:</strong></td>
                                                        <td> <span class="ml-4">{{ currency }} {{ item.total_setup_cost }}</span> </td>
                                                    </tr>
                                                </template>
                                                <tr>
                                                    <td><strong>Total Cost:</strong></td>
                                                    <td><span class="ml-4">{{ currency }} {{ item.total_amount }}</span> </td>
                                                </tr>                                                
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer d-flex justify-content-between">
                                    <a href="#" class="text-theme" @click.prevent="editItem(item)"><i class="fa fa-pencil"></i></a>
                                    <a href="#" class="text-theme pl-2" @click.prevent="removeItem(item)"><i class="fa fa-trash"></i></a>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="col-md-4 col-sm-12 col-xs-12 product-details p-4">
                        <div class="product-right">
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <td><strong>Sub Total</strong></td>
                                        <td>{{ currency }} {{ total.toFixed(2) }}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Total</strong></td>
                                        <td>{{ currency }} {{ total.toFixed(2) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="row">
                                <div class="col-md-6">
                                    <button class="btn btn-theme btn-lg w-100" @click="$router.push({ name: 'Home' })">Continue Shopping</button>                            
                                </div>
                                <div class="col-md-6">
                                    <button :disabled="isEmpty(items)" href="#" class="btn btn-theme btn-lg w-100" @click="$router.push({ name: 'Checkout' })">Check Out</button>
                                </div>
                                <div class="col-12 py-2">
                                    <button class="btn btn-theme btn-lg w-100" @click="$data.modals.email_quote = true">Email My Quote</button>                            
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div classs="row" v-if="isEmpty(items)">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body text-center">
                                <h2 class="text-theme m-0">
                                    <i class="fa fa-exclamation-circle"></i>
                                    No products found here!
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="emailQuote" tabindex="-1" role="dialog" aria-labelledby="emailQuoteModal" aria-hidden="true" >
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <form @submit.prevent="() => emailQuote()">
                            <div class="modal-header">
                                <h4 class="modal-title">Email Quotation</h4>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="$data.modals.email_quote = false" :disabled="$data.loading.email_quote">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="form-group">
                                    <label for="name">Name</label>
                                    <input type="text" class="form-control mb-2" id="name" placeholder="Your Name" v-model="$data.form.name">
                                    <p class="text-danger col col-12 mt-0" v-show="has($data.errors,'name')">{{$data.errors.name}}</p>								
                                </div>
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="text" class="form-control mb-2" id="email" placeholder="Your Email Address" v-model="$data.form.email">
                                    <p class="text-danger col col-12 mt-0" v-show="has($data.errors,'email')">{{$data.errors.email}}</p>								
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="submit" class="btn btn-theme" :disabled="$data.isDisabled || $data.loading.email_quote">
                                    <span v-if="$data.loading.email_quote" class="mr-2"><i class="fa fa-spin fa-spinner"></i></span>
                                    <span>Send</span>
                                </button>
                                <button type="button" class="btn btn-theme" @click="$data.modals.email_quote = false" :disabled="$data.loading.email_quote">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        <!--section end-->        
    </div>
</template>

<script setup lang="ts">
import { cloneDeep, each, isEmpty, has, set, sum } from 'lodash';
import moment from 'moment';
import { computed, inject, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import * as yup from "yup";

const $api   = inject('$api');

const $data  = reactive({
    errors:     Object(),
    form:       { name: String(), email: String() },
    isDisabled: Boolean(),
    loading:    { email_quote: false, quote: false },
    modals:     { email_quote: false}
});
const $swal  = inject('$swal');
const $store = useStore();
const $toast = inject('$toast');

const formSchema = yup.object().shape({
	email: yup.string().email("*Enter a valid email address").required("*Email address is required"),
	name: yup.string().required("*Name is required"),
});

/**
 * Validates a form field based on the provided field name.
 * Uses the formSchema to validate the field and updates the errors object accordingly.
 * Updates the isDisabled property based on the presence of errors.
 *
 * @param {string} field - The name of the field to validate.
 */
 const validateForm = async (field) => {
    try {
        // Validate the field using the formSchema
        await formSchema.validateAt(field, $data.form);
        // If the field is valid, delete the corresponding error from the errors object
        delete $data.errors[field];        
    } catch (error: any) {
        // If the field is invalid, update the errors object with the error message
        $data.errors[error.path] = error.message;
    } finally {
        // Update the isDisabled property based on the presence of errors
        $data.isDisabled = !isEmpty($data.errors);
    }
}

const items = computed({
    get(): any {
        return cloneDeep($store.getters.cart).map( (item: any) => {
            if( !isEmpty(item.sizes) ){
                set(item,'total_quantity',sum(item.sizes.map( (size:any) => size.quantity )) );
                if(has(item,'positions')){
                    set(item,'total_branding_cost', (sum(item.positions.map( (position:any) => position.price )) * item.total_quantity).toFixed(2));
                    set(item,'total_setup_cost', (sum(item.positions.map( (position:any) => position.setup )) * item.total_quantity).toFixed(2));
                    set(item,'total_amount',sum([(item.price * item.total_quantity),item.total_branding_cost,item.total_setup_cost].map( price => parseFloat(price) )) );
                }
                if(!has(item,'positions')){
                    set(item,'total_amount',(item.price * item.total_quantity));                
                }
            }
            if( isEmpty(item.sizes) ){
                set(item,'total_quantity',item.quantity);
                set(item,'total_amount',(item.price * item.quantity));                
            }
            return item;
        });
    },
    set(value:any): void {
        $store.commit('cart',value);
    }
});

const currency = computed( () => $store.getters.home.company.currency );

const total = computed( () => { 
    return sum(items.value.map( (val:any) => { 
        return val.total_amount
    }));
});

const emailQuote = async () => {
    try {
        $data.loading.email_quote = Boolean(true);
        await $api.post(`/quotes`,{ items: cloneDeep(items.value), ...cloneDeep($data.form) },);
        $toast.success('Quotation has been sent');
        $data.modals.email_quote = false;
        resetForm();
    } catch(error) {
        $toast.success('Something went wrong. Please try again.');
        $data.loading.email_quote = Boolean();
    } finally {
        $data.loading.email_quote = Boolean();
    }
}

const resetForm = () => {
    $data.form = { name: String(), email: String() };
}

/**
 * Removes a cart item by index
 * @param {number} index
 */
const removeItem = (item: any) => {
        // Show a confirmation dialog to the user
    $swal.fire({
        icon:  'question', // Icon to display in the dialog
        title: 'Delete Product', // Title of the dialog
        text:  'Are you want to remove this product from cart ?', // Text content of the dialog
        showCancelButton: true // Whether to show a "Cancel" button
    }).then((result: any) => {
        // If the user confirms the deletion
        if( result.isConfirmed ) {
            // Remove the item from the cart
            items.value = items.value.filter((value: any) => value.full_code != item.full_code);
        }
    });

};

const editItem = (index: number) => {

}

watch( 
    () => $data.modals.email_quote,
    (modal) => {
        if( modal === true){
            $('#emailQuote').modal({
                backdrop: 'static',
                show: true
            });
        }
        if( modal === false){
            $('#emailQuote').modal('hide');
        }
    },
)

watch(
	() => $data.form, 
	(form) => {
		each(form,(value,key) => {
			validateForm(key);
		});
	},
	{ 
		deep: true,
        immediate: true
	}
);


</script>
<style scoped>
.cart-section tbody tr td, .wishlist-section tbody tr td {
    text-align: left;
    min-width: 0px;
}
.cart-section .cart-table thead th, .wishlist-section .cart-table thead th{
    text-align: left;
    font-weight: 0;
    padding: 0;
    text-transform:none;
}
.qty-box .input-group {
    justify-content: start;
}
</style> 