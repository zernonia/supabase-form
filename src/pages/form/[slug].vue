<script setup lang="ts">
import { ref } from "vue"
import Form from "@/components/Form.vue"
import { Config, FormInput } from "@/interface"
import { useRoute } from "vue-router"
import { useFetch } from "@vueuse/core"

const route = useRoute()

const { isFetching, data } = useFetch<{ config: Config }>("/api/form/get", {
  method: "POST",
  body: JSON.stringify({
    slug: route.params.slug,
  }),
}).json()

const submitForm = async (form: FormInput) => {
  fetch("/api/form/submit", {
    method: "POST",
    body: JSON.stringify({
      slug: route.params.slug,
      form,
    }),
  })
}
</script>

<template>
  <div>
    <div v-if="isFetching">Loading</div>
    <Form v-else-if="data?.config" :config="data.config" @submit="submitForm"></Form>
    <div v-else>No form is found</div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
