// Импорт типов для корректной работы TypeScript
/**
 * @type {import('lint-staged').Configuration}
 */

export default {
  '*.{js,jsx,ts,tsx}': ['eslint --fix'], // Пока не добавили prettier проверяется только eslint
}