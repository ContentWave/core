import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import fr from 'dayjs/locale/fr'

dayjs.extend(LocalizedFormat)

export const useDayjs = param => {
  return dayjs(param)
}
