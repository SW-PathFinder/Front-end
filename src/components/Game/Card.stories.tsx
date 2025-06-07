import type { Meta, StoryObj } from "@storybook/react";

import { SaboteurCard } from "@/libs/saboteur/cards";

import { Card } from "./Card";
import { DndZone } from "./Dnd";

// import { fn } from "@storybook/test";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Game/Card",
  component: Card,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // argTypes: { backgroundColor: { control: "color" } },
  // // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: { card: new SaboteurCard.Path.Way3A() },
  render: (args) => (
    <DndZone>
      <Card {...args} />
    </DndZone>
  ),
};
export const Rotated: Story = {
  args: { card: new SaboteurCard.Path.Way3A(), transform: { rotate: 45 } },
  render: (args) => (
    <DndZone>
      <Card {...args} />
    </DndZone>
  ),
};
export const Translated: Story = {
  args: { card: new SaboteurCard.Path.Way3A(), transform: { x: 24, y: 36 } },
  render: (args) => (
    <DndZone>
      <Card {...args} />
    </DndZone>
  ),
};
