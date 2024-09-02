import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "url";
import { resolve } from 'path';
import multipleHtml from '@beta-lib/vite-multiple-html';

export default defineConfig( ({command,mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    build:{
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main:      resolve(__dirname,'index.html'),
          dashboard: resolve(__dirname,'dashboard.html')
        }
      }
    },
    server: {
      proxy: {
        '/images': env.VITE_API_URL.replace('/api/v1', '')
      },
    },
    plugins: [
      vue(),
      multipleHtml({
        /**
         * you can add more item in packageList to set multiple pages
         */
        packageList: [
          {
              /**
               * you will not need to add script tags in `index.html`, the original tags need to be deleted
               */
              entry: 'src/main.ts',
              /**
               * filename is your html file's name. When you run your project, this will be your Access Name, and it will also be used as the file name of the packaged output HTML
               */
              filename: 'index',
              /**
               * templatePath is the path to the template html
               */
              templatePath: 'index.html'
          },
          {
            /**
             * you will not need to add script tags in `index.html`, the original tags need to be deleted
             */
            entry: 'src/main.ts',
            /**
             * filename is your html file's name. When you run your project, this will be your Access Name, and it will also be used as the file name of the packaged output HTML
             */
            filename: 'dashboard',
            /**
             * templatePath is the path to the template html
             */
            templatePath: 'dashboard.html'
          }
        ],
        /**
         * injectData will be inject to html, Note: multiple pages share the same injectData
         */
        injectData:{
          title: 'Testing'
        },
        /**
         * tempHtmlDir is used to store HTML files generated from template HTML
         * @default htmlTemp
         */
        tempHtmlDir: 'dist'
      })
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
