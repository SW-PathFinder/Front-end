import { PLAYER_STATUS } from "@/constants/Game/status";
import { Tools } from "@/libs/gameLogics";
import { DummyInterface } from "@/types";

interface DummyProps {
  item: DummyInterface;
}

const PlayerStatus = ({ item }: DummyProps) => {
  return (
    <div className="flex flex-row items-center justify-between border p-1 pr-4">
      <div className="flex flex-col">
        <p>{item.name}</p>
        <div className="flex h-[20px] gap-4">
          <div className="flex items-center gap-1">
            {(Object.entries(item.status) as [Tools, boolean][]).map(
              ([tool, able]) => (
                <img
                  key={tool}
                  className="h-full"
                  src={
                    able
                      ? PLAYER_STATUS[tool].enable
                      : PLAYER_STATUS[tool].disable
                  }
                  alt={tool}
                />
              ),
            )}
          </div>
          <div className="flex items-center gap-1">
            <img
              className="h-full"
              src="/assets/saboteur/cards/card_general_bg.png"
              alt="card back"
            />
            <p>{item.hand}</p>
          </div>
        </div>
      </div>
      {item?.winning && <div className="text-xl">🥳</div>}
    </div>
  );
};

export default PlayerStatus;
