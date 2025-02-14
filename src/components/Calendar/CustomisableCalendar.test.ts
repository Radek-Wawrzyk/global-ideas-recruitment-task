/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import CustomisableCalendar from './CustomisableCalendar.vue'
import { nextTick } from 'vue'

vi.mock('@/components/common/AppSelect.vue', () => ({
  default: {
    name: 'AppSelect',
    template: '<div class="mock-select"></div>'
  }
}))

vi.mock('@/components/common/AppInput.vue', () => ({
  default: {
    name: 'AppInput',
    template: '<div class="mock-input"></div>'
  }
}))

vi.mock('@/components/common/AppDatePicker.vue', () => ({
  default: {
    name: 'AppDatePicker',
    template: '<div class="mock-date-picker"></div>'
  }
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key
  })
}))

describe('CustomisableCalendar', () => {
  const createWrapper = (props = {}) => {
    return mount(CustomisableCalendar, {
      props,
      global: {
        mocks: {
          $t: (key: string) => key
        }
      }
    }) as unknown as any
  }

  describe('Rendering the component', () => {
    it('should render correctly', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should initially render AppSelect', () => {
      const wrapper = createWrapper()
      const select = wrapper.find('.app-calendar__select')

      expect(wrapper.find('.app-calendar__select').exists()).toBe(true)
      expect(select.exists()).toBe(true)
      expect(select.html()).toMatchSnapshot()
    })
  })

  describe('Showing the correct inputs', () => {
    it('should show numeric input component', async () => {
      const wrapper = createWrapper({ allowedOptions: ['year', 'month', 'hour'] })

      await nextTick()
      expect(wrapper.find('.app-calendar__input').exists()).toBe(true)
    })

    it('should show date-from component', async () => {
      const wrapper = createWrapper({
        allowedOptions: ['date-from']
      })

      wrapper.vm.selectedOption = 'date-from';

      await nextTick()
      expect(wrapper.find('.app-calendar__date-from').exists()).toBe(true)
    })

    it('should show date-to component', async () => {
      const wrapper = createWrapper({
        allowedOptions: ['date-to']
      })

      wrapper.vm.selectedOption = 'date-to';

      await nextTick()
      expect(wrapper.find('.app-calendar__date-to').exists()).toBe(true)
    })
  })

  describe('Date validation', () => {
    describe('Date validation', () => {
      it('should not set error for valid dateTo', async () => {
        const wrapper = createWrapper({
          minDate: '2024-01-01',
          maxDate: '2025-12-31',
        })

        wrapper.vm.selectedOption = 'date-to';
        wrapper.vm.dateTo = '2025-06-01';

        await nextTick()
        wrapper.vm.validateDates()
        expect(wrapper.vm.errors.dateTo).toBe(false)
      })
    })

    it('should not set error for valid dateFrom', async () => {
      const wrapper = createWrapper({
        minDate: '2024-01-01',
        maxDate: '2025-12-31',
      })

      wrapper.vm.selectedOption = 'date-from';
      wrapper.vm.dateFrom = '2024-06-01';

      await nextTick()
      wrapper.vm.validateDates()
      expect(wrapper.vm.errors.dateFrom).toBe(false)
    })


    it('should set error for invalid date when date is before min date', async () => {
      const wrapper = createWrapper({
        minDate: '2025-01-01',
      })

      wrapper.vm.selectedOption = 'date-from';
      wrapper.vm.dateFrom = '2023-01-01';

      await nextTick()
      wrapper.vm.validateDates()
      expect(wrapper.vm.errors.dateFrom).toBe(true)
    })

    it('should set error for invalid date when date is after max date', async () => {
      const wrapper = createWrapper({
        maxDate: '2025-01-01',
      })

      wrapper.vm.selectedOption = 'date-to';
      wrapper.vm.dateTo = '2026-01-01';

      await nextTick()
      wrapper.vm.validateDates()
      expect(wrapper.vm.errors.dateTo).toBe(true)
    })

    it('should set error for invalid date when date is not a valid date', async () => {
      const wrapper = createWrapper()

      wrapper.vm.selectedOption = 'date-from';
      wrapper.vm.dateFrom = 'invalid-date';

      await nextTick()
      wrapper.vm.validateDates()
      expect(wrapper.vm.errors.dateFrom).toBe(true)
    })

    it('should set errors when dateFrom is valid but dateTo is invalid', async () => {
      const wrapper = createWrapper({
        maxDate: '2025-01-01',
      })

      wrapper.vm.selectedOption = 'date-from-to';
      wrapper.vm.dateFrom = '2024-01-01';
      wrapper.vm.dateTo = '2026-01-01';

      await nextTick()
      wrapper.vm.validateDates()
      expect(wrapper.vm.errors.dateFrom).toBe(false)
      expect(wrapper.vm.errors.dateTo).toBe(true)
    })

    it('should not set errors when both dates are valid', async () => {
      const wrapper = createWrapper({
        minDate: '2024-01-01',
        maxDate: '2025-12-31',
      })

      wrapper.vm.selectedOption = 'date-from-to';
      wrapper.vm.dateFrom = '2024-06-01';
      wrapper.vm.dateTo = '2025-06-01';

      await nextTick()
      wrapper.vm.validateDates()
      expect(wrapper.vm.errors.dateFrom).toBe(false)
      expect(wrapper.vm.errors.dateTo).toBe(false)
    })

    it('should set errors when both dates are invalid', async () => {
      const wrapper = createWrapper({
        minDate: '2024-01-01',
        maxDate: '2025-12-31',
      })

      wrapper.vm.selectedOption = 'date-from-to';
      wrapper.vm.dateFrom = '2023-01-01';
      wrapper.vm.dateTo = '2026-12-31';

      await nextTick()
      wrapper.vm.validateDates()
      expect(wrapper.vm.errors.dateFrom).toBe(true)
      expect(wrapper.vm.errors.dateTo).toBe(true)
    })
  })

  describe('Event dispatching', () => {
    it('should emit calendar-event with correct year when year option is selected', async () => {
      const wrapper = createWrapper()
      wrapper.vm.selectedOption = 'year'
      wrapper.vm.numericValue = 2024

      await wrapper.vm.dispatchCalendarEvent()

      expect(wrapper.emitted('on-update')?.[0][0]).toEqual({
        type: 'year',
        value: {
          numericValue: 2024,
        },
        hasError: false
      })
    })

    it('should emit calendar-event with correct month when month option is selected', async () => {
      const wrapper = createWrapper()
      wrapper.vm.selectedOption = 'month'
      wrapper.vm.numericValue = 6

      await wrapper.vm.dispatchCalendarEvent()

      expect(wrapper.emitted('on-update')?.[0][0]).toEqual({
        type: 'month',
        value: {
          numericValue: 6,
        },
        hasError: false
      })
    })

    it('should emit calendar-event with correct date when date-from option is selected', async () => {
      const wrapper = createWrapper()
      wrapper.vm.selectedOption = 'date-from'
      wrapper.vm.dateFrom = '2024-06-01'

      await wrapper.vm.dispatchCalendarEvent()

      expect(wrapper.emitted('on-update')?.[0][0]).toEqual({
        type: 'date-from',
        value: {
          dateFrom: '2024-06-01',
        },
        hasError: false
      })
    })

    it('should emit calendar-event with correct date when date-to option is selected', async () => {
      const wrapper = createWrapper()
      wrapper.vm.selectedOption = 'date-to'
      wrapper.vm.dateTo = '2024-12-31'

      await wrapper.vm.dispatchCalendarEvent()

      expect(wrapper.emitted('on-update')?.[0][0]).toEqual({
        type: 'date-to',
        value: {
          dateTo: '2024-12-31',
        },
        hasError: false
      })
    })

    it('should emit calendar-event with both dates when date-from-to option is selected', async () => {
      const wrapper = createWrapper()
      wrapper.vm.selectedOption = 'date-from-to'
      wrapper.vm.dateFrom = '2024-06-01'
      wrapper.vm.dateTo = '2024-12-31'

      await wrapper.vm.dispatchCalendarEvent()

      expect(wrapper.emitted('on-update')?.[0][0]).toEqual({
        type: 'date-from-to',
        value: {
          dateFrom: '2024-06-01',
          dateTo: '2024-12-31'
        },
        hasError: false
      })
    })

    it('should emit calendar-event with correct hour when hour option is selected', async () => {
      const wrapper = createWrapper()
      wrapper.vm.selectedOption = 'hour'
      wrapper.vm.numericValue = 14

      await wrapper.vm.dispatchCalendarEvent()

      expect(wrapper.emitted('on-update')?.[0][0]).toEqual({
        type: 'hour',
        value: {
          numericValue: 14,
        },
        hasError: false
      })
    })

    it('should emit calendar-event with correct quarter when quarter option is selected', async () => {
      const wrapper = createWrapper()
      wrapper.vm.selectedOption = 'quarter'
      wrapper.vm.numericValue = 1

      await wrapper.vm.dispatchCalendarEvent()

      expect(wrapper.emitted('on-update')?.[0][0]).toEqual({
        type: 'quarter',
        value: {
          numericValue: 1,
        },
        hasError: false
      })
    })

    it('should emit calendar-event with correct week when week option is selected', async () => {
      const wrapper = createWrapper()
      wrapper.vm.selectedOption = 'week'
      wrapper.vm.numericValue = 1

      await wrapper.vm.dispatchCalendarEvent()

      expect(wrapper.emitted('on-update')?.[0][0]).toEqual({
        type: 'week',
        value: {
          numericValue: 1,
        },
        hasError: false
      })
    })

    it('should emit calendar-event with correct day when day option is selected', async () => {
      const wrapper = createWrapper()
      wrapper.vm.selectedOption = 'day'
      wrapper.vm.numericValue = 1

      await wrapper.vm.dispatchCalendarEvent()

      expect(wrapper.emitted('on-update')?.[0][0]).toEqual({
        type: 'day',
        value: {
          numericValue: 1,
        },
        hasError: false
      })
    })

    it('should emit calendar-event with correct minute when minute option is selected', async () => {
      const wrapper = createWrapper()
      wrapper.vm.selectedOption = 'minute'
      wrapper.vm.numericValue = 1

      await wrapper.vm.dispatchCalendarEvent()

      expect(wrapper.emitted('on-update')?.[0][0]).toEqual({
        type: 'minute',
        value: {
          numericValue: 1,
        },
        hasError: false
      })
    })
  })


  describe('Component initialization and props', () => {
    it('should use default allowed options when none provided', () => {
      const wrapper = createWrapper()
      const defaultOptions = ['year', 'month', 'hour', 'date-from-to']

      expect(wrapper.vm.options.length).toBe(defaultOptions.length)
      expect(wrapper.vm.options.map((option: any) => option.value)).toEqual(defaultOptions)
    })
  })

  describe('Reset functionality', () => {
    it('should reset values when changing select option', async () => {
      const wrapper = createWrapper()

      wrapper.vm.numericValue = 10
      wrapper.vm.dateFrom = '2024-01-01'
      wrapper.vm.dateTo = '2024-12-31'
      wrapper.vm.errors.dateFrom = true
      wrapper.vm.errors.dateTo = true

      await wrapper.vm.onSelectChange()

      expect(wrapper.vm.numericValue).toBe(1)
      expect(wrapper.vm.dateFrom).toBe('')
      expect(wrapper.vm.dateTo).toBe('')
      expect(wrapper.vm.errors.dateFrom).toBe(false)
      expect(wrapper.vm.errors.dateTo).toBe(false)
    })
  })

  describe('Date validation edge cases', () => {
    it('should not validate dates when both dateFrom and dateTo are empty', async () => {
      const wrapper = createWrapper()

      wrapper.vm.selectedOption = 'date-from-to'
      wrapper.vm.dateFrom = ''
      wrapper.vm.dateTo = ''

      await wrapper.vm.validateDates()

      expect(wrapper.vm.errors.dateFrom).toBe(false)
      expect(wrapper.vm.errors.dateTo).toBe(false)
    })

    it('should validate dates when only dateFrom is provided', async () => {
      const wrapper = createWrapper({
        minDate: '2024-01-01',
        maxDate: '2024-12-31'
      })

      wrapper.vm.selectedOption = 'date-from-to'
      wrapper.vm.dateFrom = '2023-01-01'
      wrapper.vm.dateTo = ''

      await wrapper.vm.validateDates()

      expect(wrapper.vm.errors.dateFrom).toBe(true)
      expect(wrapper.vm.errors.dateTo).toBe(false)
    })
  })

  describe('Computed properties', () => {
    it('should correctly compute showNumericInput for time units', () => {
      const wrapper = createWrapper()
      const timeUnits = ['year', 'month', 'hour', 'minute', 'quarter', 'week', 'day']

      timeUnits.forEach(async unit => {
        wrapper.vm.selectedOption = unit
        await nextTick()
        expect(wrapper.vm.showNumericInput).toBe(true)
      })
    })

    it('should not show numeric input for date options', async () => {
      const wrapper = createWrapper()
      const dateUnits = ['date-from', 'date-to', 'date-from-to']

      for (const unit of dateUnits) {
        wrapper.vm.selectedOption = unit
        await nextTick()
        expect(wrapper.vm.showNumericInput).toBe(false)
      }
    })
  })
})
