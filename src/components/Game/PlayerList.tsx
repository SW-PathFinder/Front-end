import { DummyInterface } from "@/types";

import PlayerStatus from "./PlayerStatus";

interface Props {
  list?: DummyInterface[];
}

const PlayerList = ({ list }: Props) => {
  return (
    <div className="h-fit w-[180px] border">
      {list?.map((item) => <PlayerStatus key={item.id} item={item} />)}
    </div>
  );
};

export default PlayerList;
