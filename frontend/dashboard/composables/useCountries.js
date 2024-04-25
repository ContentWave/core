import countryList from 'i18n-iso-countries'
import en from 'i18n-iso-countries/langs/en.json'
import fr from 'i18n-iso-countries/langs/fr.json'
countryList.registerLocale(en)
countryList.registerLocale(fr)

export const useCountries = locale => {
  return countryList.getNames(locale, { select: 'official' })
}
