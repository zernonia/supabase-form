import type { VercelRequest, VercelResponse } from "@vercel/node"
import { supabase } from "../_lib/supabase"

export default async (request: VercelRequest, response: VercelResponse) => {
  const body = JSON.parse(request.body)
  const slug = Math.random().toString(36).substring(2, 10)

  const { data, error } = await supabase
    .from("forms")
    .insert({ ...body, slug })
    .single()
  if (error) {
    response.status(400).send(error)
  } else {
    response.json(data)
  }
}
