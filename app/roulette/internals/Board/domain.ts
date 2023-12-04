import {
  ColorSlot,
  Width,
} from "@/app/roulette/components/RouletteNumber/SlotNumber";

type SlotName =
  | "1-12"
  | "13-24"
  | "25-35"
  | "1-18"
  | "19-35"
  | "ODD"
  | "EVEN"
  | "BLACK"
  | "PURPLE"
  | "1st"
  | "2nd"
  | "3rd";

type SlotType = "board" | "options";
export interface Slot {
  id: string;
  color: string;
  width: string;
  coins: number[];
  type: SlotType;
  name?: SlotName;
}
export const slots: Slot[] = [
  {
    id: "0",
    color: "",
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "1",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "2",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "3",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "4",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "5",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "6",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "7",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "8",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "9",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "10",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "11",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "12",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "13",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "14",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "15",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "16",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "17",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "18",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "19",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "20",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },

  {
    id: "21",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "22",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "23",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "24",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "25",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "26",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "27",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "28",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "29",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "30",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "31",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "32",
    color: ColorSlot.Gray,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "33",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },

  {
    id: "34",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "35",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "36",
    color: ColorSlot.Purple,
    coins: [],
    type: "board",
    width: "",
  },
  {
    id: "1st",
    color: "",
    coins: [],
    type: "board",
    name: "1st",
    width: "",
  },
  {
    id: "2nd",
    color: "",
    coins: [],
    type: "board",
    name: "2nd",
    width: "",
  },
  {
    id: "3rd",
    color: "",
    coins: [],
    type: "board",
    name: "3rd",
    width: "",
  },
  {
    id: "41",
    color: "",
    coins: [],
    type: "options",
    width: Width.Big,
    name: "1-12",
  },
  {
    id: "42",
    color: "",
    coins: [],
    type: "options",
    width: Width.Big,
    name: "13-24",
  },
  {
    id: "43",
    color: "",
    coins: [],
    type: "options",
    width: Width.Big,
    name: "25-35",
  },
  {
    id: "44",
    color: "",
    coins: [],
    type: "options",
    width: Width.Small,
    name: "1-18",
  },
  {
    id: "45",
    color: "",
    coins: [],
    type: "options",
    width: Width.Small,
    name: "EVEN",
  },
  {
    id: "46",
    color: ColorSlot.Gray,
    coins: [],
    type: "options",
    width: Width.Small,
    name: "BLACK",
  },
  {
    id: "47",
    color: ColorSlot.Purple,
    coins: [],
    type: "options",
    width: Width.Small,
    name: "PURPLE",
  },
  {
    id: "48",
    color: "",
    coins: [],
    type: "options",
    width: Width.Small,
    name: "ODD",
  },
  {
    id: "49",
    color: "",
    coins: [],
    type: "options",
    width: Width.Small,
    name: "19-35",
  },
];
