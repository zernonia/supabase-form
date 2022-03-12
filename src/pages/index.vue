<script setup lang="ts">
import { ref } from "vue"
import { Column, TableState, Table } from "@/interface"

const supabaseInfo = ref({
  url: import.meta.env.VITE_SUPABASE_URL,
  anon: import.meta.env.VITE_SUPABASE_ANON_KEY,
})

const tables = ref<TableState>()
const selectedTable = ref<Table>()
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
        <button @click="selectedTable = table">
          {{ table.title }}
        </button>
      </li>
    </ul>

    <hr />

    {{ selectedTable?.columns }}
  </div>
</template>
