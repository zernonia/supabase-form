<script setup lang="ts">
import { Config } from "@/interface"
import { PropType, watch } from "vue"
import { useMagicKeys } from "@vueuse/core"
import { emit } from "process"

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
  <div class="fixed top-0 left-0 w-screen h-screen bg-white">
    <button class="p-4 float-right" @click="emits('close')"><i-mdi:close></i-mdi:close></button>
    <div class="mt-48 w-full flex flex-col items-center">
      <div v-if="config" class="w-full max-w-screen-sm">
        <div class="w-full my-12 px-4 py-12 bg-white rounded-xl">
          <img v-if="config.logo" :src="config.logo" alt="" class="w-40 h-40" />
          <div class="h1 mb-2 outline-none" v-html="config.title"></div>
          <div class="subtitle mb-4 outline-none" v-html="config.description"></div>
        </div>

        <div class="mb-12 px-4" v-for="cfg in config.column">
          <h2 class="h2 mb-1">{{ cfg.title }} <span v-if="cfg.required">*</span></h2>
          <h3 v-if="cfg.description" class="description mb-2" v-html="cfg.description"></h3>
          <input :type="cfg.inputType" class="input" />
        </div>
      </div>

      <button @click="" class="button">Submit</button>
    </div>
  </div>
</template>
