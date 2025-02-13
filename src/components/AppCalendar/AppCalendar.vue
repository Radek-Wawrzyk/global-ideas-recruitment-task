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
      <app-input
        v-model.number="numericValue"
        :min="minValue"
        :max="maxValue"
        type="number"
        :label="$t('calendar.numeric.label')"
        :placeholder="$t('calendar.numeric.placeholder')"
      />
    </div>

    <div class="app-calendar__date-from" v-if="showDateFrom">
      <app-date-picker
        v-model="dateFrom"
        :label="$t('calendar.date.from')"
        :placeholder="$t('calendar.date.from')"
        :min="minDate"
        :max="maxDate"
      />
    </div>

    <div class="app-calendar__date-to" v-if="showDateTo">
      <app-date-picker
        v-model="dateTo"
        :label="$t('calendar.date.to')"
        :placeholder="$t('calendar.date.to')"
        :min="minDate"
        :max="maxDate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSelect from '@/components/common/AppSelect.vue';
import AppInput from '@/components/common/AppInput.vue';
import AppDatePicker from '@/components/common/AppDatePicker.vue';

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
const numericValue = ref<number>(props.minValue || 1);
const dateFrom = ref<string>('');
const dateTo = ref<string>('');

// TODO: Define type & structure for data later
// const value = ref(null)

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
