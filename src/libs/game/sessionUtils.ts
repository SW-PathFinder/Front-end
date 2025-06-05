// src/libs/gameSessionUtils.ts
import { GameSessionContext } from "@/contexts/GameSessionContext";

export const setRoomSession = (
  room: { room_id: string; max_players: number; players: string[] },
  setters: Pick<
    GameSessionContext,
    "setRoomId" | "setCapacity" | "setParticipants"
  >,
) => {
  setters.setRoomId(room.room_id);
  setters.setCapacity(room.max_players);
  setters.setParticipants(room.players);
};
