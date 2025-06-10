/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ["defaults", "not IE 11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
    babel({
      babelConfig: {
        babelrc: false,
        configFile: false,
        plugins: ["@babel/plugin-transform-runtime"],
      },
    }),
  ],
  resolve: { alias: [{ find: "@/", replacement: "/src/" }] },
});
