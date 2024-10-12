import { createRouter, createWebHistory, RouterView  } from 'vue-router'
import { debounce, isEmpty, get } from 'lodash';
import store from '../stores';

const router = createRouter({
  history: createWebHistory(get(store,'BASE_URL')),
  routes: [
      {
          beforeEnter(to,from,next){
          if( !isEmpty(store.getters.auth) ){
              next({ name: 'Overview' });
          }

          if( isEmpty(store.getters.auth) ){
              next();
          }
          },
          path: '/login',
          name: "AdminLogin",
          meta: {
            title: 'Login',
            state: 1,
            auth:  false,
            redirectIfAuth: true,
            admin: true
          },
          component: () => import('@/views/Login.vue')
      }, 
      {
          path: '/verify',
          children:[
          {
              path: '',
              redirect: '/dashboard/verify/error'
          },
          {
              path: ':token',
              name: 'VerifyAccount',
              meta: {
                title: 'Verify Account',
                auth:  false,
                state: 0,
                redirectIfAuth: false,
                admin: true
              },
              component: () => import('@/views/VerifyAccount.vue')
          },
          {
              path: 'error',
              name: "VerifyError404",
              meta: {
                title: 'Not Found',
                auth:  false,
                redirectIfAuth: false,
                state: 0,
                admin: false
              },
              component: () => import('@/views/VerifyError.vue')
          },
          ],
          component: RouterView
      },      
      {
          beforeEnter(to,from,next){
          if( !isEmpty(store.getters.auth) ){
              next();
          }

          if( isEmpty(store.getters.auth) ){
              next({ name: 'AdminLogin'});
          }
          },
          path:'/',
          children: [
          {
              beforeEnter(to,from,next){
              next();
              },
              path: '',
              name: "Overview",
              meta: {
                title:     'Overview',
                auth:  true,
                redirectIfAuth: false,
                state: 1,
                admin: true
              },
              component: () => import('@/views/Overview.vue')
          },      
          {
              path: 'clients',
              name: "Clients",
              meta: {
                title: 'Clients',
                auth:  true,
                state: 1,
                redirectIfAuth: false,
                admin: true
              },
              component: () => import('@/views/Clients.vue')
          },
          {
              path: 'orders',
              name: "Orders",
              meta: {
                title: 'Orders',
                auth:  true,
                redirectIfAuth: false,
                state: 1,
                admin: true
              },
              component: () => import('@/views/Orders.vue')
          },
          {
            path: 'categories',
            name: "Categories",
            meta: {
              title: 'Categories',
              auth:  true,
              redirectIfAuth: false,
              state: 1,
              admin: true
            },
            component: () => import('@/views/Categories.vue')
        },
          {
              path: 'staff',
              name: "Staff",
              meta: {
                title: 'Staff Members',
                auth:  true,
                state: 2,
                redirectIfAuth: false,
                admin: true
              },
              component: () => import('@/views/Staff.vue')
          },
          {
              path: 'company',
              name: "Company",
              meta: {
                title: 'Company',
                auth:  true,
                state: 2,
                redirectIfAuth: false,
                admin: true
              },
              component: () => import('@/views/Company.vue')
          },
          {
              path: 'queues',
              name: "Queues",
              meta: {
                title: 'Queues',
                auth:  true,
                state: 2,
                redirectIfAuth: false,
                admin: true
              },
              component: () => import('@/views/Queues.vue')
          },
          {
              path: 'website',
              name: "Website",
              meta: {
                title: 'Website Setup',
                auth:  true,
                state: 2,
                redirectIfAuth: false,
                admin: true
              },
              component: () => import('@/views/Website.vue')
          },        
          {
              path: 'profile',
              name: "Profile",
              meta: {
                title: 'Profile',
                auth:  true,
                state: 1,
                redirectIfAuth: false,
                admin: true
              },
              component: () => import('@/views/Profile.vue')
          },       
          {
              path: 'system',
              name: "System",
              meta: {
                title: 'System',
                auth:  true,
                state: 3,
                redirectIfAuth: false,
                admin: true
              },
              component: () => import('@/views/System.vue')
          },
          ],
          component: () => import('@/App.vue')
      }                                  
    ]
});

router.beforeEach( 
  (to, from, next) => {
    const { name: routeName, meta: { auth, state, landing, admin, redirectIfAuth } } = to;

    window.document.querySelector('title').innerHTML = `${to.meta.title} | ${import.meta.env.VITE_APP_NAME}`;
        
    if( auth ){
      if( isEmpty(store.getters.auth) && routeName == 'Login' ){ next({ name: 'Login' }) }
      next();
    }

    if( !auth ){
      if( !isEmpty(store.getters.auth) && routeName == 'Login' ){  next({ name: 'Overview' }) }
      next();
    }
  }
);

router.afterEach(
  debounce((to, from) => {
  store.commit('loader',false);
  window.scrollTo({top: 0, behavior: 'smooth'});  
},1000))

/**
 * Function to check the role of the user and navigate to the appropriate route.
 *
 * @param {Object} to - The route object to navigate to.
 * @param {Function} next - The next function to call.
 * @return {void}
 */
const checkRole = (to:any,next: any) => {
  const auth = store.getters.auth;
  
  // Extract the role state from the authenticated user
  const { role: { state: roleState } }   = get(store.getters.auth,'user');

  // Extract the route name and state from the route object
  const { name: route, meta: { state } } = to;

  // Based on the route, navigate to the appropriate page
  switch(route){
    // If the route is 'Login' or 'Signup', navigate to the 'Home' page
    case 'Login':
    case 'Signup':
      next({name:"Home"});
    break;
    // If the route is 'AdminLogin', navigate to the 'Overview' page
    case 'AdminLogin':
      next({name:"Overview"});
    break;
    // For all other routes, check if the user's role state is greater than or equal to the required state
    default:
      if( roleState >= state ){
        next();
      } else {
        // If not, navigate to the 'Forbidden' page
        next({name:"Forbidden"})
      }
  }

}


export default router
