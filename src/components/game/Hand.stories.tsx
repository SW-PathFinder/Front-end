import type { Meta, StoryObj } from "@storybook/react";
import { Hand } from "./Hand";
import { DndZone } from "./Dnd";
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

const HandStory = () => {
  return (
    <DndZone>
      <Hand
        cards={[
          { id: "1", image: "path_1.png" },
          { id: "2", image: "path_2.png" },
          { id: "3", image: "path_3.png" },
          { id: "4", image: "path_4.png" },
          { id: "5", image: "path_5.png" },
          { id: "6", image: "path_6.png" },
        ]}
      />
    </DndZone>
  );
};

export const Default: Story = {
  args: { cards: [] },
  parameters: { layout: "centered" },
  render: () => <HandStory />,
};
