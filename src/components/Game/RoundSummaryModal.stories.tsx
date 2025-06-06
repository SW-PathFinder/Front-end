import type { Meta, StoryObj } from "@storybook/react";

import Game from "@/pages/Game";

import RoundSummaryModal from "./RoundSummaryModal";

const meta: Meta<typeof RoundSummaryModal> = {
  title: "Game/RoundSummaryModal",
  component: RoundSummaryModal,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
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

const defaultRoles: Record<string, "worker" | "saboteur"> = {
  Alice: "worker",
  Bob: "saboteur",
  Carol: "worker",
};

export const WorkerWins_UserIsWorker: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    currentRound: 1,
    winner: "worker",
    roles: defaultRoles,
    currentUser: "Alice",
    goldEarned: 5,
  },
};

export const WorkerWins_UserIsSaboteur: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    currentRound: 1,
    winner: "worker",
    roles: defaultRoles,
    currentUser: "Bob",
    goldEarned: 0,
  },
};

export const SaboteurWins_UserIsSaboteur: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    currentRound: 1,
    winner: "saboteur",
    roles: defaultRoles,
    currentUser: "Bob",
    goldEarned: 3,
  },
};

export const SaboteurWins_UserIsWorker: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    currentRound: 1,
    winner: "saboteur",
    roles: defaultRoles,
    currentUser: "Alice",
    goldEarned: 0,
  },
};
