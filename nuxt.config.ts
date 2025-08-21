// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@unocss/nuxt", "@nuxt/eslint"],
  css: ["primeicons/primeicons.css"],
  build: { transpile: ["primevue"] },
});
