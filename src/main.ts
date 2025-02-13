import '@/styles/index.scss';

import { createApp } from 'vue';
import { i18n } from '@/i18n';
import App from './App.vue';

createApp(App).use(i18n).use(i18n).mount('#app')
