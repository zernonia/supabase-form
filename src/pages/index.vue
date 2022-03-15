<script setup lang="ts">
import { ref } from "vue"
import { Column, Config, TableState, Table } from "@/interface"
import { referenceFormat, referencePlaceholder } from "@/utils"
//@ts-ignore
import { Container, Draggable } from "vue-dndrop"

const supabaseInfo = ref({
  url: import.meta.env.VITE_SUPABASE_URL,
  anon: import.meta.env.VITE_SUPABASE_ANON_KEY,
})

const tables = ref<TableState>()
const selectedTable = ref<Table>()
const config = ref<Config[]>([])
const fetchData = () => {
  fetch(`${supabaseInfo.value.url}/rest/v1/?apikey=${supabaseInfo.value.anon}`)
    .then((res) => res.json())
    .then((res) => {
      const { definitions, paths } = res
      let tableGroup: TableState = {}
      let key: string
      let value: any

      const checkView = (title: string) => {
        if (Object.keys(paths[`/${title}`]).length == 1) {
          return true
        } else {
          return false
        }
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

const selectTable = (table: Table) => {
  if (!table.columns) return
  selectedTable.value = table
  config.value = table.columns.map((i) => {
    return {
      reference: i,
      enabled: !i.default?.length,
      required: i.required,
      title: formatTitle(i.title),
      inputType: referenceFormat[i.format],
      // placeholder: referencePlaceholder[i.format],
    }
  })
}

const onDrop = (dropResult: any) => {
  if (!config.value) return
  config.value = applyDrag(config.value, dropResult)
}

const applyDrag = (arr: Config[], dragResult: any) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

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

    <ul class="flex items-start space-x-6">
      <li v-for="table in tables">
        <button @click="selectTable(table)">
          {{ table.title }}
        </button>
      </li>
    </ul>

    <hr />

    <div class="w-full flex justify-center">
      <Container @drop="onDrop" drag-handle-selector=".column-drag-handle" class="w-full max-w-screen-sm">
        <Draggable v-for="(item, i) in config" :key="item.reference.title + i">
          <div class="config p-4 w-full mb-2 rounded-lg border bg-gray-50" :class="{ 'opacity-50': !item.enabled }">
            <div class="flex items-center justify-between">
              <span class="column-drag-handle cursor-move">&#x2630;</span>
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <label class="text-xs text-gray-4 00" for="">Enabled:</label>
                  <Toggle v-model="item.enabled"></Toggle>
                </div>
                <div class="flex items-center space-x-2">
                  <label class="text-xs text-gray-4 00" for="">Required:</label>
                  <Toggle v-model="item.required"></Toggle>
                </div>
              </div>
            </div>
            <div class="py-2 relative flex flex-col" :disabled="!item.enabled">
              <div class="absolute w-full h-full bg-transparent" v-if="!item.enabled"></div>
              <input
                type="text"
                class="my-2 text-2xl font-semibold outline-none transition border-b-2 border-transparent focus:border-green-400"
                v-model="item.title"
                placeholder="Heading"
                autocomplete="off"
                :tabindex="item.enabled ? 0 : -1"
              />
              <Editable
                v-model="item.description"
                class="mb-4 text-gray-400 outline-none transition border-b-2 border-transparent focus:border-green-400"
                data-placeholder="Write some description (optional)"
                autocomplete="off"
                :tabindex="item.enabled ? 0 : -1"
              ></Editable>
              <input
                class="input"
                v-if="item.inputType != 'select'"
                :type="item.inputType"
                v-model="item.placeholder"
                :tabindex="item.enabled ? 0 : -1"
              />
              <select v-else class="input" v-model="item.placeholder" :tabindex="item.enabled ? 0 : -1">
                <option disabled value="undefined">Please select one</option>
                <option v-for="opt in item.reference.enum" :value="opt">{{ opt }}</option>
              </select>
            </div>
          </div>
        </Draggable>
      </Container>
    </div>
  </div>
</template>

<style lang="postcss">
.config {
  @apply text-sm;
}
</style>
