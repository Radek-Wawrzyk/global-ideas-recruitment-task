# Global Ideas Recruitment task

## Application Architecture
From the very beginning of the project, I considered the potential need for future maintenance beyond the initial assignment. Therefore, I set up a basic configuration for global styles using SCSS and structured the project with dedicated directories for types, helpers, and i18n. While the application does not feature a language switcher, this setup would facilitate easier refactoring and future enhancements.

I structured the components into two main categories:

- Common – containing fundamental UI elements such as input fields.
- CustomisableCalendar – the core component of the application.

I created a dedicated folder for the CustomisableCalendar component to accommodate unit tests.

For the calendar itself, I focused on keeping the implementation as simple as possible while ensuring proper TypeScript typing. I separated constants, types, and helper functions into dedicated files to maintain clarity and modularity.

## Challenges
Aside from implementing the calendar, another challenge was designing the AppDatePicker component. Due to the limitations of the native `<input type="date" />` element and the project requirements, I opted for a hybrid approach. I wanted to avoid using external libraries, so I built a custom input field that enforces a date pattern while integrating it with a hidden native HTML5 date picker. This allows users to either manually enter a correctly formatted date or select one using the calendar icon.

Another key challenge was designing the final event structure emitted by CustomisableCalendar. My goal was to make the API as intuitive as possible. I structured the payload in a way that would be convenient for developers using this component.

## Potential Improvements
If I had more time, I would consider refactoring the Select component. Instead of passing options via the options prop, I would prefer using a slot-based approach, such as:
```ts
<app-select>
   <app-select-option>Option 1</app-select-option>
   <app-select-option>Option 2</app-select-option>
</app-select>
```

However, due to time constraints, I opted for a simpler implementation to focus primarily on the CustomisableCalendar component.

## Testing
For this assignment, I wrote 29 unit tests to validate the core logic of the CustomisableCalendar component. I did not include additional tests since the main focus was ensuring the calendar's functionality, and event emissions could be easily mocked in tests.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
