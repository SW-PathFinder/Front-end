import type { Meta, StoryObj } from "@storybook/react";

import LobbyPage from "./LobbyPage";

const meta: Meta<typeof LobbyPage> = {
  title: "Pages/LobbyPage",
  component: LobbyPage,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof LobbyPage>;

export const Default: Story = { render: () => <LobbyPage /> };
