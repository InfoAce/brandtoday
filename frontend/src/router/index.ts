import { createRouter, createWebHistory, RouterView  } from 'vue-router'
import { isEmpty } from 'lodash';
import store from '../stores';

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
            state:  0,
            admin: false
          },
          component: () => import('@/views/home/Index.vue')
        },
        {
          path: ':pathMatch(.*)*',
          name: "Error404",
          meta: {
            title: 'Not Found',
            auth: false,
            state:  0,
            admin: false
          },
          component: () => import('@/views/home/Error404.vue')
        }, 
        {
          path: 'login',
          name: "Login",
          meta: {
            title: 'Login',
            auth:   false,
            state:  0,
            admin: false
          },
          component: () => import('@/views/home/Login.vue')
        }, 
        {
          path: 'shopping',
          children: [
            {
              path: 'cart',
              name: "Cart",
              meta: {
                title: 'Cart',
                auth:   false,
                state:  0,
                admin: false
              },
              component: () => import('@/views/home/Cart.vue')
            },  
            {
              path: 'checkout',
              name: "Checkout",
              meta: {
                title: 'Checkout',
                auth:   true,
                state:  0,
                admin: false
              },
              component: () => import('@/views/home/Checkout.vue')
            },                
          ],
          component: RouterView
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
                state:  0,
                admin: false
              },
              component: () => import('@/views/home/Products.vue')
            },
            {
              path: 'view/:product',
              name: "Product",
              meta: {
                title: 'Product',
                auth:   false,
                state:  0,
                admin: false
              },
              component: () => import('@/views/home/Product.vue')
            },
          ]
        },   
        {
          path: 'signup',
          name: "Signup",
          meta: {
            title: 'Signup',
            auth: false,
            state:  0,
            admin: false
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
                state:  0,
                admin: false
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
                auth: true,
                state:  0,
                admin: false
              },
              component: () => import('@/views/home/Account.vue')
            },
            {
              path: 'orders',
              name: "AccountOrders",
              meta: {
                title: 'Client Orders',
                auth: true,
                state:  0,
                admin: false
              },
              component: () => import('@/views/home/Orders.vue')
            },
            {
              path: 'favourites',
              name: "AccountFavourites",
              meta: {
                title: 'Favourites',
                auth: true,
                state:  0,
                admin: false
              },
              component: () => import('@/views/home/Favourites.vue')
            },
            {
              path: 'cards',
              name: "AccountCards",
              meta: {
                title: 'Cards',
                auth: true,
                state:  0,
                admin: false
              },
              component: () => import('@/views/home/Cards.vue')
            },
            {
              path: 'security',
              name: "AccountSecurity",
              meta: {
                title: 'Client Security',
                auth: true,
                state:  0,
                admin: false
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
      beforeEnter(to,from,next){
        addTheme(); next();
      },
      children:[
        {
          path: 'login',
          name: "AdminLogin",
          meta: {
            title: 'Dashboard Login',
            state: 1,
            auth:  false,
            admin: true
          },
          component: () => import('@/views/dashboard/Login.vue')
        },
        {
          path: '',
          name: "Overview",
          meta: {
            title:     'Overview',
            auth:  true,
            state: 1,
            admin: true
          },
          component: () => import('@/views/dashboard/Overview.vue')
        },      
        {
          path: 'clients',
          name: "Clients",
          meta: {
            title: 'Clients',
            auth:  true,
            state: 1,
            admin: true
          },
          component: () => import('@/views/dashboard/Clients.vue')
        },
        {
          path: 'orders',
          name: "Orders",
          meta: {
            title: 'Orders',
            auth:  true,
            state: 1,
            admin: true
          },
          component: () => import('@/views/dashboard/Orders.vue')
        },
        {
          path: 'staff',
          name: "Staff",
          meta: {
            title: 'Staff Members',
            auth:  true,
            state: 2,
            admin: true
          },
          component: () => import('@/views/dashboard/Staff.vue')
        },
        {
          path: 'company',
          name: "Company",
          meta: {
            title: 'Company',
            auth:  true,
            state: 2,
            admin: true
          },
          component: () => import('@/views/dashboard/Company.vue')
        },        
        {
          path: 'profile',
          name: "Profile",
          meta: {
            title: 'Profile',
            auth:  true,
            state: 1,
            admin: true
          },
          component: () => import('@/views/dashboard/Profile.vue')
        },       
        {
          path: 'system',
          name: "System",
          meta: {
            title: 'System',
            auth:  true,
            state: 3,
            admin: true
          },
          component: () => import('@/views/dashboard/System.vue')
        },
        {
          path: 'verify',
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
                admin: true
              },
              component: () => import('@/views/dashboard/VerifyAccount.vue')
            },
            {
              path: 'error',
              name: "VerifyError404",
              meta: {
                title: 'Not Found',
                auth:  false,
                state: 0,
                admin: false
              },
              component: () => import('@/views/dashboard/VerifyError.vue')
            },
          ],
          component: RouterView
        }                                    
      ],
      component: () => import('@/views/layouts/Dashboard.vue')
    }
  ]
});

router.beforeEach( (to, from, next) => {
  const { name: routeName, meta: { auth, state, landing, admin } } = to;
  store.commit('loader',true);
  window.document.querySelector('title').innerHTML = `${to.meta.title} | ${import.meta.env.VITE_APP_NAME}`;
  window.scrollTo({top: 0, behavior: 'smooth'});

  switch( !isEmpty(store.getters.authUser) ){
    case true:
      checkRole(to,next);
    break;
    case false:

      if( admin && auth ){
        router.push({ name: "AdminLogin" });
      }

      if( !admin && auth && to.name != "Login" ){
        router.push({ name: "Login" });
      }
      
      next();
    break;
  }

});

router.afterEach((to, from,failure) => {
  store.commit('loader',false);
  if( window.document.getElementById("mySidenav")?.classList.contains('open-side') ){
    window.document.getElementById("mySidenav").classList.remove('open-side')
  }
})

const checkRole = (to:any,next: any) => {
  const { 
    authToken,
    authUser: { role: { state: roleState } } 
  } = store.getters, 
  { 
    name: route, 
    meta: { state } 
  } = to;
  console.log(authToken);
  switch(route){
    case 'Login':
    case 'Signup':
      next({name:"Home"});
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
  // switch(state){
  //   case 1:
  //   case 2:
  //     next({name:"Overview"});
  //   break;
  //   default: 
  //     next({name:"Home"});
  // }
}

const addTheme = () => {

  const scripts = [
    '/assets/dashboard/js/sidebar-menu.js',
    '/assets/dashboard/js/lazysizes.min.js',
    '/assets/dashboard/js/admin-customizer.js',
    '/assets/dashboard/js/default.js',
    '/assets/dashboard/js/jquery.dataTables.min.js',
    '/assets/dashboard/js/admin-script.js'	
  ].map( 
    async (url) => new Promise( 
      resolve => setTimeout( async() => resolve(addScript(url)),150)
    ) 
  );

  [
    '/assets/dashboard/css/vendors/font-awesome.css',
    '/assets/dashboard/css/vendors/themify-icons.css',
    '/assets/dashboard/css/vendors/slick.css',
    '/assets/dashboard/css/vendors/slick-theme.css',
    '/assets/dashboard/css/vendors/flag-icon.css',
    '/assets/dashboard/css/vendors/prism.css',
    '/assets/dashboard/css/vendors/bootstrap.css',
    '/assets/dashboard/css/style.css',
  ].forEach( (url) => {
    let link   = document.createElement('link');
    link.rel   = 'stylesheet';
    link.href  = url;
    document.head.appendChild(link);
  });

  const addScript = (url:string) => {
    let script    = document.createElement('script');
    script.type   = 'text/javascript';
    script.src    = url;
    document.body.appendChild(script);
  }

  Promise.all(scripts);

}

export default router
