import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json' assert { type: 'json' };

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version)
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon/favicon.ico', 'favicon/apple-touch-icon.png', 'favicon/favicon.svg'],
      manifest: {
        name: 'PlicPloc',
        short_name: 'PlicPloc',
        description: 'Calculateur de débit de perfusion et métronome',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'favicon/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'favicon/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});
