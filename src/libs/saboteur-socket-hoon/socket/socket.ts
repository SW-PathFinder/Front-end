import { Socket } from "socket.io-client";

import { CustomSocketEventMap } from "@/libs/socket-io";

import { EmitEvents } from "./event.request";
import { ListenEvents } from "./event.response";

export type HSSaboteurSocket = Socket<
  CustomSocketEventMap<ListenEvents>,
  CustomSocketEventMap<EmitEvents>
>;
