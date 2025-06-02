import { useEffect, useState } from "react";

import { RulebookButton } from "@/components/Common/RulebookButton";
import { Board, BOARD_COLS, BOARD_ROWS } from "@/components/Game/Board";
import { DndZone } from "@/components/Game/Dnd";
import { Hand } from "@/components/Game/Hand";
import PlayerList from "@/components/Game/PlayerList";
import { useGameSession } from "@/contexts/GameSessionContext";
import { AbstractCard, PathCard } from "@/libs/saboteur/cards";
import { AbstractPlayer, OtherPlayer } from "@/libs/saboteur/player";

// import { fn } from "@storybook/test";

const dummyCards: AbstractCard.Playable[] = [
  new PathCard.Way4(),
  new PathCard.Way4(),
  new PathCard.Way4(),
  new PathCard.Way4(),
  new PathCard.Way4(),
  new PathCard.Way4(),
];

const Game = () => {
  const { participants } = useGameSession();

  const dummyList: AbstractPlayer[] = participants.map(
    (participant) =>
      new OtherPlayer({
        name: participant,
        status: { lantern: true, pickaxe: true, wagon: true },
        hand: 3,
      }),
  );

  const [hands, setHand] = useState<AbstractCard.Playable[]>(() => []);

  const dummyBoardCards: (PathCard.Abstract | null)[][] = Array.from(
    { length: BOARD_ROWS },
    () => {
      return Array.from({ length: BOARD_COLS }, () => null);
    },
  );

  dummyBoardCards[11][7] = new PathCard.Origin();
  dummyBoardCards[9][15] = new PathCard.DestHidden();
  dummyBoardCards[11][15] = new PathCard.DestHidden();
  dummyBoardCards[13][15] = new PathCard.DestHidden();

  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHand(dummyCards);
    // setIsLoading(false);
    // setError(null);
  }, []);

  const remainingCards = 8;

  return (
    <div className="relative flex flex-col p-3">
      <div className="absolute top-2 left-2 z-10 flex w-[180px] flex-col gap-6">
        <PlayerList list={dummyList} />
        <div className="flex h-[60px] w-full items-center justify-center gap-6">
          <RulebookButton />
          <img
            className="h-full hover:cursor-pointer"
            src="/buttons/emoji_button.svg"
            alt="emoji chat"
          />
        </div>
      </div>
      <div className="absolute top-2 right-2 z-10 flex w-[150px] flex-col items-center justify-center gap-2 bg-transparent">
        <img
          className="w-full rounded-2xl shadow-2xs"
          src="/assets/saboteur/cards/bg_playable.png"
          alt="card back"
        />
        <p>남은 카드 수 : {remainingCards}장</p>
      </div>
      <div className="relative flex h-screen w-screen flex-col items-center justify-center">
        <DndZone>
          <Board cards={dummyBoardCards} className="mb-[100px] h-9/10 w-full" />
          <div className="absolute bottom-0 flex h-[150px] w-full max-w-[480px] items-center justify-between px-4">
            <button className="btn btn-primary">버리기</button>
            <div className="relative flex h-full w-full items-center justify-center">
              <Hand cards={dummyCards} className="absolute top-0" />
            </div>
            <button className="btn btn-primary">회전</button>
          </div>
        </DndZone>
      </div>
    </div>
  );
};

export default Game;
