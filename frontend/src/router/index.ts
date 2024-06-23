import { createRouter, createWebHistory, RouterView  } from 'vue-router'
import { debounce, isEmpty, get } from 'lodash';
import store from '../stores';

const router = createRouter({
  history: createWebHistory(get(store,'BASE_URL')),
  routes: [
    {
      path: '',
      redirect: '/home'
    },
    {
      path: '/home',
      beforeEnter(to,from,next){
        addHomeTheme(); next();
      },
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
          path: 'about-us',
          name: "AboutUs",
          meta: {
            title: 'Get to Know Us',
            auth:   false,
            state:  0,
            admin: false
          },
          component: () => import('@/views/home/AboutUs.vue')
        },
        {
          path: 'privacy-policy',
          name: "PrivacyPolicy",
          meta: {
            title: 'Privacy Policy',
            auth:   false,
            state:  0,
            admin: false
          },
          component: () => import('@/views/home/PrivacyPolicy.vue')
        },
        {
          path: 'return-refunds',
          name: "ReturnRefunds",
          meta: {
            title: 'Return Refunds',
            auth:   false,
            state:  0,
            admin: false
          },
          component: () => import('@/views/home/ReturnRefunds.vue')
        }, 
        {
          path: 'terms-conditions',
          name: "TermsAndConditions",
          meta: {
            title: 'Terms & Conditions',
            auth:   false,
            state:  0,
            admin: false
          },
          component: () => import('@/views/home/TermsAndConditions.vue')
        }, 
        {
          path: 'brands',
          name: "Brands",
          meta: {
            title: 'Our Brands',
            auth:  false,
            state: 0,
            admin: false
          },
          component: () => import('@/views/home/Brands.vue')
        },  
        {
          path: 'category',
          children: [
            {
              path: ':category',
              name: "Category",
              meta: {
                title: 'Product Category',
                auth:  false,
                state: 0,
                admin: false
              },
              component: () => import('@/views/home/Category.vue')
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
          ],
          component: RouterView
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
              path:'checkout',
              children: [
                {
                  path: '',
                  name: "Checkout",
                  meta: {
                    title: 'Checkout',
                    auth:   false,
                    state:  0,
                    admin:  false
                  },
                  component: () => import('@/views/home/Checkout.vue')
                },
                {
                  path: ':order/success',
                  name: "OrderSuccess",
                  meta: {
                    title: 'Order Success',
                    auth:   false,
                    state:  0,
                    admin:  false
                  },
                  component: () => import('@/views/home/OrderSuccess.vue')
                },
              ],
              component: RouterView
            }               
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
              path: 'addresses',
              name: "AddressBook",
              meta: {
                title: 'Address Book',
                auth:   true,
                state:  0,
                admin:  false
              },
              component: () => import('@/views/home/AddressBook.vue')
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
        addDashbordTheme(); next();
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
          path: 'website',
          name: "Website",
          meta: {
            title: 'Website Setup',
            auth:  true,
            state: 2,
            admin: true
          },
          component: () => import('@/views/dashboard/Website.vue')
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

router.beforeEach( 
  debounce(
    (to, from, next) => {
      const { name: routeName, meta: { auth, state, landing, admin } } = to;
      store.commit('loader',true);
      
      if( window.document.getElementById("mySidenav")?.classList.contains('open-side') ){
        window.document.getElementById("mySidenav").classList.remove('open-side')
      }
      
      window.document.querySelector('title').innerHTML = `${to.meta.title} | ${import.meta.env.VITE_APP_NAME}`;
          
      switch( !isEmpty(store.getters.auth) ){
        case true:    
          checkRole(to,next);        
        break;
        case false:
          if( admin && auth ){ router.push({ name: "AdminLogin" }); }
          if( !admin && auth && to.name != "Login" ){ router.push({ name: "Login" }); }
          next();
        break;
      }
    },2000)
);

router.afterEach((to, from) => {
  store.commit('loader',false);
  window.scrollTo({top: 0, behavior: 'smooth'});  
})

/**
 * Function to check the role of the user and navigate to the appropriate route.
 *
 * @param {Object} to - The route object to navigate to.
 * @param {Function} next - The next function to call.
 * @return {void}
 */
const checkRole = (to:any,next: any) => {
  const auth = store.getters.auth;

  console.log(store.getters.auth);
  
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

/**
 * Function to add the dashboard theme.
 * 
 * This function adds the necessary CSS and JS files to the dashboard theme.
 * 
 * @return {void} This function does not return anything.
 */
const addDashbordTheme = () => {

  // Define the array of CSS and JS files needed for the dashboard theme
  const scripts = [
    '/assets/dashboard/js/sidebar-menu.js',
    '/assets/dashboard/js/lazysizes.min.js',
    '/assets/dashboard/js/admin-customizer.js',
    '/assets/dashboard/js/default.js',
    '/assets/dashboard/js/jquery.dataTables.min.js',
    '/assets/dashboard/js/admin-script.js'	
  ].map( 
    // Map over the array of URLs and create a promise for each URL
    async (url) => new Promise( 
      // Resolve the promise after a delay of 0 milliseconds
      resolve => setTimeout( async() => resolve(addScript(url)),0)
    ) 
  );

  // Define the array of CSS files needed for the dashboard theme
  const cssFiles = [
    '/assets/dashboard/css/vendors/themify-icons.css',
    '/assets/dashboard/css/vendors/flag-icon.css',
    '/assets/dashboard/css/vendors/prism.css',
    '/assets/dashboard/css/vendors/bootstrap.css',
    '/assets/dashboard/css/style.css',
  ];

  // Add each CSS file to the head of the document
  cssFiles.forEach( (url) => {
    let link   = document.createElement('link');
    link.rel   = 'stylesheet';
    link.href  = url;
    document.head.appendChild(link);
  });

  /**
   * Function to add a script tag to the document.
   * 
   * This function creates a new script element and appends it to the document body.
   * The script element's source is set to the provided URL.
   * 
   * @param {string} url - The URL of the script file.
   * @return {void} This function does not return anything.
   */
  const addScript = (url:string) => {
    // Create a new script element
    let script    = document.createElement('script');

    // Set the type attribute of the script element to 'text/javascript'
    script.type   = 'text/javascript';

    // Set the src attribute of the script element to the provided URL
    script.src    = url;

    // Append the script element to the document body
    document.body.appendChild(script);
  }

  // Wait for all the promises to resolve before continuing
  Promise.all(scripts);

}

/**
 * Function to add the home theme.
 * 
 * This function adds the necessary CSS and JS files to the home theme.
 * 
 * @return {void} This function does not return anything.
 */
const addHomeTheme = () => {

  // Define the array of CSS and JS files needed for the home theme
  const scripts = [
    '/assets/home/js/jquery.exitintent.js',
    '/assets/home/js/fly-cart.js',
    '/assets/home/js/menu.js',
    '/assets/home/js/lazysizes.min.js',
    '/assets/home/js/addtocart.js',
  ].map( 
    // Map over the array of URLs and create a promise for each URL
    async (url) => new Promise( 
      // Resolve the promise after a delay of 150 milliseconds
      resolve => setTimeout( async() => resolve(addScript(url)),150)
    ) 
  );

  // Define the array of CSS files needed for the home theme
  const cssFiles = [
    '/assets/home/css/vendors/themify-icons.css',
    '/assets/home/css/style.css',
  ];

  // Add each CSS file to the head of the document
  cssFiles.forEach( (url) => {
    let link   = document.createElement('link');
    link.rel   = 'stylesheet';
    link.href  = url;
    document.head.appendChild(link);
  });

  /**
   * Function to add a script tag to the document.
   *
   * Creates a new script element and appends it to the document body.
   * The script element's source is set to the provided URL.
   *
   * @param {string} url - The URL of the script file.
   * @return {void} This function does not return anything.
   */
  const addScript = (url:string) => {
    // Create a new script element
    let script    = document.createElement('script');

    // Set the type attribute of the script element to 'text/javascript'
    script.type   = 'text/javascript';

    // Set the src attribute of the script element to the provided URL
    script.src    = url;

    // Append the script element to the document body
    document.body.appendChild(script);
  }

  // Wait for all the promises to resolve before continuing
  Promise.all(scripts);

}

export default router
