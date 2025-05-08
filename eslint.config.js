import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import betterHooks from "@wogns3623/eslint-plugin-better-exhaustive-deps";

const stylisticConfig = stylistic.configs.customize({
  indent: 2,
  quotes: "double",
  semi: true,
  blockSpacing: true,
  braceStyle: "1tbs",
  commaDangle: "always-multiline",
  arrowParens: true,
  jsx: true,
});

export default tseslint.config(
  {
    ignores: [
      "dist",
      "node_modules",
    ],
  },
  {
    plugins: { "@stylistic": stylistic },
    rules: {
      ...stylisticConfig.rules,
      "@stylistic/array-bracket-newline": ["error", { multiline: true }],
      "@stylistic/array-element-newline": [
        "error",
        { consistent: true, multiline: true, minItems: 5 },
      ],
      "@stylistic/object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
      "@stylistic/multiline-ternary": ["error", "never"],
    },
  },
  {
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@wogns3623/better-exhaustive-deps": betterHooks,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",

      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react-hooks/exhaustive-deps": "off",
      "@wogns3623/better-exhaustive-deps/exhaustive-deps": [
        "warn",
        {
          checkMemoizedVariableIsStatic: true,
          staticHooks: { useQuery: { refetch: true } },
        },
      ],
    },
  },
);
