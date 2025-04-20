import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import betterHooks from "@wogns3623/eslint-plugin-better-exhaustive-deps";

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  stylistic.configs.customize({
    indent: 2,
    quotes: "double",
    semi: true,
    blockSpacing: true,
    braceStyle: "1tbs",
    commaDangle: "only-multiline",
    arrowParens: true,
    jsx: true,
  }),
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
          staticHooks: {
            useQuery: { refetch: true },
          },
        },
      ],
    },
  },
);
