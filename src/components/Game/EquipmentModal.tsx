import { useMemo, useState } from "react";

import { twMerge } from "tailwind-merge";

import { useGameSession } from "@/contexts/GameSessionContext";
import { SaboteurAction } from "@/libs/saboteur/adapter/action";
import { SaboteurCard } from "@/libs/saboteur/cards";
import { AbstractSaboteurPlayer } from "@/libs/saboteur/player";
import { PLAYER_STATUS } from "@/libs/saboteur/resources";
import { Tools } from "@/libs/saboteur/types";

type EquipmentModalProps = {
  playerlist?: AbstractSaboteurPlayer[];
  equipCard: null | SaboteurCard.Action.Sabotage | SaboteurCard.Action.Repair;
  onClose: () => void;
};

const TOOL_LABEL: Record<Tools, string> = {
  lantern: "랜턴",
  mineCart: "수레",
  pickaxe: "곡괭이",
};

export function EquipmentModal({
  playerlist,
  equipCard,
  onClose,
}: EquipmentModalProps) {
  const mode =
    equipCard instanceof SaboteurCard.Action.Sabotage ? "sabotage" : "repair";
  const [validationMsg, setValidationMsg] = useState<string>("");
  const [canUse, setCanUse] = useState<boolean>(false);
  const [targetPlayer, setTargetPlayer] =
    useState<AbstractSaboteurPlayer | null>(null);
  const [brokenTools, setBrokenTools] = useState<Tools[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tools | null>(null);
  const { gameSession } = useGameSession();

  const gridColClass = useMemo(() => {
    const count = playerlist?.length ?? 0;

    // 3~10만 처리
    const colMap: Record<number, string> = {
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-3",
      7: "grid-cols-4",
      8: "grid-cols-4",
      9: "grid-cols-5",
      10: "grid-cols-5",
    };

    return colMap[count] ?? "grid-cols-4";
  }, [playerlist]);

  const toolsName = useMemo(() => {
    if (mode === "repair") {
      return (equipCard as SaboteurCard.Action.Repair).tools
        .map((tool) => TOOL_LABEL[tool])
        .join(", ");
    } else {
      return TOOL_LABEL[(equipCard as SaboteurCard.Action.Sabotage).tool[0]];
    }
  }, [equipCard, mode]);

  const handleClickPlayer = (player: AbstractSaboteurPlayer) => {
    const isRepair = mode === "repair";
    const repairCard = isRepair
      ? (equipCard as SaboteurCard.Action.Repair)
      : null;
    const targetTools = isRepair
      ? repairCard!.tools.filter((t) => !player.status[t])
      : (() => {
          const t = (equipCard as SaboteurCard.Action.Sabotage).tool[0];
          return player.status[t] ? [t] : [];
        })();
    const usable = targetTools.length > 0;
    setBrokenTools(isRepair ? targetTools : []);

    // 도구 선택 로직
    const chosenTool =
      usable && targetTools.length === 1 ? targetTools[0] : null;
    setSelectedTool(chosenTool);
    setCanUse(usable && (mode !== "repair" || chosenTool !== null));
    setTargetPlayer(player);

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
    if (!canUse || !targetPlayer || (mode === "repair" && !selectedTool))
      return;

    if (mode === "repair") {
      gameSession.sendAction(
        new SaboteurAction.Request.Repair({
          player: targetPlayer,
          card: equipCard as SaboteurCard.Action.Repair,
          tool: selectedTool!,
        }),
      );
    } else if (mode === "sabotage") {
      gameSession.sendAction(
        new SaboteurAction.Request.Sabotage({
          player: targetPlayer,
          card: equipCard as SaboteurCard.Action.Sabotage,
        }),
      );
    }

    onClose();
  };

  return (
    <dialog open className="modal" onCancel={onClose} onClose={onClose}>
      <div className="relative modal-box w-11/12 max-w-5xl">
        <form method="dialog">
          <button
            type="button"
            className="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm"
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        <p className="mb-4 text-center text-2xl font-semibold">
          {toolsName} {mode === "repair" ? "수리" : "파괴"}하기
        </p>
        <div className={`grid ${gridColClass} gap-4`}>
          {playerlist?.map((player) => (
            <div
              key={player.name}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-gray-600 p-2 hover:bg-base-300 ${player.name === targetPlayer?.name && "border-warning ring-2 ring-warning"}`}
              onClick={() => handleClickPlayer(player)}
            >
              <p>
                {player.name}{" "}
                {player.name === gameSession.myPlayer.name && "(나)"}
              </p>
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
}
