<script setup lang="ts">
import { Config, FormInput } from "@/interface"
import { computed, PropType, ref } from "vue"
import { referencePlaceholder } from "@/utils"
import { watchOnce } from "@vueuse/core"
import { getNode } from "@formkit/core"

const props = defineProps({
  config: Object as PropType<Config>,
  isSuccessful: Boolean,
  isSubmitting: Boolean,
})

const formInput = ref<FormInput>({})

const emits = defineEmits<{
  (e: "submit", value: FormInput): void
}>()

const schema = computed<any>(() => {
  return props.config?.column
    .map((cfg) => {
      console.log({ cfg })
      return [
        {
          $el: "h2",
          children: cfg.title,
        },
        {
          $el: "p",
          children: cfg.description,
        },
        {
          $formkit: cfg.inputType,
          name: cfg.reference.title,
          label: cfg.title,
          validation: cfg.required ? "required" : undefined,
          options:
            cfg.inputType == "select"
              ? cfg.reference.enum
                ? [
                    { label: "Please select one", value: undefined, attrs: { disabled: true } },
                    ...cfg.reference.enum?.map((i) => ({ label: i, value: i })),
                  ]
                : undefined
              : undefined,
        },
      ]
    })
    ?.flat()
})

watchOnce(
  () => props.config,
  () => {
    props.config?.column.forEach((i) => {
      formInput.value[i.reference.title] = referencePlaceholder[i.inputType] ?? undefined
    })
  },
  { immediate: true }
)

const clickButton = () => {
  getNode("app-form")?.submit()
}
const submitForm = () => {
  emits("submit", formInput.value)
}
</script>

<template>
  <div class="relative w-full flex flex-col items-center">
    <div class="absolute w-full h-64 inset-0 bg-green-400 z-0"></div>
    <div v-if="config" class="mt-20 w-full max-w-screen-md px-4 md:px-6 z-10">
      <div class="w-full my-12 p-8 md:p-12 bg-white rounded-2xl border">
        <div class="w-40 h-40 mb-4">
          <img v-if="config.logo" :src="config.logo" alt="" />
        </div>
        <div class="h1 mb-2 outline-none" v-html="config.title"></div>
        <div class="subtitle mb-4 outline-none" v-html="config.description"></div>
      </div>

      <FormKit
        v-if="!isSuccessful && schema"
        type="form"
        id="app-form"
        v-model="formInput"
        :actions="false"
        formClass="form-schema"
        @submit="submitForm"
      >
        <FormKitSchema :schema="schema" />

        <Button
          @click="clickButton"
          class="button mt-16 self-start disabled:opacity-50"
          :disabled="isSubmitting"
          :isLoading="isSubmitting"
        >
          Submit
        </Button>
      </FormKit>

      <div v-else class="px-12">
        <h1 class="text-3xl">Thank you for your submission 💚</h1>
      </div>
    </div>
  </div>
</template>
