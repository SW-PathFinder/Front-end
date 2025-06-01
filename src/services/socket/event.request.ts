import { SocketAction } from "@/services/socket/gameAction";

export interface EmitEvents {
  set_username: (data: { username: string }) => void;
  create_room: (data: {
    max_players: number;
    is_public: boolean;
    card_helper: boolean;
  }) => void;
  quick_match: (data: { max_players: number; card_helper: boolean }) => void;
  search_room_by_code: (data: { room_code: string }) => void;

  join_game: (data: { room: string; player: string }) => void;
  leave_room: (data: { room: string; player: string }) => void;

  game_action: (data: {
    room: string;
    player: string;
    action: SocketAction.Request.Actions;
  }) => void;
  chat: (data: { room: string; message: string }) => void;
}
