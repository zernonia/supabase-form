<script setup lang="ts">
import { onMounted, ref } from "vue"

const props = defineProps({
  modelValue: String,
})
const emits = defineEmits(["update:modelValue"])

const target = ref<HTMLElement>()
const onChange = (ev: Event) => {
  if (!target.value) return
  emits("update:modelValue", target.value.innerHTML)
}
</script>

<template>
  <div contenteditable="true" ref="target" v-html="modelValue" @focusout="onChange"></div>
</template>

<style scoped lang="postcss">
div:empty:before {
  content: attr(data-placeholder);
  @apply text-gray-400;
}
</style>
