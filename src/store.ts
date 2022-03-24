import { User } from "@supabase/gotrue-js"
import { reactive } from "vue"
import { Forms } from "./interface"

export const store = reactive({
  user: {} as User | null | undefined,
  forms: [] as Forms[],
})
