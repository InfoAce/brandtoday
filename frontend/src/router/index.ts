import { createRouter, createWebHistory, RouterView  } from 'vue-router'
import { debounce, isEmpty, get } from 'lodash';
import store from '../stores';

const router = createRouter({
  history: createWebHistory(get(store,'BASE_URL')),
  routes: [
    {
      path: '/',
      name: "Home",
      meta: {
        title: 'Home',
        auth: false,

        
        
      },
      component: () => import('@/views/Index.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: "Error404",
      meta: {
        title: 'Not Found',
        auth: false,

        
        
      },
      component: () => import('@/views/Error404.vue')
    },
    {
      path: '/auth',
      component: RouterView ,
      children: [
        {
          path: 'login',
          name: "Login",
          meta: {
            title: 'Login',
            auth:   false,
            redirectIfAuth: true,
            
            
          },
          component: () => import('@/views/Login.vue')
        },
        {
          path: 'password',
          children: [
            {
              path: 'forgot',
              name: "ForgotPassword",
              meta: {
                title: 'Forgot Password',
                auth:   false,
                redirectIfAuth: true,
                
                
              },
              component: () => import('@/views/Forgot.vue')
            },
            {
              path: ':code/reset',
              name: "Reset Password",
              meta: {
                title: 'Reset Password',
                auth:   false,
                redirectIfAuth: true,
                
                
              },
              component: () => import('@/views/Reset.vue')
            },
            // {
            //   path: ':pathMatch(.*)*',
            //   name: "TokenNotFound",
            //   meta: {
            //     title: 'Token Not Found',
            //     auth: false,
            //     redirectIfAuth: false,
            //     
            //     
            //   },
            //   component: () => import('@/views/Error404.vue')
            // },
          ],
          component: RouterView
        },
        {
          path: 'signup',
          name: "Signup",
          meta: {
            title: 'Signup',
            auth: false,
            
            redirectIfAuth: true,
            
          },
          component: () => import('@/views/Signup.vue')
        },  
      ],
    },
    {
      path: '/about-us',
      name: "AboutUs",
      meta: {
        title: 'Get to Know Us',
        auth:   false,

        
        
      },
      component: () => import('@/views/AboutUs.vue')
    },
    {
      path: '/privacy-policy',
      name: "PrivacyPolicy",
      meta: {
        title: 'Privacy Policy',
        auth:   false,

        
        
      },
      component: () => import('@/views/PrivacyPolicy.vue')
    },
    {
      path: '/faqs',
      name: "Faqs",
      meta: {
        title: 'FAQs',
        auth:   false,

        
        
      },
      component: () => import('@/views/Faqs.vue')
    },
    {
      path: '/brands',
      name: "Brands",
      meta: {
        title: 'Brands',
        auth:   false,

        
        
      },
      component: () => import('@/views/Brands.vue')
    },
    {
      path: '/return-refunds',
      name: "ReturnRefunds",
      meta: {
        title: 'Return Refunds',
        auth:   false,

        
        
      },
      component: () => import('@/views/ReturnRefunds.vue')
    }, 
    {
      path: '/terms-conditions',
      name: "TermsAndConditions",
      meta: {
        title: 'Terms & Conditions',
        auth:   false,

        
        
      },
      component: () => import('@/views/TermsAndConditions.vue')
    }, 
    {
      path: '/brands',
      name: "Brands",
      meta: {
        title: 'Our Brands',
        auth:  false,

        state: 0,
        
      },
      component: () => import('@/views/Brands.vue')
    },  
    {
      path: '/category',
      children: [
        {
          path: ':category',
          name: "Category",
          meta: {
            title: 'Product Category',
            auth:  false,
    
            state: 0,
            
          },
          component: () => import('@/views/Category.vue')
        },
        {
          path: ':pathMatch(.*)*',
          name: "Error404",
          meta: {
            title: 'Not Found',
            auth: false,
    
            
            
          },
          component: () => import('@/views/Error404.vue')
        }, 
      ],
      component: RouterView
    },          
    {
      path: '/shopping',
      children: [
        {
          path: 'cart',
          name: "Cart",
          meta: {
            title: 'Cart',
            auth:   false,
    
            
            
          },
          component: () => import('@/views/Cart.vue')
        },  
        {
          path:'checkout',
          children: [
            {
              path: '',
              name: "Checkout",
              meta: {
                title: 'Checkout',
                auth:   false,
        
                
                
              },
              component: () => import('@/views/Checkout.vue')
            },
            {
              path: ':order/success',
              name: "OrderSuccess",
              meta: {
                title: 'Order Success',
                auth:   false,
        
                
                
              },
              component: () => import('@/views/OrderSuccess.vue')
            },
          ],
          component: RouterView
        }               
      ],
      component: RouterView
    },         
    {
      path: '/products',
      children: [
        {
          path: '',
          name: "ViewProducts",
          meta: {
            title: 'Products',
            auth:   false,        
          },
          component: () => import('@/views/Products.vue')
        },
        {
          path: ':category',
          children:[
            {
              path: ':sub_category',
              name: "Products",
              meta: {
                title: 'Products',
                auth: false,
              },
              component: () => import('@/views/Products.vue')
            }
          ],
          component: RouterView
        },
        {
          path: 'view/:product',
          name: "Product",
          meta: {
            title: 'Product',
            auth:   false,        
          },
          component: () => import('@/views/Product.vue')
        },
      ]
    },   
    {
      path: '/verify',
      children: [
        {
          path: 'email/:token',
          name: "VerifyEmail",
          meta: {
            title: 'Email Verification',
            auth: false,
            
    
            
          },
          component: () => import('@/views/Verify.vue')
        }
      ],
      component: RouterView
    },  
    {
      path: '/account',
      children: [
        {
          path: 'profile',
          name: "AccountProfile",
          meta: {
            title: 'Account Profile',
            auth: true,
            
    
            
          },
          component: () => import('@/views/Account.vue')
        },
        {
          path: 'orders',
          name: "AccountOrders",
          meta: {
            title: 'Client Orders',
            auth: true,
            
    
            
          },
          component: () => import('@/views/Orders.vue')
        },
        {
          path: 'addresses',
          name: "AddressBook",
          meta: {
            title: 'Address Book',
            auth:   true,
    
            
          },
          component: () => import('@/views/AddressBook.vue')
        },
        {
          path: 'favourites',
          name: "AccountFavourites",
          meta: {
            title: 'Favourites',
            auth: true,
    
          },
          component: () => import('@/views/Favourites.vue')
        },
        {
          path: 'security',
          name: "AccountSecurity",
          meta: {
            title: 'Client Security',
            auth: true,
    
          },
          component: () => import('@/views/Security.vue')
        }
      ],
      component: () => import('@/views/Profile.vue')
    },  
  ]
});

router.beforeEach( 
  (to, from, next) => {
    store.commit('loader',true);
    const { name: routeName, meta: { auth } } = to;

    if( window.document.getElementById("mySidenav")?.classList.contains('open-side') ){
      window.document.getElementById("mySidenav").classList.remove('open-side')
    }

    window.document.querySelector('title').innerHTML = `${to.meta.title} | ${import.meta.env.VITE_APP_NAME}`;

    if( auth ){
      if( isEmpty(store.getters.auth) ){ next({ name: 'Login' }) }
      if( !isEmpty(store.getters.auth) ){ next(); }
    }

    if( !auth ){
      if( !isEmpty(store.getters.auth) && routeName == 'Login' ){  next({ name: 'Home' }) }
      if( !isEmpty(store.getters.auth) && routeName == 'Signup' ){ next({ name: 'Home' }) }
      next();
    }

  }
);

router.afterEach(
  debounce((to, from) => {
    $('.category_submenu').not('.hidden').addClass('hidden')
    store.commit('loader',false);
    window.scrollTo({top: 0, behavior: 'smooth'});  
},500))

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
