// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@pinia/nuxt'],

  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      titleTemplate: '%s · Claude TestVue',
    },
  },

  css: ['~/assets/css/main.css'],

  // Werte lassen sich zur Laufzeit per ENV überschreiben, z. B. NUXT_PUBLIC_API_BASE
  runtimeConfig: {
    public: {
      apiBase: 'https://dummyjson.com',
    },
  },

  compatibilityDate: '2025-07-15',

  typescript: {
    strict: true,
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
