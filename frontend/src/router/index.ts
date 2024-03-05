import { createRouter, createWebHistory, RouterView  } from 'vue-router'
import { isEmpty } from 'lodash';
import store from '../stores';
import { useHead } from '@unhead/vue';
import { theme } from '../config';
import { loadScript } from "vue-plugin-load-script";

const router = createRouter({
  history: createWebHistory(import.meta.BASE_URL),
  routes: [
    {
      path: '',
      redirect: '/home'
    },
    {
      path: '/home',
      component: () => import('@/views/layouts/Landing.vue'),
      children: [
        {
          path: '',
          name: "Home",
          meta: {
            title: 'Home',
            auth: false,
            landing: true
          },
          component: () => import('@/views/home/Index.vue')
        },
        {
          path: ':pathMatch(.*)*',
          name: "Error404",
          meta: {
            title: 'Not Found',
            auth: false,
            landing: true
          },
          component: () => import('@/views/home/Error404.vue')
        }, 
        {
          path: 'login',
          name: "Login",
          meta: {
            title: 'Login',
            auth: false,
            landing: true
          },
          component: () => import('@/views/home/Login.vue')
        },     
        {
          path: 'products',
          children: [
            {
              path: ':category?',
              name: "Products",
              meta: {
                title: 'Products',
                auth: false,
                landing: true
              },
              component: () => import('@/views/home/Products.vue')
            },
          ]
        },   
        {
          path: 'signup',
          name: "Signup",
          meta: {
            title: 'Signup',
            auth: false,
            landing: true
          },
          component: () => import('@/views/home/Signup.vue')
        },  
        {
          path: 'verify',
          children: [
            {
              path: 'email/:token',
              name: "VerifyEmail",
              meta: {
                title: 'Email Verification',
                auth: false,
                landing: true
              },
              component: () => import('@/views/home/Verify.vue')
            }
          ],
          component: RouterView
        },  
        {
          path: 'account',
          children: [
            {
              path: 'profile',
              name: "AccountProfile",
              meta: {
                title: 'Account Profile',
                auth: false,
                landing: true
              },
              component: () => import('@/views/home/Account.vue')
            },
            {
              path: 'orders',
              name: "AccountOrders",
              meta: {
                title: 'Client Orders',
                auth: false,
                landing: true
              },
              component: () => import('@/views/home/Orders.vue')
            },
            {
              path: 'favourites',
              name: "AccountFavourites",
              meta: {
                title: 'Favourites',
                auth: false,
                landing: true
              },
              component: () => import('@/views/home/Favourites.vue')
            },
            {
              path: 'cards',
              name: "AccountCards",
              meta: {
                title: 'Cards',
                auth: false,
                landing: true
              },
              component: () => import('@/views/home/Cards.vue')
            },
            {
              path: 'security',
              name: "AccountSecurity",
              meta: {
                title: 'Client Security',
                auth: false,
                landing: true
              },
              component: () => import('@/views/home/Security.vue')
            }
          ],
          component: () => import('@/views/home/Profile.vue')
        },  
      ]
    },
    {
      path: '/dashboard',
      children:[
        {
          path: 'login',
          name: "AdminLogin",
          meta: {
            title: 'Login',
            state: 1,
            auth:  false,
          },
          component: () => import('@/views/dashboard/Login.vue')
        },
        {
          path: '',
          name: "Overview",
          meta: {
            title:     'Overview',
            auth:  true,
            state: 1
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
            state: 1
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
  const { name: routeName, meta: { auth, state, landing } } = to;
  store.commit('loader',true);
  window.document.querySelector('title').innerHTML = `${to.meta.title} | ${import.meta.env.VITE_APP_NAME}`;
  window.scrollTo({top: 0, behavior: 'smooth'});
  switch( !isEmpty(store.getters.authUser) ){
    case true:
      // if( routeName == "Login"){
      // } else {
      //   const { getters: { authUser:{ role: { name: roleName, state: roleState } } } } = store;
      //   if( roleState >= state ){
      //     next();
      //   } else {
      //     next({name:"Forbidden"})
      //   }
      // }  
      checkRole(to,next);
    break;
    case false:
      // store.commit('auth',{});
      if( auth && to.name != "Login" ){
        router.push({ name: "Login" });
      }
      next();
    break;
  }

  if( landing ){
    useHead(theme);
    [
      '/assets/js/jquery-3.3.1.min.js',
      '/assets/js/jquery-ui.min.js',
    ].forEach( async(url) => {
      await loadScript(url);
    })    
  }

});

router.afterEach((to, from,failure) => {
  store.commit('loader',false);
  if( window.document.getElementById("mySidenav")?.classList.contains('open-side') ){
    window.document.getElementById("mySidenav").classList.remove('open-side')
  }
})

const checkRole = (to:any,next: any) => {
  const { role: { state: roleState } } = store.getters.authUser, { name: route, meta: { state } } = to;
  switch(route){
    case 'Login':
    case 'Signup':

    break;
    case 'AdminLogin':
      next({name:"Overview"});
    break;
    default:
      if( roleState >= state ){
        next();
      } else {
        next({name:"Forbidden"})
      }
  }
  // if( routeName == "Login"){
  //   checkRole(to,next);
  // } else {
  //   const { getters: { authUser:{ role: { name: roleName, state: roleState } } } } = store;
  //   if( roleState >= state ){
  //     next();
  //   } else {
  //     next({name:"Forbidden"})
  //   }
  // }    
  switch(state){
    case 1:
    case 2:
      next({name:"Overview"});
    break;
    default: 
      next({name:"Home"});
  }
}


export default router
