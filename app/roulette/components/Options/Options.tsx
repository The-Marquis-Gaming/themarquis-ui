import React from "react";
import { useState } from "react";
import Chipsduplicate from "../RouletteChips/Chips/Chipsduplicate";
import { Color } from "../RouletteChips/Chips/Chipsduplicate";
import './Options.css'
import { ColorSlot } from "../RouletteNumber/SlotNumber";

interface OptionsProps {
  background: string;
  width: string;
  slots: any[];
  setData: Function;
  valueChip?: any;
  eraseMode: boolean;
  index: number
  slot?: {
    id: string
    color: string
    coins: number[],
    type: string,
    index: string
  };
  children: string
}

function Options(props: OptionsProps) {
  const { slots, setData, valueChip, eraseMode, background, slot, children, width, index } = props
  const [click, setClick] = useState(false);


  const handleCount = (valueChip: any, index: number) => {
    if (eraseMode) {
      const updatedCoins: [] = [];
      slots[index].coins = updatedCoins;
      setData([...slots]);
    } else {
      const updatedCoins = [...slots[index]?.coins, valueChip].slice(-5);
      slots[index].coins = updatedCoins;
      setClick(true);
      setData([...slots]);
    }
  };

 // console.log(slots)

  return (
    <div className="option">

      <button className={` py-4 border border-solid border-white`}
        style={{ backgroundColor: background, width: width }}
        onClick={() => handleCount(valueChip, index)}
      >
        {children}
      </button>
      {click && (
        <div className="slot-options">
          {slots[index]?.coins.map((coin: any) => (
            <Chipsduplicate key={index} color={Color.White}>
              {String(coin)}
            </Chipsduplicate>
          ))}
        </div>
      )}
    </div>

  )
}

export default Options
