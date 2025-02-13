<script setup lang="ts">
import AppCalendar from '@/components/AppCalendar/AppCalendar.vue';

</script>

<template>
  <main class="app">
    <header class="app__header">
      <h1 class="app__header-title">
        Global Ideas recruitment task
      </h1>
    </header>

    <section>
      <app-calendar
        :min-value="1"
        :max-value="100"
        :allowed-options="['year', 'month', 'hour', 'date-from', 'date-to', 'date-from-to']"
        min-date="2025-01-01"
        max-date="2025-03-31"
      />
    </section>
  </main>
</template>

<style scoped lang="scss">
.app {
  margin: 120px auto;
  width: 320px;

  &__header {
    &-title {
      font-size: 24px;
      margin: 0 0 16px 0;
    }
  }
}
</style>
