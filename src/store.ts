import { User } from "@supabase/gotrue-js"
import { reactive } from "vue"

export const store = reactive({
  user: {} as User | null | undefined,
})
