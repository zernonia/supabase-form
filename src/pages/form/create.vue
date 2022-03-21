<script setup lang="ts">
import { ref } from "vue"
import { Column, Config, ConfigColumn, TableState, Table } from "@/interface"
import { referenceFormat, referencePlaceholder } from "@/utils"
//@ts-ignore
import { Container, Draggable } from "vue-dndrop"
import Preview from "@/components/Preview.vue"
import { useRouter } from "vue-router"

const router = useRouter()
const supabaseInfo = ref({
  url: import.meta.env.VITE_SUPABASE_URL,
  anon: import.meta.env.VITE_SUPABASE_ANON_KEY,
})

const config = ref<Config>({
  title: "",
  logo: "https://www.madewithsupabase.com/_nuxt/logo.fbcda856.svg",
  column: [],
})

const tables = ref<TableState>()
const selectedTable = ref<Table>()
const availableColumn = ref<Column[]>([])

const isPreviewing = ref(false)

const fetchData = () => {
  fetch(`${supabaseInfo.value.url}/rest/v1/?apikey=${supabaseInfo.value.anon}`)
    .then((res) => res.json())
    .then((res) => {
      const { definitions, paths } = res
      let tableGroup: TableState = {}
      let key: string
      let value: any

      const checkView = (title: string) => {
        return Object.keys(paths[`/${title}`]).length == 1
      }

      for ([key, value] of Object.entries(definitions)) {
        let colGroup: Column[] = []
        Object.keys(value.properties).forEach((colKey: string) => {
          // Looping every Column
          const colVal = value.properties[colKey]
          let col: Column = {
            title: colKey,
            format: colVal.enum ? "enum" : colVal.format.split(" ")[0],
            type: colVal.type,
            default: colVal.default ? colVal.default : undefined,
            required: value.required && value.required?.includes(colKey) ? true : false,
            pk: colVal.description && colVal.description?.includes("<pk/>") ? true : false,
            fk: colVal.description ? colVal.description.split("`")[1] : undefined,
            enum: colVal.enum,
          }
          colGroup.push(col)
        })

        if (!checkView(key)) {
          tableGroup[key] = {
            title: key,
            columns: colGroup,
          }
        }
      }
      tables.value = tableGroup
    })
}

const selectTable = () => {
  if (!selectedTable.value?.columns) return
  config.value.title = formatTitle(selectedTable.value.title)
  config.value.column = selectedTable.value.columns.filter((i) => i.required).map((i) => addColumnToConfig(i))
  availableColumn.value = selectedTable.value.columns.filter((i) => !i.required)
}

const onDrop = (ref: "configColumn" | "availableColumn", dropResult: any) => {
  if (!config.value.column) return
  if (ref == "configColumn") {
    config.value.column = applyDrag("configColumn", config.value.column, dropResult) as ConfigColumn[]
  } else if (ref == "availableColumn") {
    availableColumn.value = applyDrag("availableColumn", availableColumn.value, dropResult) as Column[]
  }
}

const addColumnToConfig = (col: Column) => {
  return {
    reference: col,
    // enabled: !col.default?.length,
    required: col.required,
    title: formatTitle(col.title),
    inputType: referenceFormat[col.format],
    // placeholder: referencePlaceholder[col.format],
  }
}

const applyDrag = (ref: "configColumn" | "availableColumn", arr: ConfigColumn[] | Column[], dragResult: any) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

  itemToAdd = ref == "configColumn" ? addColumnToConfig(itemToAdd) : itemToAdd.reference ?? itemToAdd

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }

  return result
}

const formatTitle = (str: string) => {
  var i,
    frags = str.split("_")
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1)
  }
  return frags.join(" ")
}

const save = () => {
  fetch("/api/save", {
    method: "POST",
    body: JSON.stringify({
      config: config.value,
      key: supabaseInfo.value,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      router.replace(`/form/${res.slug}`)
    })
}
</script>

<template>
  <div class="flex flex-col">
    <div class="max-w-72 p-4 bg-gray-50 border rounded-xl">
      <label class="label" for="supabase-url">url</label>
      <input class="input" name="supabase-url" type="url" v-model="supabaseInfo.url" />

      <label class="label" for="supabase-key">anon</label>
      <input class="input" name="supabase-key" type="text" v-model="supabaseInfo.anon" />

      <button class="button" @click="fetchData">Fetch</button>
    </div>

    <br />
    <hr />
    <br />

    <select class="input max-w-72" v-model="selectedTable" @change="selectTable">
      <option disabled value="undefined">Please select one</option>
      <option v-for="table in tables" :value="table">
        {{ table.title }}
      </option>
    </select>

    <button class="button" @click="isPreviewing = true">Preview</button>
    <button class="button bg-green-600" @click="save">Save</button>

    <hr />

    <div class="flex mt-4">
      <div class="border rounded-xl bg-gray-50 w-full max-w-72 h-max p-4 mr-4 flex-shrink-0">
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
        </Container>
      </div>

      <div class="relative w-full flex justify-center bg-gray-50">
        <div class="absolute w-full h-64 inset-0 bg-green-400 z-0"></div>
        <div class="my-20 w-full max-w-screen-sm flex flex-col items-center z-10">
          <div class="w-full my-12 p-12 bg-white">
            <Upload v-model="config.logo"></Upload>
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
                <div class="relative config px-12 py-4 bg-gray-50 hover:bg-gray-100 transition w-full rounded-lg">
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
                    <input
                      class="input"
                      v-if="item.inputType != 'select'"
                      :type="item.inputType"
                      v-model="item.placeholder"
                    />
                    <select v-else class="input" v-model="item.placeholder">
                      <option disabled value="undefined">Please select one</option>
                      <option v-for="opt in item.reference.enum" :value="opt">{{ opt }}</option>
                    </select>
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
    <Preview v-if="isPreviewing" :config="config" @close="isPreviewing = false"></Preview>
  </div>
</template>
