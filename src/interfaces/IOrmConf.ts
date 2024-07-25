import { IWaveModelAuthorizations } from '../models/WaveModel'

interface IOrmFieldWithDefault {
  default?: any
}

interface IOrmFieldWithRequired {
  required?: boolean
}

interface IOrmFieldWithMultiple {
  multiple?: boolean
  minItems?: number
  maxItems?: number
}

interface IOrmFieldWithNullable {
  nullable?: boolean
}

interface IOrmFieldWithPopulate {
  populate?: boolean
}

interface IOrmFieldWithUnique {
  unique?: boolean
}

interface IOrmFieldWithIndex {
  index?: boolean
}

interface IOrmFieldWithAuthorizations {
  authorizations?: IWaveModelAuthorizations
}

interface IOrmFieldWithDescriptors {
  title?: I18nString
  description?: I18nString
}

export interface ITextOrmField
  extends IOrmFieldWithDefault,
    IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'text'
  regex?: string
  minLength?: number
  maxLength?: number
}

export interface IHtmlOrmField
  extends IOrmFieldWithDefault,
    IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'html'
}

export interface IUrlOrmField
  extends IOrmFieldWithDefault,
    IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'url'
}

export interface IBooleanOrmField
  extends IOrmFieldWithDefault,
    IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'boolean'
}

export interface IIntegerOrmField
  extends IOrmFieldWithDefault,
    IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'integer'
  min?: number
  max?: number
}

export interface INumberOrmField
  extends IOrmFieldWithDefault,
    IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'number'
  min?: number
  max?: number
}

export interface IDateOrmField
  extends IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'date'
  defaultToCurrentTime?: boolean
}

export interface IDateTimeOrmField
  extends IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'datetime'
  defaultToCurrentTime?: boolean
}

export interface ITimeOrmField
  extends IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'time'
  defaultToCurrentTime?: boolean
}

export interface IDurationOrmField
  extends IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithMultiple,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'duration'
}

export interface IEmailOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'email'
}

export interface IUuidOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'uuid'
}

export interface IFileOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'file'
}

export interface IRefOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithPopulate,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'ref'
  model: string
}

export interface IPhoneOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'phone'
  defaultCountry?: string
}

export interface IImageOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'image'
  resize?: boolean
  maxHeight?: number
  maxWidth?: number
  crop?: boolean
}

export type I18nString =
  | string
  | {
      [key: string]: string
    }

export interface IEnumValue {
  label: I18nString
  value: string
}

export interface IEnumOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithDefault,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'enum'
  values: IEnumValue[]
}

export interface IPostalAddressOrmField
  extends IOrmFieldWithRequired,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations,
    IOrmFieldWithDescriptors {
  type: 'postaladdress'
  geocode?: boolean
}

export type IOrmField =
  | ITextOrmField
  | IHtmlOrmField
  | IUrlOrmField
  | IBooleanOrmField
  | INumberOrmField
  | IIntegerOrmField
  | IDateOrmField
  | IDateTimeOrmField
  | IDurationOrmField
  | ITimeOrmField
  | IEmailOrmField
  | IFileOrmField
  | IRefOrmField
  | IPhoneOrmField
  | IImageOrmField
  | IEnumOrmField
  | IUuidOrmField
  | IPostalAddressOrmField

export interface IOrmConf {
  [key: string]: IOrmField
}
