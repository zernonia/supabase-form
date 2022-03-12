import { createApp } from "vue"
import App from "./App.vue"
import { createRouter, createWebHistory } from "vue-router"
import "./assets/main.css"
import "virtual:windi.css"
import routes from "~pages"
import { plugin, defaultConfig } from "@formkit/vue"

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).use(plugin, defaultConfig).mount("#app")
