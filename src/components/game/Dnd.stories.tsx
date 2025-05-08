import { DndZone, Draggable, Droppable } from "./Dnd";
import { Card } from "./Card";
import type { Meta, StoryObj } from "@storybook/react";
import { createPortal } from "react-dom";
import { ReactNode, useState } from "react";
import { DndContext } from "@dnd-kit/core";
// import { fn } from "@storybook/test";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Game/Dnd",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const DndStory = () => {
  return (
    <DndZone>
      {/* hand */}
      <p>Hand</p>
      <Droppable className="flex items-center gap-2 w-96 h-28 border-2">
        <Draggable>
          <Card cardId={1} />
        </Draggable>
        <Draggable>
          <Card cardId={1} />
        </Draggable>
        <Draggable>
          <Card cardId={1} />
        </Draggable>
      </Droppable>

      <p>Fields</p>
      <section className="grid grid-cols-2 items-center w-fit">
        <Droppable className="flex w-48 h-28 border-2">
        </Droppable>
        <Droppable className="flex w-48 h-28 border-2">
        </Droppable>
        <Droppable className="flex w-48 h-28 border-2">
        </Droppable>
        <Droppable className="flex w-48 h-28 border-2">
        </Droppable>
      </section>
    </DndZone>
  );
};

export const Default: Story = {
  parameters: { layout: "fullscreen" },
  render: () => <DndStory />,
};
