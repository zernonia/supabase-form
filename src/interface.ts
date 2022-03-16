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
  description: string
  logo: string
  column: ConfigColumn[]
}
