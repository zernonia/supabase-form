<script setup lang="ts">
import { ref } from "vue"

const props = defineProps({
  modelValue: String,
  placeholder: String,
})
const emits = defineEmits(["update:modelValue", "selected"])

const target = ref<HTMLInputElement>()

const pickFile = (e: any) => {
  let files = target.value?.files as FileList
  if (files.length) {
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader()
      reader.onload = async (e) => {
        const result = e.target?.result as string
        let r = (Math.random() + 1).toString(36).substring(7)
        console.log({ result })

        emits("update:modelValue", result)
        emits("selected", result)
      }
      reader.readAsDataURL(files[i])
    }
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
