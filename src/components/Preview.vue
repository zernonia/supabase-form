<script setup lang="ts">
import { Config } from "@/interface"
import { PropType, watch } from "vue"
import { useMagicKeys } from "@vueuse/core"

const props = defineProps({
  config: Object as PropType<Config>,
})
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
    <div class="relative w-full flex flex-col items-center">
      <div class="absolute w-full h-64 inset-0 bg-green-400 z-0"></div>
      <div v-if="config" class="mt-20 w-full max-w-screen-sm z-10">
        <div class="w-full my-12 p-12 bg-white">
          <img v-if="config.logo" :src="config.logo" alt="" class="w-40 h-40 mb-4" />
          <div class="h1 mb-2 outline-none" v-html="config.title"></div>
          <div class="subtitle mb-4 outline-none" v-html="config.description"></div>
        </div>

        <div class="mb-12 px-12" v-for="cfg in config.column">
          <h2 class="h2">{{ cfg.title }} <span v-if="cfg.required">*</span></h2>
          <h3 v-if="cfg.description" class="description mb-2" v-html="cfg.description"></h3>
          <div class="mt-4">
            <input class="input" v-if="cfg.inputType != 'select'" :type="cfg.inputType" v-model="cfg.placeholder" />
            <select v-else class="input" v-model="cfg.placeholder">
              <option disabled value="undefined">Please select one</option>
              <option v-for="opt in cfg.reference.enum" :value="opt">{{ opt }}</option>
            </select>
          </div>
        </div>

        <button @click="" class="button ml-12 mt-16 self-start">Submit</button>
      </div>
    </div>
  </div>
</template>
