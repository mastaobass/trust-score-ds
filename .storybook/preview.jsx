import { useEffect } from "react";
import "../src/tokens/tokens.css";
import { applyTheme, THEMES } from "../src/lib/theme";

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  globalTypes: {
    theme: {
      description: "Trust Score color theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
          { value: "system", title: "System", icon: "browser" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "system",
  },
  decorators: [
    (Story, context) => {
      const theme = THEMES.includes(context.globals.theme) ? context.globals.theme : "system";
      useEffect(() => {
        applyTheme(theme);
        const page = getComputedStyle(document.documentElement).getPropertyValue("--ts-color-surface-page");
        document.body.style.background = page.trim();
        document.body.style.color = getComputedStyle(document.documentElement)
          .getPropertyValue("--ts-color-text-primary")
          .trim();
      }, [theme]);
      return <Story />;
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
