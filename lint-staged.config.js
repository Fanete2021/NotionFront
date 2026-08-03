// Импорт типов для корректной работы TypeScript
/**
 * @type {import('lint-staged').Configuration}
 */

const config = {
  '*.{js,jsx,ts,tsx,mjs,cjs}': ['eslint --fix', 'prettier --write'],
};

export default config;
