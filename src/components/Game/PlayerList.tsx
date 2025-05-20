import PlayerStatus from "./PlayerStatus";
import { DummyInterface } from "../../pages/Game";
interface Props {
  list: DummyInterface[];
}

const PlayerList = ({ list }: Props) => {
  /** will be replaced by the above line (for BE) */
  // const PlayerList = () => {
  return (
    <div className="border h-fit w-[180px]">
      {list?.map((item) => <PlayerStatus key={item.id} item={item} />)}
    </div>
  );
};

export default PlayerList;
