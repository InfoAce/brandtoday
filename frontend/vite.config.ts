import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "url";
import { resolve } from 'path';
import Pages from 'vite-plugin-pages'

const root   = resolve(__dirname,'src');
const outdir = resolve(__dirname,'dist');

export default defineConfig( ({command,mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    build:{
      emptyOutDir: true,
      rollupOptions: {
        input: {
          home:      resolve(root,'home','index.html'),
          dashboard: resolve(root,'dashboard','index.html')
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
