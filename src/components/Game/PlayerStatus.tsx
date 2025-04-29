import { DummyInterface } from "./PlayerList";
import { PLAYER_STATUS } from "../../constants/Game/status";
import { Tools } from "../../libs/gameLogics";

interface DummyProps {
  item: DummyInterface;
}

const PlayerStatus = ({ item }: DummyProps) => {
  return (
    <div className="border flex flex-col p-1">
      <p>{item.name}</p>
      <div className="flex gap-4 h-[20px]">
        <div className="flex gap-1 items-center">
          {(Object.entries(item.status) as [Tools, boolean][]).map(([tool, able]) =>
            <img className="h-full" src={able ? PLAYER_STATUS[tool].enable : PLAYER_STATUS[tool].disable} alt={tool} />)}
        </div>
        <div className="flex gap-1 items-center">
          <img className="h-full" src="/cards/card_tool_back.png" alt="card_tool_back" />
          <p>{item.deck}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatus;
