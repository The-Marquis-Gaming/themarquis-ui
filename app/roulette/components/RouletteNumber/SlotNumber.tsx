import React from "react";
import { useState } from "react";
import "./SlotNumber.css";
import Chipsduplicate, { Color } from "../RouletteChips/Chips/Chipsduplicate";

export enum ColorSlot {
  Purple = "#561589",
  Gray = "#2B2A2A",
}

interface SlotNumberProps {
  slot?: {
    color: string;
    coins: number[];
  };
  background: string;
  children: number;
  slots: any[];
  setData: Function;
  index: number;
  valueChip?: any;
}

const SlotNumber: React.FC<SlotNumberProps> = ({
  background,
  children,
  slot,
  slots,
  setData,
  index,
  valueChip,
}) => {
  const apuestaTotal = slot?.coins.reduce(
    (acumulador, elemento) => acumulador + elemento,
    0
  );

  const [click, setClick] = useState(false);

  const handleCount = (valueChip: any, index: number) => {
    slots[index].coins.push(valueChip);
    setClick(true);
    setData(slots);
  };

  return (
    <div className="slot">
      <button
        className={`w-[50px] h-[70px] border border-solid border-white`}
        style={{ backgroundColor: background }}
        onClick={() => handleCount(valueChip, index)}
      >
        {children}
      </button>
      {click && slot && slot.coins.length > 0 && (
        <Chipsduplicate color={Color.White}>
          {String(slot?.coins[0])}
        </Chipsduplicate>
      )}
    </div>
  );
};

export default SlotNumber;
