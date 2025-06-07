import js from "@eslint/js";
import betterHooks from "@wogns3623/eslint-plugin-better-exhaustive-deps";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import storybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  ...storybook.configs["flat/recommended"],
  {
    extends: [js.configs.recommended, tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: { ecmaVersion: 2020, globals: globals.browser },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@wogns3623/better-exhaustive-deps": betterHooks,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-declaration-merging": "off",

      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "off",
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
