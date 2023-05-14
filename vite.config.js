import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()], resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }, build: {
        outDir: 'dist', assetsDir: 'assets', rollupOptions: {
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name][extname]'
            }
        }
    }, server: {
        proxy: {
            '/v3': {
                target: 'https://v3-dy-o.zjcdn.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/v3/, ''),
                headers: {
                    Referer: 'https://v3-dy-o.zjcdn.com', Origin: 'https://v3-dy-o.zjcdn.com'
                }
            }, '/v5': {
                target: 'https://v5-dy-o.zjcdn.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/v5/, ''),
                headers: {
                    Referer: 'https://v5-dy-o.zjcdn.com', Origin: 'https://v5-dy-o.zjcdn.com'
                }
            }
        }
    }
})
