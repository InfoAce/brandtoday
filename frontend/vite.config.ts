import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "url";

export default defineConfig( ({command,mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      proxy: {
        '/images': env.VITE_API_URL.replace('/api/v1', '')
      },
    },
    plugins: [
      vue()
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
