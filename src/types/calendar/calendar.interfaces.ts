import type { CalendarOption } from './calendar.types'

interface CalendarPayload {
  type: CalendarOption
  value: null | number | string | { dateFrom: string; dateTo: string }
}

export type { CalendarPayload }
