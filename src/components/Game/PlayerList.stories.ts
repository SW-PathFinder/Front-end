import { Meta, StoryObj } from "@storybook/react";

import PlayerList from "./PlayerList";

const meta: Meta<typeof PlayerList> = {
  title: "Game/PlayerList",
  component: PlayerList,
} satisfies Meta<typeof PlayerList>;

export default meta;
type Story = StoryObj<typeof PlayerList>;

export const Basic: Story = {
  args: {
    list: [
      {
        id: 1,
        name: "Player 1",
        status: { lantern: true, pickaxe: true, wagon: true },
        hand: 3,
      },
      {
        id: 2,
        name: "Player 2",
        status: { lantern: true, pickaxe: true, wagon: true },
        hand: 3,
      },
    ],
  },
};
export const Empty: Story = { args: { list: [] } };
