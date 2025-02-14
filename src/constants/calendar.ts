import type { CalendarOption } from '@/types'

const CALENDAR_TIME_UNITS: CalendarOption[] = [
  'year',
  'quarter',
  'month',
  'week',
  'day',
  'hour',
  'minute',
]
const CALENDAR_DATE_UNITS: CalendarOption[] = ['date-from-to', 'date-from', 'date-to']

export { CALENDAR_TIME_UNITS, CALENDAR_DATE_UNITS }
