import { useMemo, useState } from "react";

import { twMerge } from "tailwind-merge";

import { SaboteurCard } from "@/libs/saboteur/cards";
import { AbstractSaboteurPlayer } from "@/libs/saboteur/player";
import { PLAYER_STATUS } from "@/libs/saboteur/resources";
import { Tools } from "@/libs/saboteur/types";

type EquipmentModalProps = {
  playerlist: AbstractSaboteurPlayer[];
  card: SaboteurCard.Action.Sabotage | SaboteurCard.Action.Repair;
  handNum: number;
  onClose: () => void;
};

const TOOL_LABEL: Record<Tools, string> = {
  lantern: "랜턴",
  mineCart: "수레",
  pickaxe: "곡괭이",
};

const EquipmentModal = ({
  playerlist,
  card,
  handNum,
  onClose,
}: EquipmentModalProps) => {
  const mode =
    card instanceof SaboteurCard.Action.Sabotage ? "sabotage" : "repair";
  const [validationMsg, setValidationMsg] = useState<string>("");
  const [canUse, setCanUse] = useState<boolean>(false);
  const [targetPlayer, setTargetPlayer] = useState<string>("");
  const [brokenTools, setBrokenTools] = useState<Tools[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tools | null>(null);

  const toolsName = useMemo(() => {
    if (mode === "repair") {
      return (card as SaboteurCard.Action.Repair).tools
        .map((tool) => TOOL_LABEL[tool])
        .join(", ");
    } else {
      return TOOL_LABEL[(card as SaboteurCard.Action.Sabotage).tool[0]];
    }
  }, [card, mode]);

  const handleClickPlayer = (player: AbstractSaboteurPlayer) => {
    const isRepair = mode === "repair";
    const repairCard = isRepair ? (card as SaboteurCard.Action.Repair) : null;
    const targetTools = isRepair
      ? repairCard!.tools.filter((t) => !player.status[t])
      : (() => {
          const t = (card as SaboteurCard.Action.Sabotage).tool[0];
          return player.status[t] ? [t] : [];
        })();
    const usable = targetTools.length > 0;
    setBrokenTools(isRepair ? targetTools : []);

    // 도구 선택 로직
    const chosenTool =
      usable && targetTools.length === 1 ? targetTools[0] : null;
    setSelectedTool(chosenTool);
    setCanUse(usable && (mode !== "repair" || chosenTool !== null));
    setTargetPlayer(player.name);

    // 메시지 설정: 선택 UI 있음 -> 빈 문자열, 단일 선택시 바로 메시지 노출, 실패시 불가 메시지
    if (!usable) {
      setValidationMsg("사용할 수 없습니다");
    } else if (chosenTool) {
      setValidationMsg(
        `${TOOL_LABEL[chosenTool]} ${isRepair ? "수리" : "파괴"}를 ${player.name}에게 사용하시겠습니까?`,
      );
    } else {
      // 멀티 선택이 필요한 경우에는 메시지 숨김
      setValidationMsg("");
    }
  };

  const handleConfirm = () => {
    if (canUse && (mode !== "repair" || selectedTool)) {
      // TODO: Socket으로 변경
      alert(
        `type: ${mode}, player_name: ${targetPlayer}, hand_num: ${handNum}, tool: ${selectedTool}`,
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
        {(brokenTools.length > 1 || validationMsg) && (
          <div className="mt-4 flex flex-col items-center gap-4">
            {brokenTools.length > 1 ? (
              <div className="flex flex-row items-center gap-4">
                <p>수리할 도구를 선택하세요</p>
                <div className="flex gap-2">
                  {brokenTools.map((t) => (
                    <button
                      key={t}
                      className={twMerge(
                        "btn",
                        selectedTool !== t && "btn-outline",
                        selectedTool === t && "btn-secondary",
                      )}
                      onClick={() => {
                        setSelectedTool(t);
                        setCanUse(true);
                        setValidationMsg(
                          `${TOOL_LABEL[t]} 수리를 ${targetPlayer}에게 사용하시겠습니까?`,
                        );
                      }}
                    >
                      {TOOL_LABEL[t]}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <p>{validationMsg}</p>
              </>
            )}
            <button
              className="btn w-1/3 btn-primary"
              disabled={!canUse}
              onClick={handleConfirm}
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
