import React from "react";
import { useState, useEffect } from "react";
import './SlotNumber.css'
import Chipsduplicate, { Color } from "../RouletteChips/Chips/Chipsduplicate";

export enum ColorSlot {
  Purple = '#561589',
  Gray = '#2B2A2A'
}

interface SlotNumberProps {
  slot?: {
    color: string,
    coins: number[]
  };
  background: string;
  children: number;
  slots: any[],
  setData: Function,
  index: number,
  valueChip?: any
}

const SlotNumber: React.FC<SlotNumberProps> = ({ background, children, slot, slots, setData, index, valueChip }) => {
  const [click, setClick] = useState(false);


  const handleCount = (valueChip: any, index: number) => {
    const updatedCoins = [...slots[index]?.coins, valueChip].slice(-5); 
    slots[index].coins = updatedCoins;
    setClick(true);
    setData([...slots]); 
  };


  
  return (
   
    <div className="slot">
      <button
        className={`w-[50px] h-[70px] border border-solid border-white`}
        style={{ backgroundColor: background }}
        onClick={() => handleCount(valueChip, index)}>
        {children}
      </button>
      {click && (
      <>
        {slots[index]?.coins.map((coin: any, coinIndex: React.Key | null | undefined) => (
          <Chipsduplicate key={coinIndex} color={Color.White}>
            {String(coin)}
          </Chipsduplicate>
        ))}
      </>
      )}
    </div>

  )
}

export default SlotNumber
