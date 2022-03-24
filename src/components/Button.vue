<script setup lang="ts">
const props = defineProps({
  isLoading: Boolean,
})
</script>

<template>
  <button>
    <i-eos-icons-bubble-loading v-if="isLoading" class="mx-4 my-0.5"></i-eos-icons-bubble-loading>
    <slot v-else></slot>
  </button>
</template>
