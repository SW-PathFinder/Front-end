import { Tools } from "@/libs/saboteur/types";

export const PLAYER_STATUS: Record<Tools, { enable: string; disable: string }> =
  {
    lantern: {
      enable: "/status/lantern_enable.png",
      disable: "/status/lantern_disable.png",
    },
    wagon: {
      enable: "/status/wagon_enable.png",
      disable: "/status/wagon_disable.png",
    },
    pickaxe: {
      enable: "/status/pick_enable.png",
      disable: "/status/pick_disable.png",
    },
  };
