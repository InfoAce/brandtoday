<template>
    <div>
        <!-- breadcrumb start -->
        <div class="breadcrumb-section">
            <div class="container">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="page-title">
                            <h2>404 page</h2>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <nav aria-label="breadcrumb" class="theme-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">404 page</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <!-- breadcrumb End -->


        <!-- section start -->
        <section class="p-0">
            <div class="container">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="error-section">
                            <h1>404</h1>
                            <h2>page not found</h2>
                            <router-link to="/" class="btn btn-solid">back to home</router-link >
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- Section ends -->

    </div>
</template>