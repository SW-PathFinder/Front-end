import type { Meta, StoryObj } from "@storybook/react";

import { PathCard } from "@/libs/saboteur/cards";

import { Board, BOARD_ROWS, BOARD_COLS } from "./Board";
import { DndZone } from "./Dnd";

// import { fn } from "@storybook/test";

const cards: (PathCard.Abstract | null)[][] = Array.from(
  { length: BOARD_ROWS },
  () => {
    return Array.from({ length: BOARD_COLS }, () => null);
  },
);

cards[11][7] = new PathCard.Origin();
cards[9][15] = new PathCard.DestGold();
cards[11][15] = new PathCard.DestRockA();
cards[13][15] = new PathCard.DestRockB();

const BoardStory = ({ cards }: { cards: (PathCard.Abstract | null)[][] }) => {
  return (
    <DndZone>
      <Board cards={cards} />
    </DndZone>
  );
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Game/Board",
  component: BoardStory,
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
} satisfies Meta<typeof Board>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = { args: { cards } };
