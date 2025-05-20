/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  "*.{json,html,md}": "prettier --write",
  "*.{ts,tsx,js,jsx,mdx}": ["eslint --fix", "prettier --write"],
};
