// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
import Aura from "@primeuix/themes/aura";
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@unocss/nuxt", "@nuxt/eslint", "@primevue/nuxt-module"],
  css: ["primeicons/primeicons.css"],
  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: Aura,
        cssLayer: { name: "primevue", order: "theme, base, primevue" },
      },
    },
  },
  build: { transpile: ["primevue"] },
});
