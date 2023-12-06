import React, { ReactNode } from "react";
import { useState } from "react";
import "./SlotNumber.css";
import Chipsduplicate from "../RouletteChips/Chips/Chipsduplicate";

export enum ColorSlot {
  Purple = "#561589",
  Gray = "#2B2A2A",
}

export enum Width {
  Big = "200px",
  Small = "100px",
}

interface SlotNumberProps {
  slot?: {
    color: string;
    coins: number[];
  };
  background: string;
  children: ReactNode;
  slots: any[];
  setData: Function;
  index: number;
  valueChip?: any;
  eraseMode?: boolean;
}

const SlotNumber: React.FC<SlotNumberProps> = ({
  background,
  children,
  slots,
  setData,
  index,
  valueChip,
  eraseMode,
}) => {
  const [click, setClick] = useState(false);
  const currentSlots = slots.filter(({ type = "" }) => type === "board");

  const handleCount = (valueChip: any, index: number) => {
    if (!valueChip) {
      return;
    }

    let updatedCoins = [...slots[index]?.coins];

    if (eraseMode) {
      updatedCoins = [];
    } else {
      updatedCoins = [...updatedCoins, valueChip].slice(-5);
      setClick(true);
    }

    slots[index].coins = updatedCoins;
    setData([...slots]);
  };

  return (
    <div
      className={`slot ${index === 0 ? "first-slot" : ""} ${
        eraseMode ? "erase-mode" : ""
      }`}
    >
      <button
        className={`w-[50px] h-[70px] border border-solid border-white ${
          index === 0 ? "first-slot" : ""
        } ${eraseMode ? "erase-mode" : ""}
        `}
        style={{ backgroundColor: background }}
        onClick={() => handleCount(valueChip, index)}
      >
        {children}
      </button>
      {click && valueChip && (
        <div className="slot-coins-container">
          {currentSlots[index]?.coins.map((coin: any, indexCoin: number) => (
            <Chipsduplicate key={`${index}-${coin}-${indexCoin}`}>
              {String(coin)}
            </Chipsduplicate>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlotNumber;
