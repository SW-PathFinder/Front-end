import { useDroppable, useDndMonitor } from "@dnd-kit/core";
import { twMerge } from "tailwind-merge";

import { useGameSession } from "@/contexts/GameSessionContext";
import { SaboteurAction } from "@/libs/saboteur/adapter/action";
import { SaboteurCard } from "@/libs/saboteur/cards";

interface ActionZoneProps {
  action: "discard" | "rotate";
  className?: string;
}

export function ActionZone({ action, className }: ActionZoneProps) {
  const { gameSession } = useGameSession();
  const { isOver, setNodeRef } = useDroppable({ id: action });

  useDndMonitor({
    onDragEnd: (event) => {
      if (event.over?.id === action) {
        const card = event.active.data.current?.card;
        if (
          action === "rotate" &&
          // TODO: SaboteurCard.Path.AbstractCommon 아니면 조용히 무시하지 않고 error 보여주기
          card instanceof SaboteurCard.Path.AbstractCommon
        ) {
          gameSession.sendAction(new SaboteurAction.Request.Rotate({ card }));

          console.log("Rotated card:", card);
        } else if (action === "discard" && gameSession.currentPlayer.isMe()) {
          gameSession.sendAction(new SaboteurAction.Request.Discard({ card }));

          console.log("Discarded card:", card);
        }
      }
    },
  });

  const label = action === "discard" ? "버리기" : "회전";
  const base =
    "flex items-center justify-center rounded border-2 border-dashed transition-colors";
  const activeClass = isOver
    ? action === "discard"
      ? "border-solid border-error ring-4 ring-error"
      : "border-solid border-info ring-4 ring-info"
    : "bg-base-200/50";

  return (
    <div ref={setNodeRef} className={twMerge(base, className, activeClass)}>
      {label}
    </div>
  );
}
