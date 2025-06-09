import { Tools } from "../types";

export const PLAYER_STATUS: Record<Tools, { enable: string; disable: string }> =
  {
    lantern: {
      enable: "/status/lantern_enable.png",
      disable: "/status/lantern_disable.png",
    },
    mineCart: {
      enable: "/status/mineCart_enable.png",
      disable: "/status/mineCart_disable.png",
    },
    pickaxe: {
      enable: "/status/pick_enable.png",
      disable: "/status/pick_disable.png",
    },
  };
