<script setup lang="ts">
import { Forms } from "@/interface"
import { supabase } from "@/plugins/supabase"
import { onMounted, ref } from "vue"
import { store } from "@/store"

const projects = ref()

const fetchForms = async () => {
  const { data, error } = await supabase.from<Forms>("forms").select("*").order("created_at", { ascending: false })
  if (data) {
    store.forms = data
  }
}

fetchForms()
</script>

<template>
  <div>
    <section>
      <div class="flex space-x-2 items-center">
        <h2>Forms</h2>
        <router-link class="button" to="/app/create">Add form</router-link>
      </div>

      <ul class="flex items-center mt-4">
        <template v-for="form in store.forms">
          <router-link :to="`/app/${form.slug}`" class="p-12 bg-gray-100 mr-2">
            {{ form.slug }}
          </router-link>
        </template>
      </ul>
    </section>
  </div>
</template>
