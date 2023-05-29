import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
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
        // proxy: {
        //     '/videos': {
        //         target: 'https://api.zhaozeyu.top/v1/videos',
        //         changeOrigin: true,
        //         rewrite: (path) => path.replace(/^\/videos/, '')
        //     },
        //     '/download': {
        //         target: 'https://api.zhaozeyu.top/v1/download',
        //         changeOrigin: true,
        //         rewrite: (path) => path.replace(/^\/download/, '')
        //     }
        // }
    }
})
