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
      <input class="absolute opacity-0" type="checkbox" v-model="modelValue" @change="onChange" />

      <div
        class="toggle-bg block bg-gray-200 w-10 h-6 rounded-full transition ring-2 ring-transparent focus:ring-green-500"
      ></div>

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
input:focus ~ .toggle-bg {
  @apply ring-green-500;
}
</style>
