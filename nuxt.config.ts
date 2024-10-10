export default defineNuxtConfig({
  build: {
    transpile: ['@iconify/vue','vue-toastification'],
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['@/assets/css/main.css','@fortawesome/fontawesome-svg-core/styles.css'],
  runtimeConfig: {
    public: {
      baseURL: process.env.API_BASE_URL || 'http://localhost:8000/api' // URL ของ API backend ที่ Node.js รันอยู่
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});