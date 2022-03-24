import { createApp } from "vue"
import App from "./App.vue"
import { createRouter, createWebHistory } from "vue-router"
import { setupLayouts } from "virtual:generated-layouts"
import generatedRoutes from "virtual:generated-pages"
import "./assets/main.css"
import "virtual:windi.css"
import { plugin, defaultConfig } from "@formkit/vue"
import { store } from "./store"

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from) => {
  const toName = to.name?.toString() ?? ""
  if (!store.user && toName.includes("app")) {
    return { name: "index" }
  } else if (store.user && ["index", "login"].includes(toName || "")) {
    return { name: "app" }
  }
})

createApp(App).use(router).use(plugin, defaultConfig).mount("#app")
