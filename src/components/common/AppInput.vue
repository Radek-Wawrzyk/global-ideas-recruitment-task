<template>
  <div class="app-input">
    <label v-if="label" :for="id" class="app-input__label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :min="min"
      :max="max"
      class="app-input__inner"
      @input="handleInput"
    />
    <span v-if="error" class="app-input__error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { getUUID } from '@/helpers';

interface Props {
  modelValue: string | number;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
  min?: number;
  max?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  placeholder: '',
  id: getUUID(),
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value: string | number = target.value;

  if (props.type === 'number') {
    const numValue = Number(value);

    if (!isNaN(numValue)) {
      if (props.min !== undefined && numValue < props.min) {
        value = props.min;
        target.value = props.min.toString();
      }
      if (props.max !== undefined && numValue > props.max) {
        target.value = props.max.toString();
        value = props.max;
      }
    }
  }

  emit('update:modelValue', value);
};
</script>

<style scoped lang="scss">
.app-input {
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
