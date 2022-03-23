import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL as string,
  process.env.VITE_SUPABASE_ANON_KEY as string
)
