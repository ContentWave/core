import { CrudObject } from './CrudObject'

export interface CrudGetOptions {
  idParam: string
  primaryKey: string
  transform: any | null
  filter: CrudObject | null
  populate: string | string[] | null
}
