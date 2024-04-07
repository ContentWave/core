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

interface IOrmAuthorization {
  read: boolean
  write: boolean
}

interface IOrmRoleAuthorization extends IOrmAuthorization {
  role: string
}

interface IOrmFieldWithAuthorizations {
  enableAuthorizations?: boolean
  globalAuthorization?: IOrmAuthorization
  authorizations?: IOrmRoleAuthorization[]
}

export interface ITextOrmField
  extends IOrmFieldWithDefault,
    IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations {
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
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations {
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
    IOrmFieldWithAuthorizations {
  type: 'number'
  min?: number
  max?: number
}

export interface IDateOrmField
  extends IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations {
  type: 'date'
  defaultToCurrentTime?: boolean
}

export interface IDateTimeOrmField
  extends IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations {
  type: 'datetime'
  defaultToCurrentTime?: boolean
}

export interface ITimeOrmField
  extends IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations {
  type: 'time'
  defaultToCurrentTime?: boolean
}

export interface IDurationOrmField
  extends IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithMultiple,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations {
  type: 'duration'
}

export interface IEmailOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations {
  type: 'email'
}

export interface IUuidOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations {
  type: 'uuid'
}

export interface IFileOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations {
  type: 'file'
}

export interface IRefOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithPopulate,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations {
  type: 'ref'
  model: string
}

export interface IPhoneOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations {
  type: 'phone'
  defaultCountry?: string
}

export interface IImageOrmField
  extends IOrmFieldWithMultiple,
    IOrmFieldWithNullable,
    IOrmFieldWithRequired,
    IOrmFieldWithUnique,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations {
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
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations {
  type: 'enum'
  values: string[]
}

export interface IPostalAddressOrmField
  extends IOrmFieldWithRequired,
    IOrmFieldWithIndex,
    IOrmFieldWithAuthorizations {
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
