import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "url";

export default defineConfig( ({command,mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      vue()
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "~": fileURLToPath(new URL("./public", import.meta.url)),
      },
    },
    server: {
      proxy:{
        '/api/v1': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/v1/, '')
        }
      }
    }
  }
})
