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
        :error="errors.dateFrom"
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
      />
    </div>

    <div>
      {{ dateFrom }} - {{ dateTo }}
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSelect from '@/components/common/AppSelect.vue';
import AppInput from '@/components/common/AppInput.vue';
import AppDatePicker from '@/components/common/AppDatePicker.vue';

import type { CalendarOption, CalendarEvent } from '@/types'
import { CALENDAR_TIME_UNITS, CALENDAR_DATE_UNITS } from '@/constants/calendar'
import { ref, computed, watchEffect, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  'on-update': [CalendarEvent]
}>();

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
const isResetting = ref<boolean>(false);
const errors = ref<Record<string, boolean>>({
  dateFrom: false,
  dateTo: false,
})

// TODO: Define type & structure for data later
// const value = ref(null)

const mapOptionToLabel = (option: CalendarOption) => {
  return t.t(`calendar.${option}`);
}

const validateDates = () => {
  errors.value.dateFrom = false;
  errors.value.dateTo = false;

  if (!dateFrom.value && !dateTo.value) return;

  const fromDate = dateFrom.value ? new Date(dateFrom.value) : null;
  const toDate = dateTo.value ? new Date(dateTo.value) : null;
  const minDateObj = props.minDate ? new Date(props.minDate) : null;
  const maxDateObj = props.maxDate ? new Date(props.maxDate) : null;

  if (fromDate) {
    if (
      isNaN(fromDate.getTime()) ||
      (minDateObj && fromDate < minDateObj) ||
      (maxDateObj && fromDate > maxDateObj)
    ) {
      errors.value.dateFrom = true;
    }
  }

  if (toDate) {
    if (
      isNaN(toDate.getTime()) ||
      (minDateObj && toDate < minDateObj) ||
      (maxDateObj && toDate > maxDateObj)
    ) {
      errors.value.dateTo = true;
    }
  }
}

const resetValues = () => {
  isResetting.value = true;
  numericValue.value = props.minValue || 1;
  dateFrom.value = '';
  dateTo.value = '';
  errors.value.dateFrom = false;
  errors.value.dateTo = false;

  nextTick(() => {
    isResetting.value = false;
  });
}

const emitEvent = () => {
  const payload: CalendarEvent = {
    type: selectedOption.value,
    value: {},
    hasError: false
  };

  if (showNumericInput.value) {
    payload.value.numericValue = numericValue.value;
  }

  if (showDateFrom.value) {
    payload.value.dateFrom = dateFrom.value;
    payload.hasError = errors.value.dateFrom;
  }

  if (showDateTo.value) {
    payload.value.dateTo = dateTo.value;
    payload.hasError = errors.value.dateTo;
  }

  emit('on-update', payload);
};

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

watchEffect(() => {
  if (showDateFrom.value || showDateTo.value) {
    validateDates();
  }
});

watch(selectedOption, () => {
  resetValues();
});

// INFO: This is a workaround to prevent the event from being emitted when the component is resetting
watch([numericValue, dateFrom, dateTo], () => {
  if (!isResetting.value) {
    emitEvent();
  }
});

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
