import { SocketAction } from "@/services/socket/gameAction";

type BaseEmitEvent<T> = { requestId: string } & T;

export interface EmitEvents {
  set_username: (data: BaseEmitEvent<{ username: string }>) => void;
  create_room: (
    data: BaseEmitEvent<{
      max_players: number;
      is_public: boolean;
      card_helper: boolean;
    }>,
  ) => void;
  quick_match: (
    data: BaseEmitEvent<{ max_players: number; card_helper: boolean }>,
  ) => void;
  search_room_by_code: (data: BaseEmitEvent<{ room_code: string }>) => void;

  join_game: (data: BaseEmitEvent<{ room: string; player: string }>) => void;
  leave_room: (data: BaseEmitEvent<{ room: string; player: string }>) => void;

  game_action: (
    data: BaseEmitEvent<{
      room: string;
      player: string;
      action: SocketAction.Request.Primitive;
    }>,
  ) => void;
  chat: (data: BaseEmitEvent<{ room: string; message: string }>) => void;
}
