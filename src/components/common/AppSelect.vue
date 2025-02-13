<template>
  <div class="app-select">
    <label v-if="label" :for="id" class="app-select__label">{{ label }}</label>
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      class="app-select__inner"
      @change="handleChange"
    >
      <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <span v-if="error" class="app-select__error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { getUUID } from '@/helpers';

interface Option {
  value: string | number;
  label: string;
}

interface Props {
  modelValue: string;
  options: Option[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  placeholder: '',
  id: getUUID(),
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>

<style scoped lang="scss">
.app-select {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color);
  }

  &__inner {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    background-color: #fff;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    padding-right: 12px;

    &:focus {
      border-color: var(--state-focus);
    }

    &:disabled {
      background-color: var(--state-disabled);
      cursor: not-allowed;
    }
  }

  &__error {
    color: var(--state-error);
    font-size: 12px;
  }
}
</style>
