import { useMemo, useState } from "react";

import { SaboteurCard } from "@/libs/saboteur/cards";
import { AbstractPlayer } from "@/libs/saboteur/player";
import { PLAYER_STATUS } from "@/libs/saboteur/resources";
import { Tools } from "@/libs/saboteur/types";

type EquipmentModalProps = {
  playerlist: AbstractPlayer[];
  card: SaboteurCard.Action.Sabotage | SaboteurCard.Action.Repair;
  handNum: number;
  onClose: () => void;
};

const TOOL_LABEL: Record<Tools, string> = {
  lantern: "랜턴",
  mineCart: "광차",
  pickaxe: "곡괭이",
};

const EquipmentModal = ({
  playerlist,
  card,
  handNum,
  onClose,
}: EquipmentModalProps) => {
  const [mode] = useState<"repair" | "sabotage">(
    card instanceof SaboteurCard.Action.Sabotage ? "sabotage" : "repair",
  );
  const [validationMsg, setValidationMsg] = useState<string>("");
  const [canUse, setCanUse] = useState<boolean>(false);
  const [targetPlayer, setTargetPlayer] = useState<string>("");

  const toolsName = useMemo(() => {
    if (mode === "repair") {
      return (card as SaboteurCard.Action.Repair).tools
        .map((tool) => TOOL_LABEL[tool])
        .join(", ");
    } else {
      return TOOL_LABEL[(card as SaboteurCard.Action.Sabotage).tool[0]];
    }
  }, [card, mode]);

  const handleClickPlayer = (player: AbstractPlayer) => {
    let usable = false;
    if (mode === "repair") {
      const repairCard = card as SaboteurCard.Action.Repair;
      usable = repairCard.tools.some((t) => player.status[t] === false);
    } else {
      const sabotageCard = card as SaboteurCard.Action.Sabotage;
      usable = player.status[sabotageCard.tool[0]] === true;
    }
    setCanUse(usable);

    if (usable) {
      const actionObjectName =
        mode === "repair"
          ? toolsName
          : TOOL_LABEL[(card as SaboteurCard.Action.Sabotage).tool[0]];
      setValidationMsg(
        `${actionObjectName} ${
          mode === "repair" ? "수리" : "파괴"
        }를 ${player.name}에게 사용하시겠습니까?`,
      );
      setTargetPlayer(player.name);
    } else {
      setValidationMsg("사용할 수 없습니다");
    }
  };

  const handleConfirm = () => {
    if (canUse) {
      // Socket으로 변경
      alert(
        `type: ${mode}, player_name : ${targetPlayer}, hand_num: ${handNum}`,
      );
      onClose();
    }
  };

  return (
    <dialog open className="modal" onCancel={onClose} onClose={onClose}>
      <div className="relative modal-box w-11/12 min-w-xl">
        <form method="dialog">
          <button
            type="button"
            className="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm"
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        <p className="mb-4 text-center text-lg font-semibold">
          {toolsName} {mode === "repair" ? "수리" : "파괴"}하기
        </p>
        <div className="grid grid-cols-5 gap-4">
          {playerlist.map((player) => (
            <div
              key={player.name}
              className="flex cursor-pointer flex-col items-center gap-2 border p-2 hover:bg-gray-300"
              onClick={() => handleClickPlayer(player)}
            >
              <p>{player.name}</p>
              <div className="flex h-[20px] justify-center gap-4">
                <div className="flex items-center gap-1">
                  {(Object.entries(player.status) as [Tools, boolean][]).map(
                    ([tool, able]) => (
                      <img
                        key={tool}
                        className="h-full"
                        src={
                          able
                            ? PLAYER_STATUS[tool].enable
                            : PLAYER_STATUS[tool].disable
                        }
                        alt={TOOL_LABEL[tool]}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {validationMsg && (
          <div className="mt-4 flex flex-col items-center justify-center gap-y-4">
            {validationMsg}
            <button
              className="btn w-1/3 btn-primary"
              disabled={!canUse}
              onClick={() => {
                handleConfirm();
              }}
            >
              확인
            </button>
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default EquipmentModal;
