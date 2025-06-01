import { useEffect, useState } from "react";

import { Board, BOARD_ROWS, BOARD_COLS } from "@/components/Game/Board";
import { DndZone } from "@/components/Game/Dnd";
import { Hand } from "@/components/Game/Hand";
import PlayerList from "@/components/Game/PlayerList";
import { useGameSession } from "@/contexts/GameSessionContext";
import { DummyInterface } from "@/types";
import { Schema } from "@/types";

// import { fn } from "@storybook/test";

const dummyCards: Schema.Card[] = [
  {
    id: "card-1",
    image: "path_1.png",
    type: "path",
    pathType: "road",
    destructible: true,
    way: [true, true, true, true],
    flipped: false,
  },
  {
    id: "card-2",
    image: "path_2.png",
    type: "path",
    pathType: "road",
    destructible: true,
    way: [true, true, true, true],
    flipped: false,
  },
  {
    id: "card-3",
    image: "path_3.png",
    type: "path",
    pathType: "road",
    destructible: true,
    way: [true, true, true, true],
    flipped: false,
  },
  {
    id: "card-4",
    image: "path_4.png",
    type: "path",
    pathType: "road",
    destructible: true,
    way: [true, true, true, true],
    flipped: false,
  },
  {
    id: "card-5",
    image: "path_5.png",
    type: "path",
    pathType: "road",
    destructible: true,
    way: [true, true, true, true],
    flipped: false,
  },
  {
    id: "card-6",
    image: "path_6.png",
    type: "path",
    pathType: "road",
    destructible: true,
    way: [true, true, true, true],
    flipped: false,
  },
];

const Game = () => {
  const { participants } = useGameSession();

  const dummyList: DummyInterface[] = participants.map(
    (participant, index) => ({
      id: index + 1,
      name: participant,
      status: { lantern: true, pick: true, wagon: true },
      hand: 3,
    }),
  );

  const [hands, setHand] = useState<Schema.Card[]>(() => []);

  const dummyBoardCards: (Schema.Card | null)[][] = Array.from(
    { length: BOARD_ROWS },
    () => {
      return Array.from({ length: BOARD_COLS }, () => null);
    },
  );

  dummyBoardCards[11][7] = {
    id: "start",
    image: "start.png",
    type: "path",
    pathType: "start",
    destructible: false,
    way: [true, true, true, true],
    flipped: false,
  };
  dummyBoardCards[9][15] = {
    id: "dest_gold",
    image: "dest_gold.png",
    type: "path",
    pathType: "dest",
    dest: "gold",
    destructible: false,
    way: [true, true, true, true],
    flipped: false,
  };
  dummyBoardCards[11][15] = {
    id: "dest_rock1",
    image: "dest_rock1.png",
    type: "path",
    pathType: "start",
    destructible: false,
    way: [true, true, false, false],
    flipped: false,
  };
  dummyBoardCards[13][15] = {
    id: "dest_rock2",
    image: "dest_rock2.png",
    type: "path",
    pathType: "dest",
    dest: "rock",
    destructible: false,
    way: [true, false, true, false],
    flipped: false,
  };

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
          <img
            className="h-full hover:cursor-pointer"
            src="/buttons/rule_button.svg"
            alt="rule book"
          />
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
          src="/assets/saboteur/cards/card_general_bg.png"
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
