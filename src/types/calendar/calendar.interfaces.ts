import type { CalendarOption } from './calendar.types'

interface CalendarValue {
  numericValue?: number
  dateFrom?: string
  dateTo?: string
}

interface CalendarEvent {
  type: CalendarOption
  value: CalendarValue
  hasError: boolean
}

export type { CalendarEvent, CalendarValue }
