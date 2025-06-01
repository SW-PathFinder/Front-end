import { SocketAction } from "@/services/socket/gameAction";

interface FailureEvent {
  success: false;
  message: string;
}
export interface ListenEvents {
  username_result: (
    data: { success: true; username: string } | FailureEvent,
  ) => void;

  room_created: (
    data:
      | { success: true; room: { room_id: string }; room_id: string }
      | FailureEvent,
  ) => void;

  room_search_result: (
    data: { success: true; room: { room_id: string } } | FailureEvent,
  ) => void;

  quick_match_result: (
    data: { success: true; room: { room_id: string } } | FailureEvent,
  ) => void;

  join_room_result: (
    data: { success: true; room: { room_id: string } } | FailureEvent,
  ) => void;

  game_update: (data: SocketAction.Response.Actions) => void;
  private_game_update: (data: SocketAction.Response.Actions) => void;

  error: (data: { message: string }) => void;
}
