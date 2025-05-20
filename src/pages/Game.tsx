import { useEffect, useState } from "react";

import PlayerList from "@/components/Game/PlayerList";
import { DummyInterface } from "@/types";

const dummyList: DummyInterface[] = [
  {
    id: 1,
    name: "Dami",
    status: { lantern: true, pick: true, wagon: true },
    hand: 3,
  },
  {
    id: 2,
    name: "Doo Hyun",
    status: { lantern: true, pick: false, wagon: false },
    hand: 2,
  },
  {
    id: 3,
    name: "Jiwoo",
    status: { lantern: true, pick: true, wagon: false },
    hand: 1,
  },
  {
    id: 4,
    name: "Dohoon",
    status: { lantern: false, pick: true, wagon: true },
    hand: 3,
  },
  {
    id: 5,
    name: "Jaehoon",
    status: { lantern: true, pick: true, wagon: false },
    hand: 3,
  },
  {
    id: 6,
    name: "Namhoon",
    status: { lantern: false, pick: true, wagon: true },
    hand: 3,
  },
  {
    id: 7,
    name: "Hayoung",
    status: { lantern: true, pick: false, wagon: true },
    hand: 3,
  },
  {
    id: 8,
    name: "Nutria",
    status: { lantern: true, pick: true, wagon: true },
    hand: 3,
  },
  {
    id: 9,
    name: "Schott",
    status: { lantern: true, pick: true, wagon: true },
    hand: 3,
  },
];

const Game = () => {
  const [playerList, setPlayerList] = useState<DummyInterface[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPlayerList(dummyList);
    // setIsLoading(false);
    // setError(null);
  }, []);

  return (
    <div className="p-3">
      Game page
      <PlayerList list={playerList} />
    </div>
  );
};

export default Game;
