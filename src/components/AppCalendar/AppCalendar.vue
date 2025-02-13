<template>
  <div class="app-calendar">
    <div class="app-calendar__select">
      <app-select
        v-model="selectedOption"
        :options="options"
        :label="$t('calendar.select.label')"
        :placeholder="$t('calendar.select.placeholder')"
      />
    </div>

    <div class="app-calendar__input" v-if="showNumericInput">
      <app-input v-model="numericValue" :min="minValue" :max="maxValue" />
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
import AppSelect from '@/components/common/AppSelect.vue';
import AppInput from '@/components/common/AppInput.vue';

import type { CalendarOption } from '@/types'
import { CALENDAR_TIME_UNITS, CALENDAR_DATE_UNITS } from '@/constants/calendar'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n';

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

const t = useI18n();

const selectedOption = ref<CalendarOption>('year')
const numericValue = ref<number | null>();
// TODO: Define type & structure for data later
// const data = ref(null)

const mapOptionToLabel = (option: CalendarOption) => {
  return t.t(`calendar.${option}`);
}

const options = computed(() => {
  return [...CALENDAR_TIME_UNITS, ...CALENDAR_DATE_UNITS].filter((option) =>
    props.allowedOptions.includes(option),
  ).map((option) => ({
    value: option,
    label: mapOptionToLabel(option),
  }));
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

<style scoped lang="scss">
.app-calendar {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
