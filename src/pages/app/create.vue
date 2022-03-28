<script setup lang="ts">
import { ref, watch } from "vue"
import { Column, Config, TableState, Table, Projects, Forms } from "@/interface"
import { formatDefinitions, formatTitle, addColumnToConfig } from "@/utils"
import { useRouter } from "vue-router"
import { supabase } from "@/plugins/supabase"
import { store } from "@/store"
import ModalProject from "@/components/ModalProject.vue"

const router = useRouter()

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

const modalProjectProps = ref({
  isEditing: false,
  type: "add",
  defaultValue: undefined as Projects | null | undefined,
})

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

const submitModalProject = async (project: Projects) => {
  await fetchProjects()
  selectedProject.value = project
  modalProjectProps.value.isEditing = false
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
    <div class="flex items-center justify-between py-2">
      <div class="flex items-center">
        <ModalProject
          v-if="modalProjectProps.isEditing"
          v-bind="modalProjectProps"
          @close="modalProjectProps.isEditing = false"
          @submit="submitModalProject"
        ></ModalProject>

        <select class="input w-72 w-full" v-model="selectedProject" @change="selectTable">
          <option disabled value="undefined">Select a Project</option>
          <option v-for="project in projects" :value="project">
            {{ project.name }}
          </option>
        </select>

        <button class="button" @click=";(modalProjectProps.isEditing = true), (modalProjectProps.type = 'add')">
          +
        </button>

        <button
          v-if="selectedProject"
          class="button"
          @click="
            ;(modalProjectProps.isEditing = true),
              (modalProjectProps.type = 'edit'),
              (modalProjectProps.defaultValue = selectedProject)
          "
        >
          Edit
        </button>

        <select class="ml-2 input w-72 w-full" v-model="selectedTable" @change="selectTable">
          <option disabled value="undefined">Select a Table</option>
          <option v-for="table in tables" :value="table">
            {{ table.title }}
          </option>
        </select>
      </div>

      <div class="flex space-x-2">
        <button class="button" @click="isPreviewing = true">Preview</button>
        <button class="button bg-green-600" @click="save">Save</button>
      </div>
    </div>

    <FormEditing v-model:config="config" :availableColumn="availableColumn"></FormEditing>

    <Preview v-if="isPreviewing" @close="isPreviewing = false">
      <Form :config="config"></Form>
    </Preview>
  </div>
</template>
