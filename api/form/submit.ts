import type { VercelRequest, VercelResponse } from "@vercel/node"
import fetch from "isomorphic-fetch"
import { supabase } from "../_lib/supabase"
import { Forms, FormInput } from "../../src/interface"

export default async (request: VercelRequest, response: VercelResponse) => {
  const body = JSON.parse(request.body)
  const form = body.form as FormInput

  try {
    const { data, error } = await supabase.from<Forms>("forms").select("*, projects(*)").eq("slug", body.slug).single()
    if (error) throw new Error(error.message)

    const result = await fetch(`${data.projects.url}/rest/v1/${data.table_name}`, {
      method: "POST",
      headers: {
        apikey: data.projects.anon_key,
        Authorization: `Bearer ${data.projects.anon_key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(form),
    }).then((res) => res.json())

    response.status(200).json({ successful: true })
  } catch (err) {
    console.log(err)
    response.status(400).send(err)
  }
}
