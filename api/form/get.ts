import type { VercelRequest, VercelResponse } from "@vercel/node"
import { supabase } from "../_lib/supabase"

export default async (request: VercelRequest, response: VercelResponse) => {
  const body = JSON.parse(request.body)

  const { data, error } = await supabase.from("forms").select("config").eq("slug", body.slug).single()
  if (error) {
    response.status(400).send(error)
  } else {
    response.json(data)
  }
}
