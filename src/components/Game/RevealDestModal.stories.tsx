import { useState } from "react";

import type { Meta } from "@storybook/react";

import { SaboteurCard } from "@/libs/saboteur/cards";

import RevealDestModal from "./RevealDestModal";

const meta: Meta<typeof RevealDestModal> = {
  title: "Game/RevealDestModal",
  component: RevealDestModal,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false);
  const card = new SaboteurCard.Path.DestGold();
  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
        목적지 공개
      </button>
      <RevealDestModal
        isOpen={isOpen}
        revealedCard={card}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
