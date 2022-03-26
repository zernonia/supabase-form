<script setup lang="ts">
import { supabase } from "@/plugins/supabase"
import { store } from "@/store"
import { onMounted, PropType, ref } from "vue"
import { Projects } from "@/interface"
import { getNode } from "@formkit/core"

const props = defineProps({
  isEditing: Boolean,
  type: String,
  defaultValue: Object as PropType<Projects | null | undefined>,
})
const emits = defineEmits<{
  (e: "submit", value: Projects): void
  (e: "close"): void
}>()

const isLoading = ref(false)
const supabaseInfo = ref({
  name: "",
  url: "",
  anon_key: "",
  jwt_token: "",
})
const clickSave = () => {
  getNode("project-form")?.submit()
}
const fetchSchema = () => {
  if (!supabaseInfo.value.anon_key || !supabaseInfo.value.url || !supabaseInfo.value.name) return

  isLoading.value = true
  fetch(`${supabaseInfo.value.url}/rest/v1/?apikey=${supabaseInfo.value.anon_key}`)
    .then((res) => res.json())
    .then((res) => {
      const { definitions, paths } = res
      insertProject({ definitions, paths })
    })
    .catch((err) => {
      isLoading.value = false
    })
}

const insertProject = async (definitions: Projects["definitions"]) => {
  const { data, error } = await supabase
    .from<Projects>("projects")
    .upsert(
      {
        user_id: store.user?.id,
        url: supabaseInfo.value.url,
        anon_key: supabaseInfo.value.anon_key,
        jwt_token: supabaseInfo.value.jwt_token,
        name: supabaseInfo.value.name,
        definitions,
      },
      { onConflict: "url" }
    )
    .single()
  console.log({ data })

  if (data) emits("submit", data)
}

onMounted(() => {
  if (props.type == "edit" && props.defaultValue) {
    supabaseInfo.value = {
      name: props.defaultValue.name,
      url: props.defaultValue.url ?? "",
      anon_key: props.defaultValue.anon_key ?? "",
      jwt_token: props.defaultValue.jwt_token ?? "",
    }
  } else {
    supabaseInfo.value = {
      name: "",
      url: "",
      anon_key: "",
      jwt_token: "",
    }
  }
})
</script>

<template>
  <Modal v-if="isEditing" @close="!isLoading ? emits('close') : ''">
    <div class="max-w-96 w-full p-6 bg-gray-50 border rounded-xl">
      <FormKit
        id="project-form"
        type="form"
        v-model="supabaseInfo"
        :actions="false"
        :disabled="isLoading"
        @submit="fetchSchema"
      >
        <h2 class="text-3xl font-bold mb-4 capitalize">{{ type }} Project</h2>

        <FormKit
          name="name"
          type="text"
          placeholder="Label your project"
          label="Name"
          validation="required"
          input-class="input"
        ></FormKit>

        <FormKit
          name="url"
          type="text"
          placeholder="https://xxx.supabase.co"
          label="Url"
          validation="required"
          input-class="input"
        ></FormKit>

        <FormKit
          name="anon_key"
          type="text"
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX..."
          label="Anon Key"
          validation="required"
          input-class="input"
        ></FormKit>

        <FormKit
          name="jwt_token"
          type="text"
          placeholder="xxxx-xxxx-xxxx-xxxx"
          label="JWT Secret (Optional)"
          input-class="input"
        ></FormKit>
      </FormKit>
      <div class="mt-4 flex space-x-2">
        <button class="button-white" @click="emits('close')" :disabled="isLoading">Cancel</button>
        <Button class="button" @click="clickSave" :isLoading="isLoading">Save</Button>
      </div>
    </div>
  </Modal>
</template>
