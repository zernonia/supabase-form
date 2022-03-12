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

export interface Config extends Column {
  enabled: boolean
  inputType: string
  placeholder: string | boolean | number | Date | undefined
}
