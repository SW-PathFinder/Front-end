import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router";

import { AuthProvider } from "@/components/Common/AuthProvider";

import LobbyPage from "./LobbyPage";

const meta: Meta<typeof LobbyPage> = {
  title: "Pages/LobbyPage",
  component: LobbyPage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <AuthProvider>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </AuthProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof LobbyPage>;

export const Default: Story = { render: () => <LobbyPage /> };
