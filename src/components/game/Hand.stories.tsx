import type { Meta, StoryObj } from "@storybook/react";
import { Hand } from "./Hand";
import { DndZone, Droppable } from "./Dnd";
import { useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";
import { Card } from "./Card";
// import { fn } from "@storybook/test";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Game/Hand",
  component: Hand,
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

const cards = [
  { id: "card-1", image: "path_1.png" },
  { id: "card-2", image: "path_2.png" },
  { id: "card-3", image: "path_3.png" },
  { id: "card-4", image: "path_4.png" },
  { id: "card-5", image: "path_5.png" },
  { id: "card-6", image: "path_6.png" },
];

const HandStory = () => {
  const [hands, setHand] = useState(() => cards);

  const [containers, setContainers] = useState<Array<{
    id: string;
    item?: { id: string; image: string };
  }>>(() => Array(45).fill({}).map((_, index) => ({
    id: `container-${index}`,
  })));

  // const { } = useDndContext();
  useDndMonitor({
    onDragEnd({ active, over }) {
      console.log("onDragEnd", { active, over });
      if (!over) return;

      const container = containers.find((container) => container.id === over.id);
      if (!container || container.item) return;

      const activeCard = cards.find((card) => card.id === active.id);
      if (!activeCard) return;

      setContainers((prev) =>
        prev.map((c) => {
          if (c.id === container.id)
            return { ...c, item: activeCard };
          if (c.item && c.item.id === active.id)
            return { ...c, item: undefined };
          return c;
        }),
      );
      setHand((prev) => prev.filter((card) => card.id !== active.id));
    },
  });

  return (
    <section className="flex flex-col justify-center items-center space-y-2">
      <section className="grid grid-cols-9 items-center w-fit">
        {containers.map((container, index) => (
          <Droppable id={container.id} className="flex justify-center items-center w-16 h-24 border-2" key={index}>
            {container.item && (
              <Card card={container.item} fixed />
            )}
          </Droppable>
        ))}
      </section>

      <Hand
        cards={hands}
      />
    </section>
  );
};

export const Default: Story = {
  args: { cards: [] },
  parameters: { layout: "centered" },
  render: () => (
    <DndZone>
      <HandStory />
    </DndZone>
  ),
};
