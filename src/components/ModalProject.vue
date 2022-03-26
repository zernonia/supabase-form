<script setup lang="ts">
import { supabase } from "@/plugins/supabase"
import { store } from "@/store"
import { onMounted, PropType, ref } from "vue"
import { Projects } from "@/interface"

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

const fetchSchema = () => {
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
    <div class="form max-w-96 w-full p-6 bg-gray-50 border rounded-xl">
      <h2 class="text-3xl font-bold mb-4 capitalize">{{ type }} Project</h2>
      <label class="label" for="supabase-name">Name</label>
      <input
        class="input"
        name="supabase-name"
        type="name"
        placeholder="Label your project"
        v-model="supabaseInfo.name"
      />

      <label class="label" for="supabase-url">Url</label>
      <input
        class="input"
        name="supabase-url"
        type="url"
        placeholder="https://xxx.supabase.co"
        v-model="supabaseInfo.url"
      />

      <label class="label" for="supabase-key">Anon Key</label>
      <input
        class="input"
        name="supabase-key"
        type="text"
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX..."
        v-model="supabaseInfo.anon_key"
      />

      <label class="label" for="supabase-jwt">JWT Secret (Optional)</label>
      <input
        class="input"
        name="supabase-jwt"
        type="text"
        placeholder="xxxx-xxxx-xxxx-xxxx"
        v-model="supabaseInfo.jwt_token"
      />

      <div class="mt-4 flex space-x-2">
        <button class="button-white" @click="emits('close')" :disabled="isLoading">Cancel</button>
        <Button class="button" @click="fetchSchema" :isLoading="isLoading">Save</Button>
      </div>
    </div>
  </Modal>
</template>
