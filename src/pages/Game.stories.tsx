import type { Meta } from "@storybook/react";

import Game from "./Game";

const meta: Meta<typeof Game> = {
  title: "Common/Game",
  component: Game,
  tags: ["autodocs"],
};

export default meta;

export const Default = () => <Game />;
