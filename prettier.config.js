/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  // printWidth: 80,
  // tabWidth: 2,
  // useTabs: false,
  // semi: true,
  // quoteProps: "as-needed",
  // singleQuote: false,
  // jsxSingleQuote: false,
  // trailingComma: "all",
  // bracketSpacing: true,
  objectWrap: "collapse",
  // bracketSameLine: false,
  // arrowParens: "always",
  // singleAttributePerLine: false,

  // @trivago/prettier-plugin-sort-imports
  importOrder: ["^react$", "<THIRD_PARTY_MODULES>", "^@/", "^[./]"],
  importOrderSeparation: true,
  // importOrderSortSpecifiers: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators"],

  // prettier-plugin-tailwindcss
  tailwindStylesheet: "./src/index.css",

  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
};

export default config;
