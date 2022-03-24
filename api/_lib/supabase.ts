import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL as string,
  process.env.VITE_SUPABASE_SERVICE_KEY as string
)
