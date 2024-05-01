import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import localize from 'ajv-i18n'

export const useAjv = (schema, locale = null) => {
  const ajv = new Ajv()
  addFormats(ajv)
  const validator = ajv.compile(schema)

  return state => {
    const valid = validator(state)
    if (valid) return []
    if (locale && localize[locale] !== undefined)
      localize[locale](validator.errors)
    return validator.errors ?? []
  }
}
