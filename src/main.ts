import { createApp } from "vue"
import App from "./App.vue"
import { createRouter, createWebHistory } from "vue-router"
import { setupLayouts } from "virtual:generated-layouts"
import generatedRoutes from "virtual:generated-pages"
import "./assets/main.css"
import "virtual:windi.css"
import { plugin, defaultConfig } from "@formkit/vue"

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).use(plugin, defaultConfig).mount("#app")
