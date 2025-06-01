import { useState } from "react";

import type { Meta } from "@storybook/react";

import {
  SabotageActionCard,
  RepairActionCard,
} from "@/libs/saboteur/cards/action";
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
    name: "Dami",
    status: { lantern: true, pickaxe: true, wagon: true },
    hand: 3,
  }),
  new OtherPlayer({
    name: "Doo Hyun",
    status: { lantern: true, pickaxe: false, wagon: false },
    hand: 2,
  }),
  new OtherPlayer({
    name: "Jiwoo",
    status: { lantern: true, pickaxe: true, wagon: false },
    hand: 1,
  }),
  new OtherPlayer({
    name: "Dohoon",
    status: { lantern: false, pickaxe: true, wagon: true },
    hand: 3,
  }),
  new OtherPlayer({
    name: "Jaehoon",
    status: { lantern: true, pickaxe: true, wagon: false },
    hand: 3,
  }),
  new OtherPlayer({
    name: "Namhoon",
    status: { lantern: false, pickaxe: true, wagon: true },
    hand: 3,
  }),
  new OtherPlayer({
    name: "Hayoung",
    status: { lantern: true, pickaxe: false, wagon: true },
    hand: 3,
  }),
  new OtherPlayer({
    name: "Nutria",
    status: { lantern: true, pickaxe: true, wagon: true },
    hand: 3,
  }),
  new OtherPlayer({
    name: "Schott",
    status: { lantern: true, pickaxe: true, wagon: true },
    hand: 3,
  }),
];

const card1 = new RepairActionCard([Tools.Lantern, Tools.Wagon]);

const card2 = new SabotageActionCard(Tools.Wagon);

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
