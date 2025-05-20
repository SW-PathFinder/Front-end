import type { Meta } from "@storybook/react";
import { RulebookButton } from "./RulebookButton";

const meta: Meta<typeof RulebookButton> = {
  title: "Common/RulebookButton",
  component: RulebookButton,
};

export default meta;

export const Default = () => <RulebookButton />;
