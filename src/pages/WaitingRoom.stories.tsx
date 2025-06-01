import { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router";

import WaitingRoom from "./WaitingRoom";

const meta: Meta<typeof WaitingRoom> = {
  title: "Pages/WaitingRoom",
  component: WaitingRoom,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WaitingRoom>;

export const Waiting: Story = {
  name: "참여자 표시",
  args: {
    roomCode: "ABCD",
    capacity: 10,
    participants: ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace"],
  },
};

export const Ready: Story = {
  name: "정원 충족",
  args: {
    roomCode: "ABCD",
    capacity: 10,
    participants: [
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
      "Grace",
      "Heidi",
      "Ivan",
      "Judy",
    ],
  },
};
