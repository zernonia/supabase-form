<script setup lang="ts">
import { watch } from "vue"
import { useMagicKeys } from "@vueuse/core"

const emits = defineEmits(["close"])

const { escape } = useMagicKeys()
watch(escape, (v) => {
  if (v) emits("close")
})
</script>

<template>
  <div class="fixed top-0 left-0 w-screen h-screen bg-gray-50 z-20">
    <button class="p-4 absolute top-8 right-8 text-2xl text-white z-10" @click="emits('close')">
      <i-mdi:close></i-mdi:close>
    </button>
    <slot></slot>
  </div>
</template>
