import { CrudObject } from './CrudObject'

export interface CrudListOptions {
  primaryKey: string
  defaultLimit: number
  defaultSort: string
  filter: CrudObject | null
  transform: any | null
  populate: string | string[] | null
}
