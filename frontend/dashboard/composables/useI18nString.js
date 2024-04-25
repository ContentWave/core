export const useI18nString = (key, locale) =>
  typeof key === 'string' ? key : key[locale] ?? key[Object.keys(key)[0]]
