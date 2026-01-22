import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'icon.svg'],
            manifest: {
                name: 'Vitaria - Tu Año Ideal',
                short_name: 'Vitaria',
                description: 'Tu Life OS para gestión personal y bienestar.',
                theme_color: '#F9F7F2',
                background_color: '#F9F7F2',
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    {
                        src: 'icon.svg',
                        sizes: '192x192',
                        type: 'image/svg+xml'
                    },
                    {
                        src: 'icon.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml'
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
})
