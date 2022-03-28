<script setup lang="ts">
import { supabase } from "@/plugins/supabase"
import { ref } from "vue"

const email = ref("")
const isLoading = ref(false)
const isSuccessful = ref(false)
const submit = async () => {
  isLoading.value = true
  const { error } = await supabase.auth.signIn({
    email: email.value,
  })
  if (!error) isSuccessful.value = true
  isLoading.value = false
}
</script>

<template>
  <div class="self-center w-full max-w-96 mt-12 p-6 border rounded-xl">
    <h2 class="h2 mb-4">Sign up via Magic Link</h2>
    <div v-if="!isSuccessful">
      <label class="label" for="email">E-mail</label>
      <input class="input" type="email" name="email" id="" v-model="email" />

      <Button class="button mt-4" @click="submit" :isLoading="isLoading">Submit</Button>
    </div>
    <div v-else>
      <p>Magic has appeared in your Inbox 🪄</p>
    </div>
  </div>
</template>
