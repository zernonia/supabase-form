<script setup lang="ts">
import { ref } from "vue"

const props = defineProps({
  modelValue: String,
  placeholder: String,
})

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void
  (e: "selected", value: File): void
}>()

const target = ref<HTMLInputElement>()

const pickFile = (e: any) => {
  let files = target.value?.files as FileList
  if (files.length) {
    let file = files[0]
    emits("selected", file)

    let reader = new FileReader()
    reader.onload = async (e) => {
      const result = e.target?.result as string
      emits("update:modelValue", result)
    }
    reader.readAsDataURL(files[0])
  }
}
</script>

<template>
  <div @click="target?.click()" class="h-40 w-40 cursor-pointer border-2 border-dashed rounded-xl bg-white mb-4">
    <div v-if="!modelValue" class="h-full text-gray-400 flex flex-shrink-0 flex-col items-center justify-center">
      <i-mdi:plus class="w-12 h-12"></i-mdi:plus>
      <p v-if="placeholder">{{ placeholder }}</p>
    </div>
    <div v-else class="h-full flex items-center justify-center">
      <img :src="modelValue" />
    </div>
    <input class="hidden" ref="target" type="file" @input="pickFile" accept="image/*" />
  </div>
</template>
