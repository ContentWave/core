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

export interface ITextOrmField
  extends IOrmFieldWithDefault,
    IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex {
  type: 'text'
  regex?: string
  minLength?: number
  maxLength?: number
}

export interface IIntegerOrmField
  extends IOrmFieldWithDefault,
    IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex {
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
    IOrmFieldWithIndex {
  type: 'number'
  min?: number
  max?: number
}

export interface IDateOrmField
  extends IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithIndex {
  type: 'date'
  defaultToCurrentTime?: boolean
}

export interface IDateTimeOrmField
  extends IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithIndex {
  type: 'datetime'
  defaultToCurrentTime?: boolean
}

export interface ITimeOrmField
  extends IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithIndex {
  type: 'time'
  defaultToCurrentTime?: boolean
}

export interface IDurationOrmField
  extends IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithMultiple,
    IOrmFieldWithIndex {
  type: 'duration'
}

export interface IEmailOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex {
  type: 'email'
}

export interface IUuidOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex {
  type: 'uuid'
}

export interface IFileOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex {
  type: 'file'
}

export interface IRefOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithPopulate,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex {
  type: 'ref'
  model: string
}

export interface IPhoneOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex {
  type: 'phone'
  defaultCountry?: string
}

export interface IImageOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex {
  type: 'image'
  resize?: boolean
  maxHeight?: number
  maxWidth?: number
  crop?: boolean
}

export interface IEnumOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex {
  type: 'enum'
  values: string[]
}

export interface IPostalAddressOrmField extends IOrmFieldWithRequired {
  type: 'postaladdress'
}

export type IOrmField =
  | ITextOrmField
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
