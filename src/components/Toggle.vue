<script setup lang="ts">
const props = defineProps({
  modelValue: Boolean,
})
const emits = defineEmits(["update:modelValue"])

const onChange = (ev: Event) => {
  if (!ev.target) return
  let target = ev.target as HTMLInputElement
  emits("update:modelValue", target.checked)
}
</script>

<template>
  <div class="flex items-center justify-center w-full mb-12">
    {{ modelValue }}
    <label class="relative cursor-pointer">
      <input class="absolute opacity-0" type="checkbox" :value="modelValue" @change="onChange" />

      <div class="block bg-warm-gray-100 w-10 h-6 rounded-full"></div>

      <div class="dot absolute left-1 top-1 bg-white w-4 h-4 shadow rounded-full transition"></div>
    </label>
  </div>
</template>

<style lang="postcss">
input:checked ~ .dot {
  @apply transform translate-x-full bg-green-400;
}
</style>
