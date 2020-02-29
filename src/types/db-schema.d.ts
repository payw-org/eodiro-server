export type DbSchemaDataType =
  | 'CHAR'
  | 'VARCHAR'
  | 'TEXT'
  | 'INT'
  | 'TINYINT'
  | 'SMALLINT'
  | 'DATETIME'

export type DbSchema = {
  attribute: string
  type: DbSchemaDataType
  nullable: boolean
  length?: number
}[]
