import { Socket } from "socket.io-client";

import { EmitEvents } from "./event.request";
import { ListenEvents } from "./event.response";

export type CustomSocketEventMap<T> = { [K in keyof T]: (data: T[K]) => void };

export type HSSaboteurSocket = Socket<
  CustomSocketEventMap<ListenEvents>,
  CustomSocketEventMap<EmitEvents>
>;
