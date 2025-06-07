// 전체 파일 작성
import type { Meta, StoryObj } from "@storybook/react";

import Game from "@/pages/Game";

import GameSummaryModal from "./GameSummaryModal";

const meta: Meta<typeof GameSummaryModal> = {
  title: "Game/GameSummaryModal",
  component: GameSummaryModal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <>
        <Game />
        <Story />
      </>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

const sampleRank: [string, number][] = [
  ["Player1", 10],
  ["Player2", 6],
  ["Player3", 2],
];

export const Default: Story = {
  args: { isOpen: true, onClose: () => {}, rank: sampleRank },
};

export const MorePlayers: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    rank: [
      ["Alice", 12],
      ["Bob", 8],
      ["Carol", 5],
      ["Dave", 3],
      ["Eve", 1],
    ],
  },
};
