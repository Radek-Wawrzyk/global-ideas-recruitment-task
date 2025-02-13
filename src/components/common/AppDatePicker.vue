<template>
  <div class="app-date-picker">
    <label v-if="label" class="app-date-picker__label">{{ label }}</label>
    <input
      type="date"
      :value="modelValue"
      @input="handleInput"
      :min="min"
      :max="max"
      :placeholder="placeholder"
      class="app-date-picker__input"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  min?: string
  max?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  emit('update:modelValue', value);
}
</script>

<style scoped lang="scss">
.app-date-picker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__label {
    font-size: 0.875rem;
    color: var(--text-color);
    font-weight: 500;
  }

  &__input {
    height: 2.5rem;
    padding: 0 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: var(--text-color);
    background-color: var(--background-color);
    transition: border-color 0.2s ease;

    &:hover {
      border-color: var(--border-hover-color);
    }

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px var(--primary-color-light);
    }

    &::-webkit-calendar-picker-indicator {
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 1;
      }
    }
  }

  &--error {
    .app-date-picker__input {
      border-color: var(--error-color);

      &:focus {
        box-shadow: 0 0 0 2px var(--error-color-light);
      }
    }
  }

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}
</style>
