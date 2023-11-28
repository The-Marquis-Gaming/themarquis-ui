import React from "react";
import { useState } from "react";
import Chipsduplicate from "../RouletteChips/Chips/Chipsduplicate";
import { Color } from "../RouletteChips/Chips/Chipsduplicate";
import "./Options.css";
import { ColorSlot } from "../RouletteNumber/SlotNumber";

interface OptionsProps {
  slots: any[];
  setData: Function;
  valueChip?: any;
  eraseMode: boolean;
}

function Options(props: OptionsProps) {
  const { slots, setData, valueChip, eraseMode } = props;
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorSlot | null>(null);

  const handleButtonClick = (start: number, end: number) => {
    updateSlotsRange(start, end);
  };

  const updateSlotsRange = (start: number, end: number) => {
    setSelectedNumber(start);

    const updatedSlots = slots.map((slot, index) => {
      if (index >= start && index <= end) {
        return { ...slot, coins: [...slot.coins, valueChip].slice(-5) };
      }
      return slot;
    });

    setData(updatedSlots);
  };

  const handleButtonClickColor = (color: ColorSlot) => {
    updateSlotColor(color);
  };

  const handleButtonClickColorPurple = (color: ColorSlot) => {
    updateSlotColor(color);
  };

  const updateSlotColor = (color: ColorSlot) => {
    setSelectedColor(color);
    const updatedSlots = slots.map((slot) => {
      if (slot.color === color) {
        return { ...slot, coins: [...slot.coins, valueChip] };
      }
      return slot;
    });
    setData(updatedSlots);
  };

  const handleButtonEvenOdd = (number: number) => {
    setSelectedNumber(number);
    const updatedSlots = slots.map((slot, index) => {
      const isEven = number % 2 === 0;
      if ((isEven && index % 2 === 0) || (!isEven && index % 2 !== 0)) {
        return { ...slot, coins: [...slot.coins, valueChip].slice(-5) };
      }
      return slot;
    });
    setData(updatedSlots);
  };

  return (
    <div className="option">
      <div className="flex flex-col w-[200px] justify-center items-center border border-solid border-white">
        <div className={`${eraseMode ? "erase-mode" : ""}`}>
          <button
            className={`w-[200px] py-4 ${eraseMode ? "erase-mode" : ""}`}
            onClick={() => handleButtonClick(1, 12)}
          >
            1-12
          </button>
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
          <button
            className="w-[100px] text-center border border-solid border-white py-4"
            onClick={() => handleButtonClick(1, 18)}
          >
            1-18
          </button>
          <button
            className="w-[100px] text-center border border-solid border-white py-4"
            onClick={() => handleButtonEvenOdd(2)}
          >
            EVEN
          </button>
        </div>
      </div>
      <div className="flex flex-col w-[200px] justify-center items-center border border-solid border-white">
        <div>
          <button
            className="w-[200px] py-4"
            onClick={() => handleButtonClick(13, 24)}
          >
            13-24
          </button>
        </div>
        <div className="flex">
          <button
            className="w-[100px] text-center border border-solid border-white bg-[#2B2A2A] py-4"
            onClick={() => handleButtonClickColor(ColorSlot.Gray)}
          >
            BLACK
          </button>
          <button
            className="w-[100px] text-center border border-solid border-white bg-[#561589] py-4"
            onClick={() => handleButtonClickColorPurple(ColorSlot.Purple)}
          >
            PURPLE
          </button>
        </div>
      </div>
      <div className="flex flex-col w-[200px] justify-center items-center border border-solid border-white">
        <button
          className="w-[200px] py-4"
          onClick={() => handleButtonClick(23, 35)}
        >
          25-35
        </button>
        <div className="flex">
          <button
            className="w-[100px] text-center border border-solid border-white py-4"
            onClick={() => handleButtonEvenOdd(1)}
          >
            ODD
          </button>
          <button
            className="w-[100px] text-center border border-solid border-white py-4"
            onClick={() => handleButtonClick(19, 35)}
          >
            19-35
          </button>
        </div>
      </div>
    </div>
  );
}

export default Options;
