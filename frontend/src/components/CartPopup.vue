<template>
    <ul class="show-div shopping-cart">
        <li>
            <div class="media">
                <a href="#"><img alt="" class="me-3"
                        src="/assets/images/fashion/product/1.jpg"></a>
                <div class="media-body">
                    <a href="#">
                        <h4>item name</h4>
                    </a>
                    <h4><span>1 x $ 299.00</span></h4>
                </div>
            </div>
            <div class="close-circle"><a href="#"><i class="fa fa-times"
                        aria-hidden="true"></i></a></div>
        </li>
        <li>
            <div class="media">
                <a href="#"><img alt="" class="me-3"
                        src="/assets/images/fashion/product/2.jpg"></a>
                <div class="media-body">
                    <a href="#">
                        <h4>item name</h4>
                    </a>
                    <h4><span>1 x $ 299.00</span></h4>
                </div>
            </div>
            <div class="close-circle"><a href="#"><i class="fa fa-times"
                        aria-hidden="true"></i></a></div>
        </li>
        <li>
            <div class="total">
                <h5>subtotal : <span>$299.00</span></h5>
            </div>
        </li>
        <li>
            <div class="buttons"><a href="cart.html" class="view-cart">view
                    cart</a> <a href="#" class="checkout">checkout</a></div>
        </li>
    </ul>
</template>

<script>
export default {
    computed:{
        cart(){
            return this.$store.getters.cart;
        },
    },
    name: "CartPopup"
}
</script>