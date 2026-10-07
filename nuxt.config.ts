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
      // Header, in dem der API-Key nach dem Login mitgeschickt wird
      apiKeyHeader: 'x-api-key',
    },
  },

  compatibilityDate: '2025-07-15',

  nitro: {
    // Workaround für Nuxt 4.6.0 unter Windows (SSR-500 „Either manifest or precomputed
    // data must be provided“), siehe https://github.com/nuxt/nuxt/issues/36467
    // Kann entfernt werden, sobald ein Nuxt-Release den Fix enthält.
    externals: { inline: [/[\\/]node_modules[\\/]nuxt[\\/]dist[\\/]/] },
  },

  typescript: {
    strict: true,
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
