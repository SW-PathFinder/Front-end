// import { curRound } from "@/utils/game";
import { useGameSession } from "@/contexts/GameSessionContext";
import { AbstractSaboteurPlayer } from "@/libs/saboteur/player";

import PlayerStatus from "./PlayerStatus";

interface Props {
  list?: AbstractSaboteurPlayer[];
}

const PlayerList = ({ list }: Props) => {
  const { gameSession } = useGameSession();
  const curRound = gameSession.round;

  return (
    <div className="h-fit w-full rounded border bg-base-100/70 shadow-xl">
      {list?.map((item) => <PlayerStatus key={item.id} item={item} />)}
      <div className="flex h-[54px] flex-col items-center justify-center border p-1">
        <p className="text-xl">Round {curRound} / 3</p>
      </div>
    </div>
  );
};

export default PlayerList;
