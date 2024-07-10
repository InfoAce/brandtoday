import { debounce } from 'lodash';
import { watch } from 'vue';

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
    if( document.querySelector(`script[src="${url}"]`) == null ){
        // Create a new script element
        let script    = document.createElement('script');
    
        // Set the type attribute of the script element to 'text/javascript'
        script.type   = 'text/javascript';
    
        // Set the src attribute of the script element to the provided URL
        script.src    = url;
    
        // Append the script element to the document body
        document.body.appendChild(script);
    }     
}

/**
 * Function to add a CSS link tag to the document head.
 *
 * Creates a new link element, sets its rel attribute to 'stylesheet',
 * and its href attribute to the provided URL.
 * Then appends the link element to the document head.
 *
 * @param {string} url - The URL of the CSS file.
 * @return {void} This function does not return anything.
 */
const addCss = (url: string) => {
    if( document.querySelector(`link[href="${url}"]`) == null ){        
        // Create a new link element
        let link = document.createElement('link');

        // Set the rel attribute of the link element to 'stylesheet'
        link.rel = 'stylesheet';

        // Set the href attribute of the link element to the provided URL
        link.href = url;

        // Append the link element to the document head
        document.head.appendChild(link);
    }     

}

/**
 * Function to add the home theme.
 * 
 * This function adds the necessary CSS and JS files to the home theme.
 * 
 * @return {void} This function does not return anything.
 */
const addHomeTheme = async () => {

    // Define the array of CSS and JS files needed for the home theme
    const scripts = [
        '/assets/home/js/jquery.exitintent.js',
        '/assets/home/js/fly-cart.js',
        '/assets/home/js/slick.js',
        // '/assets/home/js/menu.js',
        '/assets/home/js/lazysizes.min.js',
        '/assets/home/js/addtocart.js',
        // '/assets/home/js/script.js'
    ].map( 
        // Map over the array of URLs and create a promise for each URL
        async (url) => new Promise( 
            // Resolve the promise after a delay of 100 milliseconds
            resolve => setTimeout( async() => resolve(addScript(url)),0)
        ) 
    );

    // Define the array of CSS files needed for the home theme
    const cssFiles = [
        '/assets/global/css/slick-theme.css',
        '/assets/global/css/slick.css',
        '/assets/home/css/vendors/themify-icons.css',
        '/assets/home/css/style.css',
    ].map( 
        // Map over the array of URLs and create a promise for each URL
        async (url) => new Promise( 
            // Resolve the promise after a delay of 100 milliseconds
            resolve => setTimeout( async() => resolve(addCss(url)),0)
        ) 
    );

    await Promise.all([...scripts, ...cssFiles]);

}  


/**
 * Function to add the dashboard theme.
 * 
 * This function adds the necessary CSS and JS files to the dashboard theme.
 * 
 * @return {void} This function does not return anything.
 */
const addDashbordTheme = async () => {

    // Define the array of CSS and JS files needed for the dashboard theme
    const scripts = [
      '/assets/dashboard/js/sidebar-menu.js',
      '/assets/dashboard/js/lazysizes.min.js',
      '/assets/dashboard/js/admin-customizer.js',
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
    ].map( 
        // Map over the array of URLs and create a promise for each URL
        async (url) => new Promise( 
            // Resolve the promise after a delay of 100 milliseconds
            resolve => setTimeout( async() => resolve(addCss(url)),0)
        ) 
    );

    await Promise.all([...scripts, ...cssFiles]);
  
  }

export default {
    /**
     * The install function is called when the plugin is installed.
     * It sets up a watcher on the router's current route.
     * If the route includes 'home', it adds the home theme.
     * If the route includes 'dashboard', it adds the dashboard theme.
     * 
     * @param {any} app - The Vue app object.
     * @param {any} options - The options object.
     * @return {Promise<void>} A promise that resolves when the watcher is set up.
     */
    install: async (app: any, options: any): Promise<void> => {
        // Set up a watcher on the router's current route
        watch( 
            // The expression to watch
            ()      => options.router.currentRoute,
            // The callback function to be called when the watched value changes
            async (route) => {
                // If the route includes 'home', add the home theme
                if(route.value.path.includes('home')){
                    await addHomeTheme();
                }
                // If the route includes 'dashboard', add the dashboard theme
                if(route.value.path.includes('dashboard')){
                    await addDashbordTheme();
                }
            },
            // The options object for the watcher
            {
                // Set deep to true to watch nested changes
                deep:true,
                // Set immediate to true to call the callback function immediately
                immediate: true
            }
        )
    }
}
