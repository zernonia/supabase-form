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
  <div class="flex items-center justify-center w-full">
    <label class="relative cursor-pointer">
      <input class="absolute opacity-0" type="checkbox" :value="modelValue" @change="onChange" />

      <div class="toggle-bg block bg-warm-gray-100 w-10 h-6 rounded-full transition"></div>

      <div class="toggle-dot absolute left-1 top-1 bg-white w-4 h-4 shadow rounded-full transition"></div>
    </label>
  </div>
</template>

<style lang="postcss">
input:checked ~ .toggle-bg {
  @apply bg-green-400;
}
input:checked ~ .toggle-dot {
  @apply transform translate-x-full;
}
</style>
