export interface Column {
  title: string
  format: string
  type: string
  default: any
  required: boolean
  pk: boolean
  fk?: string | undefined
  enum?: string[]
}

export interface Table {
  title: string
  columns?: Column[]
}

export interface TableState {
  [key: string]: Table
}

export interface ConfigColumn {
  // enabled: boolean
  required: boolean
  title: string
  description?: string
  inputType: string
  placeholder?: string | boolean | number | Date
  reference: Column
}

export interface Config {
  title: string
  description?: string
  logo?: string
  column: ConfigColumn[]
}

// Generated from supabase-schema.vercel.app
export interface Users {
  id: string /* primary key */
  email?: string
}

export interface Projects {
  id: string /* primary key */
  user_id: string /* foreign key to users.id */
  url?: string
  anon_key?: string
  jwt_token?: string
  created_at?: string
  definitions?: any // type unknown;
  users?: Users
}

export interface Forms {
  id: number /* primary key */
  slug?: string
  config?: any // type unknown;
  created_at?: string
  user_id?: string /* foreign key to users.id */
  project_id?: string /* foreign key to projects.id */
  users?: Users
  projects?: Projects
}
