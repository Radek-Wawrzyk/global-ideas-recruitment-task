<template>
  <div class="app-date-picker">
    <label v-if="label" class="app-date-picker__label">{{ label }}</label>
    <div class="app-date-picker__wrapper">
      <input
        type="text"
        :value="modelValue"
        @input="handleInput"
        :min="min"
        :max="max"
        placeholder="RRRR-MM-DD"
        class="app-date-picker__input"
        maxlength="10"
        @keypress="validateKeyPress"
        :class="{ 'app-date-picker__input--error': error }"
        ref="textInput"
      />
      <input
        type="date"
        :value="modelValue"
        @input="handleDatePickerInput"
        :min="min"
        :max="max"
        class="app-date-picker__native"
        ref="nativeInput"
      />
      <button
        type="button"
        class="app-date-picker__calendar-btn"
        @click="openDatePicker"
      >
        📅
      </button>
    </div>

    <div v-if="error" class="app-date-picker__error">
      {{ $t('calendar.date.error') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  modelValue: string
  label?: string
  min?: string
  max?: string
  error?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [string]
}>()

const textInput = ref<HTMLInputElement | null>(null);
const nativeInput = ref<HTMLInputElement | null>(null);

const validateKeyPress = (event: KeyboardEvent) => {
  if (!/[\d-]/.test(event.key) && event.key !== 'Backspace') {
    event.preventDefault();
  }

  const target = event.target as HTMLInputElement;
  if (event.key.match(/\d/)) {
    if (target.value.length === 4 || target.value.length === 7) {
      target.value += '-';
    }
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value = target.value;

  value = value.replace(/[^\d-]/g, '');
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (dateRegex.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      emit('update:modelValue', value);
    }
  } else if (value === '') {
    emit('update:modelValue', '');
  }
}

const handleDatePickerInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

const openDatePicker = () => {
  nativeInput.value?.showPicker();
}
</script>

<style scoped lang="scss">
.app-date-picker {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__label {
    font-size: 14px;
    color: var(--text-color);
    font-weight: 600;
  }

  &__wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__input {
    width: 100%;
    height: 2.5rem;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    font-size: 14px;
    color: var(--text-color);
    background-color: var(--background-color);
    transition: border-color 0.2s ease;

    &--error {
      border-color: var(--state-error);

      &:focus {
        box-shadow: 0 0 0 2px var(--state-error-light);
        border-color: var(--state-error) !important;
      }
    }

    &:hover {
      border-color: var(--state-focus);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--state-focus-light);
      border-color: var(--state-focus);
    }
  }

  &__native {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    white-space: nowrap;
    border: 0;
  }

  &__calendar-btn {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }

  &__error {
    font-size: 12px;
    color: var(--state-error);
  }
}
</style>
