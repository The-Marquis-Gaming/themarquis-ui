import React from "react";
import { useState, useEffect } from "react";
import './SlotNumber.css'
import Chipsduplicate, { Color } from "../RouletteChips/Chips/Chipsduplicate";

export enum ColorSlot {
  Purple = '#561589',
  Gray = '#2B2A2A'
}

export enum Width{
  Big = '200px',
  Small = '100px',
}

interface SlotNumberProps {
  slot?: {
    color: string,
    coins: number[]
  };
  background: string;
  children: string;
  slots: any[];
  setData: Function;
  index: number;
  valueChip?: any;
  eraseMode: boolean
}

const SlotNumber: React.FC<SlotNumberProps> = ({ background, children,slot, slots, setData, index, valueChip, eraseMode}) => {
  const [click, setClick] = useState(false);



  const handleCount = (valueChip: any, index: number) => {
    if (eraseMode) {
      const updatedCoins:[] = []; 
      slots[index].coins = updatedCoins;
      setData([...slots]);
    } else {
    const updatedCoins = [...slots[index]?.coins, valueChip].slice(-5); 
    slots[index].coins = updatedCoins;
    setClick(true);
    setData([...slots]); 
    }
  };

 console.log(slots)
  return (
   
    <div className={`slot ${index === 0 ? 'first-slot' : ''} ${eraseMode ? 'erase-mode' : ''}`}>
      <button
        className={`w-[50px] h-[70px] border border-solid border-white ${index === 0 ? 'first-slot' : ''} ${eraseMode ? 'erase-mode' : ''}
        `}
        style={{ backgroundColor: background }}
        onClick={() => handleCount(valueChip, index)}>
        {children}
      </button>
      {click && valueChip  && (
      <div className="slot-coins-container">
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

export default SlotNumber
