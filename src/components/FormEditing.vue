<script setup lang="ts">
//@ts-ignore
import { Container, Draggable } from "vue-dndrop"
import { Config, Column, ConfigColumn } from "@/interface"
import { formatTitle, applyDrag } from "@/utils"
import { PropType, ref, watch } from "vue"
import { supabase } from "@/plugins/supabase"
import { store } from "@/store"

const props = defineProps({
  config: {
    type: Object as PropType<Config>,
    required: true,
  },
  availableColumn: Object as PropType<Column[]>,
})

const emits = defineEmits<{
  (e: "update:config", value: Config): void
}>()

const availableColumn = ref<Column[]>([])
const onDrop = (ref: "configColumn" | "availableColumn", dropResult: any) => {
  if (!props.config.column) return
  if (ref == "configColumn") {
    props.config.column = applyDrag("configColumn", props.config.column, dropResult) as ConfigColumn[]
  } else if (ref == "availableColumn") {
    availableColumn.value = applyDrag("availableColumn", availableColumn.value, dropResult) as Column[]
  }
}

const uploadLogo = async (file: File) => {
  try {
    let r = (Math.random() + 1).toString(36).substring(7)
    const { data, error } = await supabase.storage.from("logo").upload(`public/${store.user?.id}-${r}`, file, {
      cacheControl: "3600",
      upsert: false,
    })
    if (error) throw new Error(error.message)
    if (data) {
      const { publicURL } = supabase.storage.from("logo").getPublicUrl(data?.Key.split("logo/")[1])
      if (publicURL) props.config.logo = publicURL
    }
  } catch (err) {
    console.log(err)
  }
}

watch(
  () => props.availableColumn,
  (n) => {
    if (n) availableColumn.value = n
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex flex-col lg:flex-row mt-4">
    <div class="border rounded-xl bg-gray-50 w-full max-w-72 h-max p-4 mr-4 flex-shrink-0 sticky top-4">
      <h2 class="text-gray-400">Available Column</h2>
      <Container
        group-name="1"
        @drop="onDrop('availableColumn', $event)"
        :get-child-payload="(i: number) => availableColumn[i]"
      >
        <Draggable v-for="(item, i) in availableColumn" :key="item.title + i">
          <div class="p-2.5 rounded-lg border bg-white text-sm cursor-move">
            {{ formatTitle(item.title) }}
          </div>
        </Draggable>
        <div class="h-32"></div>
      </Container>
    </div>

    <div class="relative w-full flex justify-center bg-gray-50 rounded-xl overflow-hidden">
      <div class="absolute w-full h-64 inset-0 bg-green-400 z-0"></div>
      <div class="my-20 w-full max-w-screen-sm px-4 md:px-6 flex flex-col items-center z-10">
        <div class="w-full my-12 p-12 bg-white rounded-2xl border">
          <Upload v-model="config.logo" @selected="uploadLogo"></Upload>
          <Editable
            v-model="config.title"
            class="h1 mb-2 outline-none"
            data-placeholder="Write some description (optional)"
            autocomplete="off"
          ></Editable>
          <Editable
            v-model="config.description"
            class="subtitle mb-4 outline-none"
            data-placeholder="Write some description (optional)"
            autocomplete="off"
          ></Editable>
        </div>

        <Container
          @drop="onDrop('configColumn', $event)"
          :get-child-payload="(i: number) => config.column[i]"
          :drop-placeholder="{
            className: 'drop-preview',
            animationDuration: '150',
            showOnTop: true,
          }"
          drag-handle-selector=".column-drag-handle"
          group-name="1"
          class="w-full"
        >
          <template v-if="config.column.length">
            <Draggable v-for="(item, i) in config.column" :key="item.reference.title + i">
              <div class="form relative config px-12 py-4 bg-gray-50 hover:bg-gray-100 transition w-full rounded-lg">
                <span
                  class="column-drag-handle absolute cursor-move top-0 left-1/2 transform -translate-x-1/2 text-gray-400"
                  ><i-ph-dots-six-bold></i-ph-dots-six-bold
                ></span>
                <div class="relative flex flex-col">
                  <input
                    type="text"
                    class="h2 mb-1 outline-none transition border-b-2 border-transparent focus:border-green-400"
                    v-model="item.title"
                    placeholder="Heading"
                    autocomplete="off"
                  />
                  <Editable
                    v-model="item.description"
                    class="description mb-4 outline-none"
                    data-placeholder="Write some description (optional)"
                    autocomplete="off"
                  ></Editable>
                  <FormInput :item="item" v-model="item.placeholder"></FormInput>
                </div>

                <div class="mt-4">
                  <div class="w-min flex items-center space-x-2">
                    <label class="text-xs text-gray-400" for="">Required:</label>
                    <Toggle v-model="item.required"></Toggle>
                  </div>
                </div>
              </div>
            </Draggable>
          </template>
        </Container>
      </div>
    </div>
  </div>
</template>
