// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/test-utils/module",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
  ],
  runtimeConfig: {
    public: {
      BASE_URL: process.env.API_URL || "http://localhost:3000",
    },
  },
  css: ["~/assets/css/main.css"],
  shadcn: {
    prefix: "@shadcn",
    componentDir: "./components/ui",
  },
  colorMode: {
    classSuffix: "",
    preference: "dark",
    fallback: "dark",
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
