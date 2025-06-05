import { SocketAction } from "@/services/socket/gameAction";

interface BaseListenEvent {
  id: number;
  success: boolean;
  requestId?: string;
}

type SuccessEvent<T> = BaseListenEvent & { success: true } & T;
interface FailureEvent extends BaseListenEvent {
  success: false;
  message: string;
}

type ListenEvent<T> = SuccessEvent<T> | FailureEvent;

export interface ListenEvents {
  username_result: (data: ListenEvent<{ username: string }>) => void;

  room_created: (
    data: ListenEvent<{ room: { room_id: string }; room_id: string }>,
  ) => void;

  room_search_result: (
    data: ListenEvent<{ room: { room_id: string } }>,
  ) => void;

  quick_match_result: (
    data: ListenEvent<{ room: { room_id: string } }>,
  ) => void;

  join_room_result: (data: ListenEvent<{ room: { room_id: string } }>) => void;

  game_update: (data: SocketAction.Response.Broadcast.Primitive) => void;
  private_game_update: (data: SocketAction.Response.Private.Primitive) => void;

  // error: (data: { id: number;
  // success: false; message: string; requestId?: string }) => void;
}
