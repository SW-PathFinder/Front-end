import { SaboteurSessionAdapter } from "@/libs/saboteur/adapter";

import { HSSaboteurSocket } from "./socket";

export class HSSaboteurSessionAdapter implements SaboteurSessionAdapter {
  private socket: HSSaboteurSocket;

  constructor(socket: HSSaboteurSocket) {
    this.socket = socket;
  }

  // sendAction()
}
