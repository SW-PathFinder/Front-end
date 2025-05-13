import type { Meta, StoryObj } from "@storybook/react";

import { Schema } from "../../types";
import { Board, BOARD_ROWS, BOARD_COLS } from "./Board";
import { DndZone } from "./Dnd";

// import { fn } from "@storybook/test";

const cards: (Schema.Card | null)[][] = Array.from(
  { length: BOARD_ROWS },
  () => {
    return Array.from({ length: BOARD_COLS }, () => null);
  },
);

cards[11][7] = { id: "start", image: "start.png" };
cards[9][15] = { id: "dest_gold", image: "dest_gold.png" };
cards[11][15] = { id: "dest_rock1", image: "dest_rock1.png" };
cards[13][15] = { id: "dest_rock2", image: "dest_rock2.png" };

const BoardStory = ({ cards }: { cards: (Schema.Card | null)[][] }) => {
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
