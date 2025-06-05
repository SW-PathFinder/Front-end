import { useState } from "react";

import type { Meta } from "@storybook/react";

import { SaboteurCard } from "@/libs/saboteur/cards";
import { OtherPlayer, type AbstractPlayer } from "@/libs/saboteur/player";
import { Tools } from "@/libs/saboteur/types";

import EquipmentModal from "./EquipmentModal";

const meta: Meta<typeof EquipmentModal> = {
  title: "Game/EquipmentModal",
  component: EquipmentModal,
  tags: ["autodocs"],
};

export default meta;

const dummyList: AbstractPlayer[] = [
  new OtherPlayer({
    id: "Dami",
    status: { lantern: true, pickaxe: true, mineCart: true },
    handCount: 3,
  }),
  new OtherPlayer({
    id: "Doo Hyun",
    status: { lantern: true, pickaxe: false, mineCart: false },
    handCount: 2,
  }),
  new OtherPlayer({
    id: "Jiwoo",
    status: { lantern: true, pickaxe: true, mineCart: false },
    handCount: 1,
  }),
  new OtherPlayer({
    id: "Dohoon",
    status: { lantern: false, pickaxe: true, mineCart: true },
    handCount: 3,
  }),
  new OtherPlayer({
    id: "Jaehoon",
    status: { lantern: true, pickaxe: true, mineCart: false },
    handCount: 3,
  }),
  new OtherPlayer({
    id: "Namhoon",
    status: { lantern: false, pickaxe: true, mineCart: true },
    handCount: 3,
  }),
  new OtherPlayer({
    id: "Hayoung",
    status: { lantern: true, pickaxe: false, mineCart: true },
    handCount: 3,
  }),
  new OtherPlayer({
    id: "Nutria",
    status: { lantern: true, pickaxe: true, mineCart: true },
    handCount: 3,
  }),
  new OtherPlayer({
    id: "Schott",
    status: { lantern: true, pickaxe: true, mineCart: true },
    handCount: 3,
  }),
];

const card1 = new SaboteurCard.Action.Repair([Tools.Lantern, Tools.MineCart]);

const card2 = new SaboteurCard.Action.Sabotage(Tools.MineCart);

export const Default = () => {
  const [mode, setMode] = useState<"repair" | "sabotage" | null>(null);
  const handleClose = () => setMode(null);

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setMode("repair")}>
        Open Repair Modal
      </button>
      <button
        className="btn ml-2 btn-secondary"
        onClick={() => setMode("sabotage")}
      >
        Open Sabotage Modal
      </button>

      {mode === "repair" && (
        <EquipmentModal
          playerlist={dummyList}
          card={card1}
          handNum={3}
          onClose={handleClose}
        />
      )}
      {mode === "sabotage" && (
        <EquipmentModal
          playerlist={dummyList}
          card={card2}
          handNum={1}
          onClose={handleClose}
        />
      )}
    </div>
  );
};
