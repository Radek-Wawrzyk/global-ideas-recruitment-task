import { createI18n } from 'vue-i18n'
import { DEFAULT_LOCALE } from '@/constants/locale';

import en from './locales/en.json';
import pl from './locales/pl.json';

export const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    en,
    pl,
  },
})
