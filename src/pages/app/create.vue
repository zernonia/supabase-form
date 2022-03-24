<script setup lang="ts">
import { ref, watch } from "vue"
import { Column, Config, ConfigColumn, TableState, Table, Projects, Forms } from "@/interface"
import { formatDefinitions, formatTitle, applyDrag, addColumnToConfig } from "@/utils"
//@ts-ignore
import { Container, Draggable } from "vue-dndrop"
import { useRoute, useRouter } from "vue-router"
import { supabase } from "@/plugins/supabase"
import { store } from "@/store"

const route = useRoute()
const router = useRouter()

const supabaseInfo = ref({
  url: "",
  anon_key: "",
  jwt_token: "",
})

const config = ref<Config>({
  title: "",
  logo: "https://www.madewithsupabase.com/_nuxt/logo.fbcda856.svg",
  column: [],
})

const tables = ref<TableState>()
const selectedTable = ref<Table>()
const availableColumn = ref<Column[]>([])
const projects = ref<Projects[]>([])
const selectedProject = ref<Projects>()

const isPreviewing = ref(false)
const isEditing = ref(false)

const fetchSchema = () => {
  fetch(`${supabaseInfo.value.url}/rest/v1/?apikey=${supabaseInfo.value.anon_key}`)
    .then((res) => res.json())
    .then((res) => {
      const { definitions, paths } = res
      insertProject({ definitions, paths })
      tables.value = formatDefinitions({ definitions, paths })
    })
}

const insertProject = async (definitions: Projects["definitions"]) => {
  const { data, error } = await supabase.from<Projects>("projects").upsert({
    user_id: store.user?.id,
    url: supabaseInfo.value.url,
    anon_key: supabaseInfo.value.anon_key,
    definitions,
  })
  console.log({ data })
}

const fetchProjects = async () => {
  const { data, error } = await supabase.from<Projects>("projects").select("*")
  if (data) {
    projects.value = data
  }
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

const save = async () => {
  const slug = Math.random().toString(36).substring(2, 10)

  const { data, error } = await supabase
    .from<Forms>("forms")
    .insert({ config: config.value, slug, user_id: store.user?.id, project_id: selectedProject.value?.id })
    .single()

  if (data) {
    router.replace({ path: `/app/${data.slug}` })
  }
}

watch(selectedProject, (n) => {
  tables.value = formatDefinitions(n?.definitions)
  config.value = {
    title: "",
    logo: "https://www.madewithsupabase.com/_nuxt/logo.fbcda856.svg",
    column: [],
  }
})

fetchProjects()
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <Modal v-if="isEditing" @close="isEditing = false">
        <div class="max-w-72 p-4 bg-gray-50 border rounded-xl">
          <label class="label" for="supabase-url">Url</label>
          <input class="input" name="supabase-url" type="url" v-model="supabaseInfo.url" />

          <label class="label" for="supabase-key">Anon</label>
          <input class="input" name="supabase-key" type="text" v-model="supabaseInfo.anon_key" />

          <label class="label" for="supabase-jwt">JWT Token</label>
          <input class="input" name="supabase-jwt" type="text" v-model="supabaseInfo.jwt_token" />

          <button class="button" @click="fetchSchema">Fetch</button>
        </div>
      </Modal>

      <select class="input max-w-72" v-model="selectedProject" @change="selectTable">
        <option disabled value="undefined">Please select one</option>
        <option v-for="project in projects" :value="project">
          {{ project.id }}
        </option>
      </select>

      <select class="input max-w-72" v-model="selectedTable" @change="selectTable">
        <option disabled value="undefined">Please select one</option>
        <option v-for="table in tables" :value="table">
          {{ table.title }}
        </option>
      </select>

      <button class="button" @click="isPreviewing = true">Preview</button>
      <button class="button bg-green-600" @click="save">Save</button>
    </div>
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
    <Preview v-if="isPreviewing" @close="isPreviewing = false">
      <Form :config="config"></Form>
    </Preview>
  </div>
</template>
