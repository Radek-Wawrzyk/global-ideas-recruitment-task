<template>
  <div class="app-calendar">
    <div class="app-calendar__select">
      <app-select
        v-model="selectedOption"
        :options="options"
        :label="$t('calendar.select.label')"
        :placeholder="$t('calendar.select.placeholder')"
        @update:model-value="onSelectChange"
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
        @update:model-value="dispatchCalendarEvent"
      />
    </div>

    <div class="app-calendar__date-from" v-if="showDateFrom">
      <app-date-picker
        v-model="dateFrom"
        :label="$t('calendar.date.from')"
        :placeholder="$t('calendar.date.from')"
        :min="minDate"
        :max="maxDate"
        :error="errors.dateFrom"
        @update:model-value="onDateChange"
      />
    </div>

    <div class="app-calendar__date-to" v-if="showDateTo">
      <app-date-picker
        v-model="dateTo"
        :label="$t('calendar.date.to')"
        :placeholder="$t('calendar.date.to')"
        :min="minDate"
        :max="maxDate"
        :error="errors.dateTo"
        @update:model-value="onDateChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSelect from '@/components/common/AppSelect.vue';
import AppInput from '@/components/common/AppInput.vue';
import AppDatePicker from '@/components/common/AppDatePicker.vue';

import type { CalendarOption, CalendarEvent } from '@/types'
import { CALENDAR_TIME_UNITS, CALENDAR_DATE_UNITS } from '@/constants/calendar'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n';
import { isValidDateFormat } from '@/helpers';

const emit = defineEmits<{
  (eventName: 'on-update', payload: CalendarEvent): void
}>()

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
    disabledOptions: () => [],
  },
)

const t = useI18n();

const selectedOption = ref<CalendarOption>('year')
const numericValue = ref<number>(props.minValue || 1);
const dateFrom = ref<string>('');
const dateTo = ref<string>('');
const errors = ref<Record<string, boolean>>({
  dateFrom: false,
  dateTo: false,
})

const mapOptionToLabel = (option: CalendarOption) => {
  return t.t(`calendar.${option}`);
}

const validateDates = () => {
  errors.value.dateFrom = false;
  errors.value.dateTo = false;

  if (!dateFrom.value && !dateTo.value) return;

  if (dateFrom.value) {
    const fromDate = new Date(dateFrom.value);
    if (
      !isValidDateFormat(dateFrom.value) ||
      isNaN(fromDate.getTime()) ||
      (props.minDate && fromDate < new Date(props.minDate)) ||
      (props.maxDate && fromDate > new Date(props.maxDate))
    ) {
      errors.value.dateFrom = true;
    }
  }

  if (dateTo.value) {
    const toDate = new Date(dateTo.value);
    if (
      !isValidDateFormat(dateTo.value) ||
      isNaN(toDate.getTime()) ||
      (props.minDate && toDate < new Date(props.minDate)) ||
      (props.maxDate && toDate > new Date(props.maxDate))
    ) {
      errors.value.dateTo = true;
    }
  }
}

const resetValues = () => {
  numericValue.value = props.minValue || 1;
  dateFrom.value = '';
  dateTo.value = '';
  errors.value.dateFrom = false;
  errors.value.dateTo = false;
}

const dispatchCalendarEvent = () => {
  const payload: CalendarEvent = {
    type: selectedOption.value,
    value: {},
    hasError: false
  };

  if (showNumericInput.value) {
    payload.value.numericValue = numericValue.value;
  }

  if (showDateFrom.value || showDateTo.value) {
    validateDates();
    payload.hasError = errors.value.dateFrom || errors.value.dateTo;
  }

  if (showDateFrom.value) {
    payload.value.dateFrom = dateFrom.value;
  }

  if (showDateTo.value) {
    payload.value.dateTo = dateTo.value;
  }

  emit('on-update', payload);
};

const onSelectChange = () => {
  resetValues();
};

const onDateChange = () => {
  validateDates();
  dispatchCalendarEvent();
};

const options = computed(() => {
  return [...CALENDAR_TIME_UNITS, ...CALENDAR_DATE_UNITS].filter((option) =>
    props.allowedOptions.includes(option),
  ).map((option) => ({
    value: option,
    label: mapOptionToLabel(option),
    disabled: props.disabledOptions?.includes(option) || false
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
