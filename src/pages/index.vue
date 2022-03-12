<script setup lang="ts">
import { ref } from "vue"
import { Column, TableState, Table } from "@/interface"
//@ts-ignore
import { Container, Draggable } from "vue-dndrop"

const supabaseInfo = ref({
  url: import.meta.env.VITE_SUPABASE_URL,
  anon: import.meta.env.VITE_SUPABASE_ANON_KEY,
})

const tables = ref<TableState>()
const selectedTable = ref<Table>()
const columns = ref<Column[]>([])
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
            format: colVal.format.split(" ")[0],
            type: colVal.type,
            default: colVal.default ? colVal.default : undefined,
            required: value.required && value.required?.includes(colKey) ? true : false,
            pk: colVal.description && colVal.description?.includes("<pk/>") ? true : false,
            fk: colVal.description ? colVal.description.split("`")[1] : undefined,
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
  columns.value = table.columns
}

const onDrop = (dropResult: any) => {
  if (!columns.value) return
  columns.value = applyDrag(columns.value, dropResult)
}

const applyDrag = (arr: Column[], dragResult: any) => {
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
      <Container @drop="onDrop">
        <Draggable v-for="(column, i) in columns" :key="column.title + i">
          <div class="py-2">{{ column }}</div>
        </Draggable>
      </Container>
    </div>
  </div>
</template>
