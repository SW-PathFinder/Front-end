import { Meta, StoryObj } from "@storybook/react";

import { OtherSaboteurPlayer } from "@/libs/saboteur/player";

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
      new OtherSaboteurPlayer({
        id: "Player 1",
        status: { lantern: true, pickaxe: true, mineCart: true },
        handCount: 3,
      }),
      new OtherSaboteurPlayer({
        id: "Player 2",
        status: { lantern: true, pickaxe: true, mineCart: true },
        handCount: 3,
      }),
    ],
  },
};
export const Empty: Story = { args: { list: [] } };
