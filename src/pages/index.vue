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
      title: i.title,
      inputType: referenceFormat[i.format],
      placeholder: referencePlaceholder[i.format],
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
</script>

<template>
  <div class="flex flex-col">
    <label for="">url</label>
    <input type="url" name="" id="" v-model="supabaseInfo.url" />

    <label for="">anon</label>
    <input type="text" name="" id="" v-model="supabaseInfo.anon" />

    <button @click="fetchData">Fetch</button>

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

    <div class="flex">
      <Container @drop="onDrop" drag-handle-selector=".column-drag-handle">
        <Draggable v-for="(item, i) in config" :key="item.title + i">
          <div class="py-2 bg-white">
            <span class="column-drag-handle cursor-move" style="float: left; padding: 0 10px">&#x2630;</span>
            <div class="flex flex-col">
              <!-- {{ item }} -->
              <div class="flex items-center space-x-2">
                <input type="text" v-model="item.title" />
                <div>
                  <label for="">Enabled:</label>
                  <Toggle v-model="item.enabled"></Toggle>
                </div>
                <div>
                  <label for="">Required:</label>
                  <Toggle v-model="item.required"></Toggle>
                </div>
              </div>
              <input v-if="item.inputType != 'select'" :type="item.inputType" v-model="item.placeholder" />
              <select v-else>
                <option disabled value="">Please select one</option>
                <option v-for="opt in item.reference.enum" :value="opt">{{ opt }}</option>
              </select>
            </div>
          </div>
        </Draggable>
      </Container>
    </div>
  </div>
</template>
