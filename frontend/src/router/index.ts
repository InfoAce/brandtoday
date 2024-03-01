import { createRouter, createWebHistory, RouterView  } from 'vue-router'
import { isEmpty } from 'lodash';
import store from '../stores';

const router = createRouter({
  history: createWebHistory(import.meta.BASE_URL),
  routes: [
    {
      path: '/',
      children:[
        {
          path: 'login',
          name: "Login",
          meta: {
            title:     'Login',
            auth: false,
          },
          component: () => import('@/views/dashboard/Login.vue')
        },
        {
          path: '',
          name: "Overview",
          meta: {
            title:     'Overview',
            auth:  true,
            state: 0
          },
          component: () => import('@/views/dashboard/Overview.vue')
        },      
        {
          path: 'clients',
          name: "Clients",
          meta: {
            title: 'Clients',
            auth:  true,
            state: 1
          },
          component: () => import('@/views/dashboard/Clients.vue')
        },
        {
          path: 'products',
          name: "Products",
          meta: {
            title: 'Products',
            auth:  true,
            state: 1
          },
          component: () => import('@/views/dashboard/Products.vue')
        },
        {
          path: 'orders',
          name: "Orders",
          meta: {
            title: 'Orders',
            auth:  true,
            state: 1
          },
          component: () => import('@/views/dashboard/Orders.vue')
        },
        {
          path: 'staff',
          name: "Staff",
          meta: {
            title: 'Staff Members',
            auth:  true,
            state: 2
          },
          component: () => import('@/views/dashboard/Staff.vue')
        },
        {
          path: 'company',
          name: "Company",
          meta: {
            title: 'Company',
            auth:  true,
            state: 2
          },
          component: () => import('@/views/dashboard/Company.vue')
        },        
        {
          path: 'profile',
          name: "Profile",
          meta: {
            title: 'Profile',
            auth:  true,
            state: 0
          },
          component: () => import('@/views/dashboard/Profile.vue')
        },       
        {
          path: 'system',
          name: "System",
          meta: {
            title: 'System',
            auth:  true,
            state: 3
          },
          component: () => import('@/views/dashboard/System.vue')
        }                                      
      ],
      component: () => import('@/views/layouts/Dashboard.vue')
    }
  ]
});

router.beforeEach( (to, from, next) => {
  const { name: routeName, meta: { auth, state } } = to;
  store.commit('loader',true);
  window.document.querySelector('title').innerHTML = `${to.meta.title} | ${import.meta.env.VITE_APP_NAME}`;
  window.scrollTo({top: 0, behavior: 'smooth'});
  switch( !isEmpty(store.getters.authUser) ){
    case true:
      if( routeName == "Login"){
        next({name:"Overview"});
      } else {
        const { getters: { authUser:{ role: { name: roleName, state: roleState } } } } = store;
        if( roleState >= state ){
          next();
        } else {
          next({name:"Forbidden"})
        }
      }   
    break;
    case false:
      // store.commit('auth',{});
      if( auth && to.name != "Login" ){
        router.push({ name: "Login" });
      }
      next();
    break;
  }

});

router.afterEach((to, from,failure) => {
  store.commit('loader',false);
})


export default router
