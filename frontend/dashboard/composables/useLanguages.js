import langList from '@cospired/i18n-iso-languages'
import en from '@cospired/i18n-iso-languages/langs/en.json'
import fr from '@cospired/i18n-iso-languages/langs/fr.json'
langList.registerLocale(en)
langList.registerLocale(fr)

export const useLanguages = locale => {
  return langList.getNames(locale)
}
