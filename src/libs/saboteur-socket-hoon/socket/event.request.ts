import { SocketAction } from "./gameAction";

type BaseEmitEvent<T> = { requestId: string } & T;

export interface EmitEvents {
  set_username: BaseEmitEvent<{ username: string }>;
  create_room: BaseEmitEvent<{
    max_players: number;
    is_public: boolean;
    card_helper: boolean;
  }>;
  quick_match: BaseEmitEvent<{ max_players: number; card_helper: boolean }>;
  search_room_by_code: BaseEmitEvent<{ room_code: string }>;

  join_game: BaseEmitEvent<{ room: string; player: string }>;
  leave_room: { room: string; player: string };

  game_action: {
    room: string;
    player: string;
    action: SocketAction.Request.Primitive;
  };
  chat: BaseEmitEvent<{ room: string; message: string }>;
}
