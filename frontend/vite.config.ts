import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, resolve, URL } from "url";

export default defineConfig( ({command,mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      proxy: {
        '/images': env.VITE_API_URL.replace('/api/v1', '')
      },
    },
    plugins: [
      vue(),
      {
        name: 'import-scripts',
        async transformIndexHtml (html: string, app: any){
          console.log(Object.keys(app));
          if( Object.keys(app).includes('originalUrl') && app.originalUrl.includes('/home') ){

            const cssFiles = [
              '/assets/global/css/custom.css',
              '/assets/home/css/style.css',
              '/assets/home/css/vendors/themify-icons.css',
              '/assets/global/css/font-awesome.css',
              '/assets/global/css/animate.css',
              '/assets/global/css/slick-theme.css',
              '/assets/global/css/slick.css',
              '/assets/global/css/bootstrap.css',
            ];

            const scriptFiles = [
              '/assets/global/js/jquery-3.3.1.min.js',
              '/assets/global/js/jquery-ui.min.js',
              '/assets/global/js/bootstrap.bundle.min.js',  
              '/assets/home/js/jquery.exitintent.js',
              '/assets/home/js/fly-cart.js',
              '/assets/home/js/slick.js',
              '/assets/home/js/lazysizes.min.js',
              '/assets/home/js/script.js',
            ];

            cssFiles.forEach( (css) => {
              // Append the scripts to the HTML.
              html = html.replace(
                /<head>/,
                `<head>\n<link rel="stylesheet" type="text/css" href="${css}" >`
              )
            })
  
            scriptFiles.forEach( (script) => {
              // Append the scripts to the HTML.
              html = html.replace(
                /<\/body>/,
                `<script type="text/javascript" src="${script}"></script>\n</body>`
              )
            });

          }

          if( Object.keys(app).includes('originalUrl') && app.originalUrl.includes('/dashboard') ){

            const cssFiles = [
              '/assets/global/css/custom.css',
              '/assets/dashboard/css/style.css',
              '/assets/dashboard/css/vendors/themify-icons.css',
              '/assets/dashboard/css/vendors/themify-icons.css',
              '/assets/dashboard/css/vendors/flag-icon.css',
              '/assets/dashboard/css/vendors/prism.css',
              '/assets/global/css/font-awesome.css',
              '/assets/global/css/animate.css',
              '/assets/global/css/slick-theme.css',
              '/assets/global/css/slick.css',
              '/assets/dashboard/css/vendors/bootstrap.css',
            ];

            const scriptFiles = [
              '/assets/global/js/jquery-3.3.1.min.js',
              '/assets/global/js/jquery-ui.min.js',
              '/assets/global/js/bootstrap.bundle.min.js',  
              '/assets/dashboard/js/sidebar-menu.js',
              '/assets/dashboard/js/lazysizes.min.js',
              '/assets/dashboard/js/admin-customizer.js',
              '/assets/dashboard/js/jquery.dataTables.min.js',
              '/assets/dashboard/js/admin-script.js'
            ]

            cssFiles.forEach( (css) => {
              // Append the scripts to the HTML.
              html = html.replace(
                /<head>/,
                `<head>\n<link rel="stylesheet" type="text/css" href="${css}" >`
              )
            })
  
            scriptFiles.forEach( (script) => {
              // Append the scripts to the HTML.
              html = html.replace(
                /<\/body>/,
                `<script type="text/javascript" src="${script}"></script>\n</body>`
              )
            });

          }

          return html;
        }
      },
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "~": fileURLToPath(new URL("./public", import.meta.url)),
        "^": fileURLToPath(new URL("./node_modules", import.meta.url)),
      },
    }
  }
})
