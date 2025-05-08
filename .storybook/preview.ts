import "../src/index.css";
import { withThemeByClassName } from "@storybook/addon-themes";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react";

/* snipped for brevity */
export const decorators = [
  withThemeByClassName({
    themes: { light: "light", dark: "dark" },
    defaultTheme: "light",
  }),
  withThemeByDataAttribute({
    themes: {
      // nameOfTheme: 'dataAttributeForTheme',
      light: "",
      dark: "dark",
    },
    defaultTheme: "light",
    // dataAttribute: 'data-theme',
    attributeName: "data-theme",
  }),
];

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};

export default preview;
