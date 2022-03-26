import { User } from "@supabase/gotrue-js"
import { computed, reactive } from "vue"
import { Forms } from "./interface"

export const store = reactive({
  user: null as User | null | undefined,
  forms: [] as Forms[],
})
