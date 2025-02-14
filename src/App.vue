<script setup lang="ts">
import CustomisableCalendar from '@/components/Calendar/CustomisableCalendar.vue';
import { ref } from 'vue';
import type { CalendarEvent } from '@/types';

const calendarOutput = ref<CalendarEvent>();

const handleCalendarUpdate = (event: CalendarEvent) => {
  console.log(event);
  calendarOutput.value = event;
}
</script>

<template>
  <main class="app">
    <header class="app__header">
      <h1 class="app__header-title">
        Global Ideas recruitment task
      </h1>
    </header>

    <section>
      <customisable-calendar
        :min-value="1"
        :max-value="100"
        :allowed-options="['year', 'month', 'hour', 'date-from', 'date-to', 'date-from-to']"
        min-date="2025-01-01"
        max-date="2025-03-31"
        @on-update="handleCalendarUpdate"
      />
    </section>

    <section>
      <pre>{{ calendarOutput }}</pre>
    </section>
  </main>
</template>

<style scoped lang="scss">
.app {
  margin: 120px auto;
  width: 320px;

  section {
    margin: 0 0 32px 0;
  }

  &__header {
    &-title {
      font-size: 24px;
      margin: 0 0 16px 0;
    }
  }
}
</style>
