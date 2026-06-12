import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const IS_FR = process.env.VITE_LANG === "fr";
const BASE = IS_FR ? "/country-book-fr/" : "/country-book/";
const APP_NAME = IS_FR ? "Momo's Livre du Monde" : "Momo's World Book";
const APP_SHORT = IS_FR ? "Livre Monde" : "World Book";
const APP_DESC = IS_FR ? "Un atlas de 200 pays pour les jeunes explorateurs" : "An explorer's atlas of 200 countries for young adventurers";

export default defineConfig({
  base: BASE,
  define: {
    /* expose build-time flags to the app as import.meta.env.VITE_LANG etc. */
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-192.png", "icon-512.png", "flags/**/*.svg"],
      manifest: {
        name: APP_NAME,
        short_name: APP_SHORT,
        description: APP_DESC,
        theme_color: "#26221d",
        background_color: "#26221d",
        display: "standalone",
        orientation: "any",
        start_url: BASE,
        scope: BASE,
        icons: [
          { src: `${BASE}icon-192.png`, sizes: "192x192", type: "image/png" },
          { src: `${BASE}icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2,json,svg}"],
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /\/photos\//,
            handler: "CacheFirst",
            options: {
              cacheName: "photos-v1",
              expiration: { maxEntries: 1000, maxAgeSeconds: 365 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /fonts\.(googleapis|gstatic)\.com/,
            handler: "CacheFirst",
            options: {
              cacheName: "fonts-v1",
              expiration: { maxEntries: 40, maxAgeSeconds: 365 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\/covers\//,
            handler: "CacheFirst",
            options: {
              cacheName: "covers-v1",
              expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: { port: IS_FR ? 5174 : 5173 },
});
