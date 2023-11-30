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
  index: string
  children: string
  coins: number[]
}

function Options(props: OptionsProps) {
  const { slots, setData, valueChip, eraseMode, background, children, width, index , coins } = props
  const [click, setClick] = useState(false);


  const handleCount = (valueChip: any, index: string) => {
    console.log(index)
    if(!valueChip){
      return
    }
    const currentIndex = slots.findIndex((slot)=>slot.index === index)
    if (eraseMode) {
      const updatedCoins: [] = [];
      slots[currentIndex].coins = updatedCoins;
      setData([...slots]);
    } else {
      const updatedCoins = [...slots[currentIndex]?.coins, valueChip].slice(-5);
      slots[currentIndex].coins = updatedCoins;
      setClick(true);
      setData([...slots]);
    }
  };

  console.log(slots)

  return (
    <div className="option">
      <button className={` py-4 border border-solid border-white ${eraseMode ? 'erase-mode' : ''}`}
        style={{ backgroundColor: background, width: width }}
        onClick={() => handleCount(valueChip, index)}
      >
        {children}
      </button>
      {click && (
        <div className="slot-options">
          {coins.map((coin: any) => (
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
