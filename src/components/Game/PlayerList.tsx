import PlayerStatus from "./PlayerStatus";
import { Tools } from "../../libs/gameLogics";

export interface DummyInterface {
  name: string;
  status: Record<Tools, boolean>;
  deck: number;
}

const dummyList: DummyInterface[] = [
  {
    name: "Dami",
    status: {
      lantern: true,
      pick: true,
      wagon: true,
    },
    deck: 3,
  },
  {
    name: "Doo Hyun",
    status: {
      lantern: true,
      pick: false,
      wagon: false,
    },
    deck: 2,
  },
  {
    name: "Jiwoo",
    status: {
      lantern: true,
      pick: true,
      wagon: false,
    },
    deck: 1,
  },
  {
    name: "Dohoon",
    status: {
      lantern: false,
      pick: true,
      wagon: true,
    },
    deck: 3,
  },
  {
    name: "Jaehoon",
    status: {
      lantern: true,
      pick: true,
      wagon: false,
    },
    deck: 3,
  },
  {
    name: "Namhoon",
    status: {
      lantern: false,
      pick: true,
      wagon: true,
    },
    deck: 3,
  },
  {
    name: "Hayoung",
    status: {
      lantern: true,
      pick: false,
      wagon: true,
    },
    deck: 3,
  },
  {
    name: "Nutria",
    status: {
      lantern: true,
      pick: true,
      wagon: true,
    },
    deck: 3,
  },
  {
    name: "Schott",
    status: {
      lantern: true,
      pick: true,
      wagon: true,
    },
    deck: 3,
  },
];

// interface Props {
//   list: string[];
// }

// const PlayerList = ({ list }: Props) => {
/** will be replaced by the above line (for BE) */
const PlayerList = () => {
  return (
    <div className="border h-fit w-[180px]">
      {dummyList.map((item) => <PlayerStatus key={item.name} item={item} />)}
    </div>
  );
};

export default PlayerList;
