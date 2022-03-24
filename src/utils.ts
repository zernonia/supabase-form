import { Column, ConfigColumn, TableState, Projects } from "./interface"

export const referenceFormat: { [key: string]: string } = {
  uuid: "text",
  text: "text",
  char: "text",
  character: "text",
  varchar: "text",
  ARRAY: "unknown",
  boolean: "checkbox",
  date: "date",
  time: "time",
  timestamp: "datetime-local",
  timestamptz: "datetime-local",
  interval: "number",
  json: "json",
  smallint: "number",
  int: "number",
  integer: "number",
  bigint: "number",
  float: "number",
  float8: "number",
  enum: "select",
}

export const referencePlaceholder: { [key: string]: string | boolean | number | Date | undefined } = {
  uuid: "123e4567-e89b-12d3-a456-426614174000",
  text: "Supabase is cool!",
  char: "Supabase is cool!",
  character: "Supabase is cool!",
  varchar: "Supabase is cool!",
  ARRAY: undefined,
  boolean: false,
  date: Date.now(),
  time: Date.now(),
  timestamp: Date.now(),
  timestamptz: Date.now(),
  interval: 0,
  json: `{ "Supabase": "is cool!" }`,
  smallint: 0,
  int: 0,
  integer: 0,
  bigint: 0,
  float: 0,
  float8: 0,
  enum: undefined,
}

export const formatDefinitions = (def: Projects["definitions"]) => {
  const { definitions, paths } = def
  let tableGroup: TableState = {}
  let key: string
  let value: any

  const checkView = (title: string) => {
    return Object.keys(paths[`/${title}`]).length == 1
  }

  for ([key, value] of Object.entries(definitions)) {
    let colGroup: Column[] = []
    Object.keys(value.properties).forEach((colKey: string) => {
      // Looping every Column
      const colVal = value.properties[colKey]
      let col: Column = {
        title: colKey,
        format: colVal.enum ? "enum" : colVal.format.split(" ")[0],
        type: colVal.type,
        default: colVal.default ? colVal.default : undefined,
        required: value.required && value.required?.includes(colKey) ? true : false,
        pk: colVal.description && colVal.description?.includes("<pk/>") ? true : false,
        fk: colVal.description ? colVal.description.split("`")[1] : undefined,
        enum: colVal.enum,
      }
      colGroup.push(col)
    })

    if (!checkView(key)) {
      tableGroup[key] = {
        title: key,
        columns: colGroup,
      }
    }
  }

  return tableGroup
}

export const formatTitle = (str: string) => {
  var i,
    frags = str.split("_")
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1)
  }
  return frags.join(" ")
}

export const addColumnToConfig = (col: Column) => {
  return {
    reference: col,
    // enabled: !col.default?.length,
    required: col.required,
    title: formatTitle(col.title),
    inputType: referenceFormat[col.format],
    // placeholder: referencePlaceholder[col.format],
  }
}

export const applyDrag = (ref: "configColumn" | "availableColumn", arr: ConfigColumn[] | Column[], dragResult: any) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

  itemToAdd = ref == "configColumn" ? addColumnToConfig(itemToAdd) : itemToAdd.reference ?? itemToAdd

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }

  return result
}
