<script setup lang="ts">
import { ref } from "vue"
import Form from "@/components/Form.vue"
import { Config, FormInput } from "@/interface"
import { useRoute } from "vue-router"
import { useFetch } from "@vueuse/core"

const route = useRoute()
const isSubmitting = ref(false)
const isSuccessful = ref(false)
const { isFetching, data } = useFetch<{ config: Config }>("/api/form/get", {
  method: "POST",
  body: JSON.stringify({
    slug: route.params.slug,
  }),
}).json()

const submitForm = async (form: FormInput) => {
  isSubmitting.value = true
  fetch("/api/form/submit", {
    method: "POST",
    body: JSON.stringify({
      slug: route.params.slug,
      form,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      isSuccessful.value = true
    })
    .finally(() => {
      isSubmitting.value = false
    })
}
</script>

<template>
  <div class="min-h-screen min-w-screen flex bg-gray-50">
    <div class="self-center justify-self-center text-center w-full text-4xl" v-if="isFetching">Loading...</div>
    <Form
      v-else-if="data?.config"
      :config="data.config"
      @submit="submitForm"
      :isSuccessful="isSuccessful"
      :isSubmitting="isSubmitting"
    ></Form>
    <div v-else class="self-center justify-self-center text-center w-full text-4xl">No form is found 😢</div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
