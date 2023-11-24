import React from "react";
import { useState } from "react";
import Chipsduplicate from "../RouletteChips/Chips/Chipsduplicate";
import { Color } from "../RouletteChips/Chips/Chipsduplicate";
import './Options.css'

interface OptionsProps {
    slots: any[];
    setData: Function;
    valueChip?: any;
    eraseMode: boolean
  }
  
function Options(props:OptionsProps) {
    const {slots , setData, valueChip , eraseMode} = props

    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

    const handleButtonClick = (number: number) => {
      setSelectedNumber(number);

      const updatedSlots = slots.map((slot, index) => {
        if (index >= 1 && index <= 12) {
          return { ...slot, coins: [...slot.coins, valueChip].slice(-5)};
        }
        return slot;
      });
      setData(updatedSlots);
    };

    console.log(slots)
    return (
        <div className="option">
        <div className="flex flex-col w-[200px] justify-center items-center border border-solid border-white">
          <div className={`${eraseMode ? 'erase-mode' : ''}`}>
            <button className={`w-[200px] py-4 ${eraseMode ? 'erase-mode' : ''}`}
               onClick={() => handleButtonClick(1)}
            >1-12</button>
             {selectedNumber !== null && (
              <div className="container-chips">
                {slots[selectedNumber].coins.map((coin: any, index: number) => (
                  <Chipsduplicate key={index} color={Color.White}>
                    {String(coin)}
                  </Chipsduplicate>
                ))}
              </div>
            )}

          </div>
            <div className="flex">
                <button className="w-[100px] text-center border border-solid border-white py-4">1-18</button>
                <button className="w-[100px] text-center border border-solid border-white py-4">EVEN</button>
            </div>
        </div>
        <div className="flex flex-col w-[200px] justify-center items-center border border-solid border-white">
            <button className="w-[200px] py-4">13-24</button>
            <div className="flex">
                <button className="w-[100px] text-center border border-solid border-white bg-[#2B2A2A] py-4">BLACK</button>
                <button className="w-[100px] text-center border border-solid border-white bg-[#561589] py-4">PURPLE</button>
            </div>
        </div>
        <div className="flex flex-col w-[200px] justify-center items-center border border-solid border-white">
            <button className="w-[200px] py-4">25-35</button>
            <div className="flex">
                <button className="w-[100px] text-center border border-solid border-white py-4">ODD</button>
                <button className="w-[100px] text-center border border-solid border-white py-4">19-35</button>
            </div>
        </div>
    </div>
    )
}

export default Options
