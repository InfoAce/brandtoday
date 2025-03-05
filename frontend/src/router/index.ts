import { createRouter, createWebHistory, RouterView  } from 'vue-router'
import { debounce, isEmpty, get } from 'lodash';
import store from '../stores';
import routes from './routes';

const router = createRouter({ history: createWebHistory(get(store,'BASE_URL')), routes});

/**
 * Function to check the role of the user and navigate to the appropriate route.
 *
 * @param {Object} to - The route object to navigate to.
 * @param {Function} next - The next function to call to proceed to the next route.
 * @return {void}
 */
const checkRoute = (to: any, next: any): void => {
  store.commit('loader',true);

  // Retrieve the authentication state from the store
  const auth = store.getters.auth;

  // Extract the 'protected' meta property from the route object
  const { meta: { auth: protectedRoute, title, tags} } = to;

  
  if( window.document.getElementById("mySidenav")?.classList.contains('open-side') ){
    window.document.getElementById("mySidenav").classList.remove('open-side')
  }

  window.document.querySelector('title').innerHTML = `${title} | ${import.meta.env.VITE_APP_NAME}`;

  if( tags != undefined ){
    document.querySelector('meta[name="keywords"]').setAttribute('content',tags);
  }

  // If the route is not protected, proceed to the next route
  if (!protectedRoute) {
    next();
  }

  // If the route is protected, check the user's authentication status
  if (protectedRoute) {
    // If the user is not authenticated, redirect to the Login route
    if (isEmpty(auth) ) {
      next({ name: "Login" });
    }

    // If the user is authenticated, proceed to the next route
    if (!isEmpty(auth) ) {
      next();
    }
  }
}

router.beforeEach((to,from,next) => checkRoute(to,next));

router.afterEach(
  debounce((to, from) => {
    $('.category_submenu').not('.hidden').addClass('hidden')
    store.commit('loader',false);
    window.scrollTo({top: 0, behavior: 'smooth'});  
},200))

export default router
