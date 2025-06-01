import { useState } from "react";

// import { fn } from "@storybook/test";
import { useDndMonitor } from "@dnd-kit/core";
import type { Meta, StoryObj } from "@storybook/react";

import { BaseCard, PathCard1ABlock, PathCard4Way } from "@/libs/saboteur/cards";

import { Card } from "./Card";
import { DndZone, Droppable } from "./Dnd";
import { Hand } from "./Hand";

const HandStory = ({ cards }: { cards: BaseCard.Playable[] }) => {
  const [hands, setHand] = useState(() => cards);

  const [containers, setContainers] = useState<
    Array<{ id: string; item?: BaseCard.Playable }>
  >(() =>
    Array(45)
      .fill({})
      .map((_, index) => ({ id: `container-${index}` })),
  );

  // const { } = useDndContext();
  useDndMonitor({
    onDragEnd({ active, over }) {
      console.log("onDragEnd", { active, over });
      if (!over) return;

      const container = containers.find(
        (container) => container.id === over.id,
      );
      if (!container || container.item) return;

      const activeCard = cards.find((card) => card.id === active.id);
      if (!activeCard) return;

      setContainers((prev) =>
        prev.map((c) => {
          if (c.id === container.id) return { ...c, item: activeCard };
          if (c.item && c.item.id === active.id)
            return { ...c, item: undefined };
          return c;
        }),
      );
      setHand((prev) => prev.filter((card) => card.id !== active.id));
    },
  });

  return (
    <section className="flex flex-col items-center justify-center space-y-2">
      <section className="grid w-fit grid-cols-9 items-center">
        {containers.map((container, index) => (
          <Droppable
            id={container.id}
            className="flex h-24 w-16 items-center justify-center border-2"
            key={index}
          >
            {container.item && <Card card={container.item} fixed />}
          </Droppable>
        ))}
      </section>

      <Hand cards={hands} />
    </section>
  );
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Game/Hand",
  component: HandStory,
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
} satisfies Meta<typeof Hand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cards: [
      new PathCard4Way(),
      new PathCard4Way(),
      new PathCard4Way(),
      new PathCard4Way(),
      new PathCard4Way(),
      new PathCard1ABlock(),
    ],
  },
  parameters: { layout: "centered" },
  render: (props) => (
    <DndZone>
      <HandStory {...props} />
    </DndZone>
  ),
};
