import {
  withThemeByClassName,
  withThemeByDataAttribute,
} from "@storybook/addon-themes";
import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";

import "../src/index.css";

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize();

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
  loaders: [mswLoader], // 👈 Add the MSW loader to all stories
};

export default preview;
