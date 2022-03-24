<script setup lang="ts">
import { supabase } from "@/plugins/supabase"
import { ref } from "vue"

const email = ref("")
const submit = async () => {
  const { user, session, error } = await supabase.auth.signIn({
    email: email.value,
  })
}
</script>

<template>
  <div>
    <label class="label" for="email">E-mail</label>
    <input class="input" type="email" name="email" id="" v-model="email" />

    <button class="button" @click="submit">Submit</button>
  </div>
</template>
