import React, { ReactNode, useState } from "react";
import Chipsduplicate from "../RouletteChips/Chips/Chipsduplicate";
import "./Options.css";
import { Slot } from "@/app/roulette/internals/Board/domain";

interface OptionsProps {
  background: string;
  width: string;
  dataSlot: Slot[];
  setData: React.Dispatch<React.SetStateAction<Slot[]>>;
  valueChip?: any;
  eraseMode: boolean;
  index: string;
  children: ReactNode;
  coins: number[];
}

function Options({
  background,
  width,
  dataSlot,
  setData,
  valueChip,
  eraseMode,
  index,
  children,
  coins,
}: OptionsProps) {
  const [click, setClick] = useState(false);

  const handleCount = (valueChip: any, index: string) => {
    if (!valueChip) return;

    const currentIndex = dataSlot.findIndex((slot) => slot.name === index);
    if (eraseMode) {
      const updatedSlots = [...dataSlot];
      updatedSlots[currentIndex] = { ...updatedSlots[currentIndex], coins: [] };
      setData(updatedSlots);
    } else {
      const updatedCoins = [
        ...(dataSlot[currentIndex]?.coins || []),
        valueChip,
      ].slice(Math.max((dataSlot[currentIndex]?.coins || []).length - 5, 0));
      const updatedSlots = [...dataSlot];
      updatedSlots[currentIndex] = {
        ...updatedSlots[currentIndex],
        coins: updatedCoins,
      };
      setClick(true);
      setData(updatedSlots);
    }
  };

  return (
    <div className="option">
      <button
        className={`py-4 border border-solid border-white ${
          eraseMode ? "erase-mode" : ""
        }`}
        style={{ backgroundColor: background, width: width }}
        onClick={() => handleCount(valueChip, index)}
      >
        {children}
      </button>
      {click && (
        <div className="slot-options">
          {coins.map((coin: number, coinIndex: number) => (
            <Chipsduplicate key={coinIndex}>{String(coin)}</Chipsduplicate>
          ))}
        </div>
      )}
    </div>
  );
}

export default Options;
