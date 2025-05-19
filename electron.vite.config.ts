import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
   // base: './',
    main: {
        plugins: [externalizeDepsPlugin()]
    },
    preload: {
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src')
            },
            extensions: [
                '.js',
                '.json',
                '.jsx',
                '.mjs',
                '.ts',
                '.tsx',
                '.vue',
            ]
        },
        plugins: [vue()]
    },
    // server: { //不支持使用代理
    //     host: '0.0.0.0',
    //     port: 80,
    //     '/api2': {
    //         target: 'https://yunchu-test.fanyide.cn',
    //         changeOrigin: true,
    //         rewrite: (path) => path.replace(/^\/api2/, '')
    //     }
    // },
})
