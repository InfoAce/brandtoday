<template>
	<div id="header" class="app-header">
		<!-- BEGIN mobile-toggler -->
		<div class="mobile-toggler">
			<button type="button" class="menu-toggler" @click="toggleAppSidebarMobileToggled">
				<span class="bar"></span>
				<span class="bar"></span>
			</button>
		</div>
		<!-- END mobile-toggler -->
		
		<!-- BEGIN brand -->
		<div class="brand">
			<div class="desktop-toggler">
				<button type="button" class="menu-toggler" @click="toggleAppSidebarMinify">
					<span class="bar"></span>
					<span class="bar"></span>
				</button>
			</div>
			
			<a href="#" class="brand-logo">
				<i class="fa fa-laptop"></i>
				<!-- <img src="/assets/img/logo.png" alt="" height="20" /> -->
			</a>
		</div>
		<!-- END brand -->
		
		<!-- BEGIN menu -->
		<div class="menu">
			<form class="menu-search" name="header_search_form">
				<div class="menu-search-icon"><i class="fa fa-search"></i></div>
				<div class="menu-search-input">
					<input type="text" class="form-control" placeholder="Search menu..." />
				</div>
			</form>
			<div class="menu-item dropdown">
				<a href="#" data-bs-toggle="dropdown" data-display="static" class="menu-link">
					<div class="menu-icon"><i class="fa fa-bell nav-icon"></i></div>
					<div class="menu-label">3</div>
				</a>
				<div class="dropdown-menu dropdown-menu-end dropdown-notification">
					<h6 class="dropdown-header text-dark mb-1">Notifications</h6>
					<template v-if="notificationData && notificationData.length > 0">
						<a href="#" class="dropdown-notification-item" v-for="(notification, index) in notificationData" v-bind:key="index">
							<div class="dropdown-notification-icon">
								<i v-if="notification.icon" v-bind:class="notification.icon"></i>
								<img v-if="notification.img" v-bind:src="notification.img" width="26" />
							</div>
							<div class="dropdown-notification-info">
								<div class="title">{{ notification.title }}</div>
								<div class="time">{{ notification.time }}</div>
							</div>
							<div class="dropdown-notification-arrow">
								<i class="fa fa-chevron-right"></i>
							</div>
						</a>
					</template>
					<template v-else>
						<div class="dropdown-notification-item bg-white">
							No record found
						</div>
					</template>
					<div class="p-2 text-center mb-n1">
						<a href="#" class="text-dark text-opacity-50 text-decoration-none">See all</a>
					</div>
				</div>
			</div>
			<div class="menu-item dropdown">
				<a href="#" data-bs-toggle="dropdown" data-display="static" class="menu-link">
					<div class="menu-img online">
						<i class="fa fa-user"></i>
					</div>
					<div class="menu-text">johnsmith@vuestudio.com</div>
				</a>
				<div class="dropdown-menu dropdown-menu-end me-lg-3">
					<RouterLink to="/profile" class="dropdown-item d-flex align-items-center">Edit Profile <i class="fa fa-user-circle fa-fw ms-auto text-gray-400 fs-16px"></i></RouterLink>
					<RouterLink to="/email/inbox" class="dropdown-item d-flex align-items-center">Inbox <i class="fa fa-envelope fa-fw ms-auto text-gray-400 fs-16px"></i></RouterLink>
					<RouterLink to="/calendar" class="dropdown-item d-flex align-items-center">Calendar <i class="fa fa-calendar-alt fa-fw ms-auto text-gray-400 fs-16px"></i></RouterLink>
					<RouterLink to="/settings" class="dropdown-item d-flex align-items-center">Setting <i class="fa fa-wrench fa-fw ms-auto text-gray-400 fs-16px"></i></RouterLink>
					<div class="dropdown-divider"></div>
					<RouterLink to="/page/login" class="dropdown-item d-flex align-items-center">Log Out <i class="fa fa-toggle-off fa-fw ms-auto text-gray-400 fs-16px"></i></RouterLink>
				</div>
			</div>
		</div>
		<!-- END menu -->
	</div>
</template>
<script lang="ts">
import { mapGetters } from 'vuex';
export default {
    computed:{
        ...mapGetters([
            'appOptions'
        ])
    },
    data(){
        return {
            notificationData:[
                {
                    icon: 'fa fa-receipt fa-lg fa-fw text-success',
                    title: 'Your store has a new order for 2 items totaling $1,299.00',
                    time: 'just now'
                },{
                    icon: 'far fa-user-circle fa-lg fa-fw text-muted',
                    title: '3 new customer account is created',
                    time: '2 minutes ago'
                },{
                    img: '/assets/img/icon/android.svg',
                    title: 'Your android application has been approved',
                    time: '5 minutes ago'
                },{
                    img: '/assets/img/icon/paypal.svg',
                    title: 'Paypal payment method has been enabled for your store',
                    time: '10 minutes ago'
                }
            ]
        }
    } 
}
</script>