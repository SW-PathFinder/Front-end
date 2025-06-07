// import { curRound } from "@/utils/game";
import { AbstractSaboteurPlayer } from "@/libs/saboteur/player";

import PlayerStatus from "./PlayerStatus";

interface Props {
  list?: AbstractSaboteurPlayer[];
}

const PlayerList = ({ list }: Props) => {
  const curRound = 1; // This should be replaced with the actual current round logic

  return (
    <div className="h-fit w-full border bg-base-100/70 shadow-xl">
      {list?.map((item) => <PlayerStatus key={item.id} item={item} />)}
      <div className="flex h-[54px] flex-col items-center justify-center border p-1">
        Round {curRound} / 3
      </div>
    </div>
  );
};

export default PlayerList;
