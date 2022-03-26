<script setup lang="ts">
import { Config, FormInput } from "@/interface"
import { PropType, ref, watch } from "vue"
import { referencePlaceholder } from "@/utils"
import { watchOnce } from "@vueuse/core"

const props = defineProps({
  config: Object as PropType<Config>,
  isSuccessful: Boolean,
  isSubmitting: Boolean,
})

const formInput = ref<FormInput>({})

const emits = defineEmits<{
  (e: "submit", value: FormInput): void
}>()

watchOnce(
  () => props.config,
  () => {
    props.config?.column.forEach((i) => {
      formInput.value[i.reference.title] = referencePlaceholder[i.inputType]
    })
  },
  { immediate: true }
)
</script>

<template>
  <div class="relative w-full flex flex-col items-center">
    <div class="absolute w-full h-64 inset-0 bg-green-400 z-0"></div>
    <div v-if="config" class="mt-20 w-full max-w-screen-md z-10">
      <div class="w-full my-12 p-12 bg-white rounded-2xl border">
        <img v-if="config.logo" :src="config.logo" alt="" class="w-40 h-40 mb-4" />
        <div class="h1 mb-2 outline-none" v-html="config.title"></div>
        <div class="subtitle mb-4 outline-none" v-html="config.description"></div>
      </div>

      <div v-if="!isSuccessful">
        <div class="mb-12 px-12" v-for="cfg in config.column">
          <h2 class="h2">{{ cfg.title }} <span v-if="cfg.required">*</span></h2>
          <h3 v-if="cfg.description" class="description mb-2" v-html="cfg.description"></h3>
          <div class="form mt-4">
            <input
              class="input"
              v-if="cfg.inputType != 'select'"
              :type="cfg.inputType"
              v-model="formInput[cfg.reference.title]"
            />
            <select v-else class="input" v-model="formInput[cfg.reference.title]">
              <option disabled value="undefined">Please select one</option>
              <option v-for="opt in cfg.reference.enum" :value="opt">{{ opt }}</option>
            </select>
          </div>
        </div>

        <Button
          @click="emits('submit', formInput)"
          class="button ml-12 mt-16 self-start disabled:opacity-50"
          :disabled="isSubmitting"
          :isLoading="isSubmitting"
        >
          Submit
        </Button>
      </div>

      <div v-else class="px-12">
        <h1 class="text-3xl">Thank you for your submission 💚</h1>
        <a
          href="https://github.com/zernonia/supabase-form"
          target="_blank"
          class="description text-lg flex items-center mt-6"
          >> Star on <i-mdi:github class="ml-2"></i-mdi:github
        ></a>
      </div>
    </div>
  </div>
</template>
