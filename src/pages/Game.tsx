import { useState, useEffect, useCallback } from "react";

import { RulebookButton } from "@/components/Common/RulebookButton";
import { ActionZone } from "@/components/Game/ActionZone";
import { Board } from "@/components/Game/Board";
import { DndZone } from "@/components/Game/Dnd";
import { Hand } from "@/components/Game/Hand";
import PlayerList from "@/components/Game/PlayerList";
import RevealDestModal from "@/components/Game/RevealDestModal";
import { useGameSession } from "@/contexts/GameSessionContext";
import { SaboteurAction } from "@/libs/saboteur/adapter/action";
import { SaboteurCard } from "@/libs/saboteur/cards";
import { PlayerRole } from "@/libs/saboteur/types";

const Game = () => {
  const { gameSession } = useGameSession();
  const [destInfo, setDestInfo] = useState(
    null as null | { x: number; y: number },
  );
  const [destModalOpen, setDestModalOpen] = useState(false);
  const [destCard, setDestCard] = useState(
    null as null | SaboteurCard.Path.Abstract,
  );

  useEffect(() => {
    if (destInfo === null) return;
    const revealedCard = gameSession.board.getCard(destInfo.x, destInfo.y);
    setDestCard(revealedCard);
    setDestModalOpen(true);
  }, [gameSession.board, destInfo]);

  const onDropCard = useCallback(
    (
      x: number,
      y: number,
      card: SaboteurCard.Abstract.Playable,
      prevCard: SaboteurCard.Path.Abstract | null,
    ) => {
      if (card instanceof SaboteurCard.Path.Abstract) {
        gameSession.sendAction(new SaboteurAction.Request.Path({ x, y, card }));
      } else if (
        card instanceof SaboteurCard.Action.Destroy &&
        prevCard instanceof SaboteurCard.Path.Abstract
      ) {
        gameSession.sendAction(
          new SaboteurAction.Request.Destroy({ x, y, card }),
        );
      } else if (
        card instanceof SaboteurCard.Action.Map &&
        prevCard instanceof SaboteurCard.Path.Abstract
      ) {
        // 지도 카드
        gameSession.adapter.on("revealDest", (data) => {
          console.log("지도 카드 사용 결과:", data);
          setDestInfo(data.data);
        });
        gameSession.sendAction(
          new SaboteurAction.Request.UseMap({ x, y, card }),
        );
      }
    },
    [gameSession],
  );

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-base-200 px-4 md:px-8">
      {/* 상단: 플레이어 차례 */}
      <header className="flex flex-col items-center justify-center bg-base-200 p-4">
        <p
          className={
            gameSession.myPlayer.role === PlayerRole.Saboteur
              ? "text-red-500"
              : "" + " text-lg font-semibold"
          }
        >
          나의 역할 :{" "}
          {gameSession.myPlayer.role === PlayerRole.Saboteur
            ? "방해꾼"
            : "광부"}
        </p>
        <p className="text-lg font-semibold">
          {gameSession.currentPlayer.name === gameSession.myPlayer.name
            ? "내 차례"
            : `${gameSession.currentPlayer.name}의 차례`}
        </p>
      </header>
      {/* 메인 영역: 좌측 사이드바, 보드, 로그 */}
      <div className="flex overflow-hidden">
        {/* 좌측 사이드바 */}
        <aside className="mr-6 flex w-[200px] flex-shrink-0 flex-col items-start gap-4 self-center overflow-auto bg-base-200 p-4">
          <PlayerList list={gameSession.players} />
          <div className="flex w-full items-center justify-evenly">
            <RulebookButton />
            <img
              className="h-16 w-16 cursor-pointer"
              src="/buttons/emoji_button.svg"
              alt="emoji chat"
            />
          </div>
        </aside>
        {/* 중앙 보드 & 핸드 */}
        <main className="relative flex flex-1 flex-col items-center justify-center">
          <DndZone>
            <Board
              board={gameSession.board}
              onDropCard={onDropCard}
              className="mb-[100px] h-1/2 w-full"
            />
            <div className="absolute bottom-0 flex h-[150px] w-full max-w-[540px] items-center justify-between px-4">
              <ActionZone
                action="discard"
                className="aspect-square w-36 rounded-full"
              />
              <div className="relative flex h-full w-full items-center justify-center">
                <Hand
                  cards={gameSession.myPlayer.hands}
                  className="absolute top-0"
                />
              </div>
              <ActionZone
                action="rotate"
                className="aspect-square w-36 rounded-full"
              />
            </div>
          </DndZone>
          {destCard && (
            <RevealDestModal
              isOpen={destModalOpen}
              onClose={() => setDestModalOpen(false)}
              revealedCard={destCard}
            />
          )}
        </main>
        {/* 우측 사이드: 남은 카드 수 + 로그 */}
        <div className="p-x-4 mb-4 ml-6 flex flex-shrink-0 flex-col items-center gap-4 overflow-auto bg-base-200">
          <div className="flex w-[150px] flex-col items-center gap-4">
            <img
              className="w-1/2 rounded-xl shadow-2xs"
              src="/assets/saboteur/cards/bg_playable.png"
              alt="card back"
            />
            <p>남은 카드 : {gameSession.remainingCards}장</p>
          </div>
          <aside className="bg-opacity-50 h-full w-48 overflow-auto rounded bg-base-300 p-2">
            <p className="text-center text-sm">게임 로그</p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Game;
