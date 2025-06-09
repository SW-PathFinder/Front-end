import { useGameSession } from "@/contexts/GameSessionContext";
import {
  AbstractSaboteurPlayer,
  MySaboteurPlayer,
} from "@/libs/saboteur/player";
import { PLAYER_STATUS } from "@/libs/saboteur/resources";
import { Tools } from "@/libs/saboteur/types";

interface PlayerStatusProps {
  item: AbstractSaboteurPlayer;
}

const PlayerStatus = ({ item }: PlayerStatusProps) => {
  const { gameSession } = useGameSession();
  const isMe = item === gameSession.myPlayer;

  const goldDisplay =
    isMe && item instanceof MySaboteurPlayer ? item.gold : "?";

  return (
    <div className="flex flex-row items-center justify-between border p-2 pt-1">
      <div className="flex flex-col gap-2">
        <p>
          {item.name} {item.name === gameSession.myPlayer.name ? "(나)" : ""}
        </p>
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
              src="/assets/saboteur/cards/bg_playable.png"
              alt="card back"
            />
            <p>{item.handCount}</p>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="h-4 w-4"
              style={{
                backgroundImage: "url(/assets/saboteur/icons.png)",
                backgroundPosition: "-40px 0",
                backgroundSize: "60px 20px",
                marginBottom: "2px",
                marginLeft: "6px",
                marginRight: "3px",
                top: "6px",
                width: "20px",
                height: "20px",
                backgroundRepeat: "no-repeat",
              }}
            />
            <span className="font-semibold">{goldDisplay}</span>
          </div>
        </div>
      </div>
      {/* {item?.winning && <div className="text-xl">🥳</div>} */}
    </div>
  );
};

export default PlayerStatus;
