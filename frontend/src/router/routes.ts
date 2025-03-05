import { RouterView } from 'vue-router';

export default [
    {
      path: '/',
      name: "Home",
      meta: {
        title: 'Home',
        auth: false,
        tags: 'Categories, Products, Brands'
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
            tags: 'Login, Authentication'            
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
            tags: 'Signup, Authentication'            
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
        tags: 'Who we are, About us' 
      },
      component: () => import('@/views/AboutUs.vue')
    },
    {
      path: '/privacy-policy',
      name: "PrivacyPolicy",
      meta: {
        title: 'Privacy Policy',
        auth:   false,
        tags: 'Privacy Statement, Privacy Policy' 
      },
      component: () => import('@/views/PrivacyPolicy.vue')
    },
    {
      path: '/faqs',
      name: "Faqs",
      meta: {
        title: 'FAQs',
        auth:   false,
        tags: 'Frequently Asked Questions, FAQs' 
      },
      component: () => import('@/views/Faqs.vue')
    },
    {
      path: '/brands',
      name: "Brands",
      meta: {
        title: 'Brands',
        auth:   false,
        tags: 'Company Brands, Brands'  
      },
      component: () => import('@/views/Brands.vue')
    },
    {
      path: '/return-refunds',
      name: "ReturnRefunds",
      meta: {
        title: 'Return Refunds',
        auth:   false,
        tags: 'Product Return Statements, Return Refunds' 
      },
      component: () => import('@/views/ReturnRefunds.vue')
    }, 
    {
      path: '/terms-conditions',
      name: "TermsAndConditions",
      meta: {
        title: 'Terms & Conditions',
        auth:   false,
        tags: 'Terms and Conditions' 
      },
      component: () => import('@/views/TermsAndConditions.vue')
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
            tags: 'Categories, Product Categories'             
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
            tags: 'Shopping, Cart, Shopping Cart'  
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
                tags: 'Product Purchase, Checkout, Signup, Place Order'  
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
            tags: 'Shopping, Products, View Products'      
          },
          component: () => import('@/views/Products.vue')
        },
        {
          path: 'branded',
          children:[
            {
              path: ':full_code',
              name: "BuyBranded",
              meta: {
                title: 'Buy Branded',
                auth:  false,
                tags:  'Product, Buy Branded'  
              },
              component: () => import('@/views/Branded.vue')
            }
          ],
          component: RouterView
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
                tags: 'Shopping, Products, View Products'      
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
            tags: 'View Product, Product Category, Product Sub Category'         
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