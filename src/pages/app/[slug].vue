<script setup lang="ts">
import { ref } from "vue"
import { Column, Config, Forms } from "@/interface"
import { formatDefinitions } from "@/utils"
import { useRoute } from "vue-router"
import { supabase } from "@/plugins/supabase"

const route = useRoute()

const isFetching = ref(false)
const isSaving = ref(false)
const formId = ref(-1)
const config = ref<Config>({
  title: "",
  logo: "https://www.madewithsupabase.com/_nuxt/logo.fbcda856.svg",
  column: [],
})

const availableColumn = ref<Column[]>([])
const isPreviewing = ref(false)

const save = async () => {
  isSaving.value = true
  const { data, error } = await supabase
    .from<Forms>("forms")
    .update({ config: config.value })
    .eq("id", formId.value)
    .single()

  isSaving.value = false
}

const fetchData = async () => {
  isFetching.value = true
  const { data, error } = await supabase
    .from<Forms>("forms")
    .select("*, projects(*)")
    .eq("slug", route.params.slug.toString())
    .single()

  if (data) {
    formId.value = data.id
    config.value = data.config
    const table = formatDefinitions(data.projects?.definitions)[data.table_name]
    availableColumn.value = table.columns?.filter((i) => !data.config.column.some((j) => j.reference.title == i.title))
  }

  isFetching.value = false
}

fetchData()
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-end space-x-2">
      <button class="button" @click="isPreviewing = true" :disabled="isFetching">Preview</button>
      <Button class="button bg-green-600" @click="save" :isLoading="isSaving" :disabled="isFetching || isSaving"
        >Save</Button
      >
    </div>

    <FormEditing v-if="!isFetching" v-model:config="config" :availableColumn="availableColumn"></FormEditing>

    <div v-else class="flex items-start justify-center my-20">
      <i-eos-icons-bubble-loading class="text-4xl"></i-eos-icons-bubble-loading>
    </div>

    <Preview v-if="isPreviewing" @close="isPreviewing = false">
      <Form :config="config"></Form>
    </Preview>
  </div>
</template>
