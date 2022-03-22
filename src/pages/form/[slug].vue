<script setup lang="ts">
import { ref } from "vue"
import Form from "@/components/Form.vue"
import { Config } from "@/interface"
import { useRoute } from "vue-router"
import { useFetch } from "@vueuse/core"

const route = useRoute()

const { isFetching, data } = useFetch<{ config: Config }>("/api/form", {
  method: "POST",
  body: JSON.stringify({
    slug: route.params.slug,
  }),
}).json()
</script>

<template>
  <div>
    <div v-if="isFetching">Loading</div>
    <Form v-else-if="data?.config" :config="data.config" @submit=""></Form>
    <div v-else>No form is found</div>
  </div>
</template>
