<template>
<form class="theme-form">
    <div class="form-row row">
        <div class="col-md-12">
            <div class="media">
                <label>Rating</label>
                <div class="media-body ms-3">
                    <div class="rating three-star"><i class="fa fa-star"></i> <i
                            class="fa fa-star"></i> <i class="fa fa-star"></i> <i
                            class="fa fa-star"></i> <i class="fa fa-star"></i></div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <label for="name">Name</label>
            <input type="text" class="form-control" id="name" placeholder="Enter Your name"
                required>
        </div>
        <div class="col-md-6">
            <label for="email">Email</label>
            <input type="text" class="form-control" id="email" placeholder="Email" required>
        </div>
        <div class="col-md-12">
            <label for="review">Review Title</label>
            <input type="text" class="form-control" id="review"
                placeholder="Enter your Review Subjects" required>
        </div>
        <div class="col-md-12">
            <label for="review">Review Title</label>
            <textarea class="form-control" placeholder="Wrire Your Testimonial Here"
                id="exampleFormControlTextarea1" rows="6"></textarea>
        </div>
        <div class="col-md-12">
            <button class="btn btn-solid" type="submit">Submit YOur
                Review</button>
        </div>
    </div>
</form>
</template>
<script setup>

</script>