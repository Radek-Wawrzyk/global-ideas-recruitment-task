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
      <app-calendar />
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
