<script setup lang="ts">
import { Forms } from "@/interface"
import { supabase } from "@/plugins/supabase"
import { ref } from "vue"
import { store } from "@/store"

const projects = ref()
const isLoading = ref(false)
const fetchForms = async () => {
  isLoading.value = true
  const { data, error } = await supabase
    .from<Forms>("forms")
    .select("*, projects(*)")
    .order("created_at", { ascending: false })
  if (data) {
    store.forms = data
  }
  isLoading.value = false
}

fetchForms()
</script>

<template>
  <div>
    <section class="mt-4">
      <div class="flex space-x-2 items-center">
        <h2 class="text-3xl font-bold">Forms</h2>
        <router-link class="button" to="/app/create">Add form</router-link>
      </div>

      <ul v-if="store.forms.length" class="flex items-center mt-4">
        <template v-for="form in store.forms">
          <router-link :to="`/app/${form.slug}`" class="p-12 bg-gray-100 hover:bg-gray-200 transition mr-2 rounded-xl">
            <h2 class="text-2xl font-bold">{{ form.config.title }}</h2>
            <p class="">{{ form.projects?.name }} / {{ form.table_name }}</p>
            {{ form.slug }}
          </router-link>
        </template>
      </ul>

      <div class="w-full h-48 flex items-center justify-center" v-else>
        <i-eos-icons-bubble-loading v-if="isLoading" class="text-5xl"></i-eos-icons-bubble-loading>
        <p v-else class="text-gray-400 text-2xl">No form 😮</p>
      </div>
    </section>
  </div>
</template>
