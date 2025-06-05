import { SocketAction } from "./gameAction";

interface BaseListenEvent {
  id: number;
}

interface BaseFailableListenEvent extends BaseListenEvent {
  success: boolean;
  requestId?: string;
}

type SuccessEvent<T> = BaseFailableListenEvent & { success: true } & T;
interface FailureEvent extends BaseFailableListenEvent {
  success: false;
  message: string;
}

type FailableListenEvent<T> = SuccessEvent<T> | FailureEvent;

type RoomData = {
  room_id: string;
  /** @description room host player id */
  host: string;
  is_public: boolean;
  max_players: number;
  card_helper: boolean;
  /** @description player ids in room */
  players: string[];
  player_count: number;
  is_started: boolean;
};

export interface ListenEvents {
  username_result: FailableListenEvent<{ username: string }>;

  room_created: FailableListenEvent<{ room: RoomData; room_id: string }>;

  room_search_result: FailableListenEvent<{ room: RoomData }>;

  quick_match_result: FailableListenEvent<{ room: RoomData }>;

  join_room_result: FailableListenEvent<{ room: RoomData }>;

  player_joined: BaseListenEvent & {
    /** @description joined player id */
    player: string;
    /** @description player ids in the room */
    players: string[];
    /** @description room id */
    room: string;
    /** @description player count */
    player_count: number;
  };

  player_left: BaseListenEvent & {
    /** @description left player id */
    player: string;
    /** @description player ids in the room */
    players: string[];
    /** @description room id */
    room: string;
    /** @description player count */
    player_count: number;
  };

  host_changed: BaseListenEvent & {
    /** @description new host player id */
    new_host: string;
  };

  countdown_started: BaseListenEvent & { seconds: number; message: string };

  countdown_tick: BaseListenEvent & { seconds_left: number; message: string };

  game_update: SocketAction.Response.Broadcast.Primitive;
  private_game_update: SocketAction.Response.Private.Primitive;

  // error: (data: { id: number;
  // success: false; message: string; requestId?: string }) => void;
}

export type ListenEventType = keyof ListenEvents;
export type ResponsibleListenEventType = {
  [K in keyof ListenEvents]: ListenEvents[K] extends FailableListenEvent<unknown>
    ? K
    : never;
}[keyof ListenEvents];
