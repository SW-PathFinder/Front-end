import type { Meta, StoryObj } from "@storybook/react";

import { GameBoard } from "@/libs/saboteur/board";
import { SaboteurCard } from "@/libs/saboteur/cards";

import { Board } from "./Board";
import { DndZone } from "./Dnd";

// import { fn } from "@storybook/test";

const boards = new GameBoard();
boards.import([
  [[7, 11], new SaboteurCard.Path.Origin()],
  [[15, 9], new SaboteurCard.Path.DestGold()],
  [[15, 11], new SaboteurCard.Path.DestRockA()],
  [[15, 13], new SaboteurCard.Path.DestRockB()],
]);

const BoardStory = () => {
  return (
    <DndZone>
      <Board board={boards} />
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
export const Default: Story = { args: {} };
