<template>
  <div class="app-calendar">
    <div class="app-calendar__select">Select would be here with proper options {{ options }}</div>

    <div class="app-calendar__input" v-if="showNumericInput">
      Input for numeric value would be here
    </div>

    <div class="app-calendar__date-from" v-if="showDateFrom">
      Input type 'date' would be here (date-from)
    </div>

    <div class="app-calendar__date-to" v-if="showDateTo">
      Input type 'date' would be here (date-to)
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CalendarOption } from '@/types'
import { CALENDAR_TIME_UNITS, CALENDAR_DATE_UNITS } from '@/constants/calendar'
import { ref, computed } from 'vue'

// TODO: Define emits later
// const emit = defineEmits(['on-update'])

const props = withDefaults(
  defineProps<{
    minDate?: string
    maxDate?: string
    minValue?: number
    maxValue?: number
    allowedOptions?: CalendarOption[]
    disabledOptions?: CalendarOption[]
  }>(),
  {
    allowedOptions: () => ['year', 'month', 'hour', 'date-from-to'],
  },
)

const selectedOption = ref<CalendarOption | null>(null)

// TODO: Define type & structure for data later
// const data = ref(null)

const options = computed(() => {
  return [...CALENDAR_TIME_UNITS, ...CALENDAR_DATE_UNITS].filter((option) =>
    props.allowedOptions.includes(option),
  )
})

const showDateFrom = computed(() => {
  return selectedOption.value === 'date-from-to' || selectedOption.value === 'date-from'
})

const showDateTo = computed(() => {
  return selectedOption.value === 'date-from-to' || selectedOption.value === 'date-to'
})
const showNumericInput = computed(() => {
  return selectedOption.value ? CALENDAR_TIME_UNITS.includes(selectedOption.value) : false
})
</script>

<style scoped lang=""></style>
