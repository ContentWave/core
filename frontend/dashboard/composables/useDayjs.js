import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import Duration from 'dayjs/plugin/duration'
import fr from 'dayjs/locale/fr'

dayjs.extend(LocalizedFormat)
dayjs.extend(Duration)

export const useDayjs = param => {
  return dayjs(param)
}

export const useDuration = param => {
  return dayjs.duration(param)
}
