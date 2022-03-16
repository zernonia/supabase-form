<script setup lang="ts">
import { ConfigColumn } from "@/interface"
import { PropType } from "vue"

const props = defineProps({
  configs: Object as PropType<ConfigColumn[]>,
})
const emits = defineEmits(["close"])
</script>

<template>
  <div class="fixed top-0 left-0 w-screen h-screen bg-white">
    <button class="p-4 float-right" @click="emits('close')"><i-mdi:close></i-mdi:close></button>
    <div class="mt-48 w-full flex flex-col items-center">
      <div class="w-full max-w-screen-sm">
        <div class="mb-12" v-for="config in configs">
          <h2 class="h2 mb-1">{{ config.title }} <span v-if="config.required">*</span></h2>
          <h3 v-if="config.description" class="description mb-2" v-html="config.description"></h3>
          <input :type="config.inputType" class="input" />
        </div>
      </div>

      <button @click="" class="button">Submit</button>
    </div>
  </div>
</template>
