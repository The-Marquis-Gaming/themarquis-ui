import React from "react";
import { useState } from "react";
import Chipsduplicate from "../RouletteChips/Chips/Chipsduplicate";
import { Color } from "../RouletteChips/Chips/Chipsduplicate";
import './Options.css'
import { ColorSlot } from "../RouletteNumber/SlotNumber";

interface OptionsProps {
  slots: any[];
  setData: Function;
  valueChip?: any;
  eraseMode: boolean
}

function Options(props: OptionsProps) {
  const { slots, setData, valueChip, eraseMode } = props
  const [selectedButton, setSelectedButton] = useState<{ index: string; type: string } | null>(null);

  const [selectedColor, setSelectedColor] = useState<ColorSlot | null>(null);
  const [clicks, setClicks] = useState(false);

  // const handleButtonClick = (start: number, end: number) => {
  //   updateSlotsRange(start, end);
  // };

  const onClick = (currentIndex: string, index: number, type: string) => {
    setSelectedButton({ index: currentIndex, type })
  
    //console.log('onClick')
    //console.log('setData')
    const dataIndex = slots.findIndex(({ index = '' }) => index === currentIndex)
   // console.log(dataIndex)
    const slot = slots[dataIndex]
    slot.coins = [...slot.coins, valueChip].slice(-5)
    setClicks(true)
    console.log(slot)
    return slots
  }

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

  // const handleButtonEvenOdd = (number: number) => {
  //   setSelectedNumber(number);
  //   const updatedSlots = slots.map((slot, index) => {
  //     const isEven = number % 2 === 0;
  //     if ((isEven && index % 2 === 0) || (!isEven && index % 2 !== 0)) {
  //       return { ...slot, coins: [...slot.coins, valueChip].slice(-5) };
  //     }
  //     return slot;
  //   });
  //   setData(updatedSlots);
  // };

  //console.log(slots)
  return (
    <div className="option">
      <div className="flex flex-col w-[200px] justify-center items-center border border-solid border-white">
        <div className={`${eraseMode ? 'erase-mode' : ''}`}>
          <div>
          <button className={`w-[200px] py-4 ${eraseMode ? 'erase-mode' : ''}`}
            onClick={() => onClick('1-12', 37, 'options')}
          >1-12</button>
          {clicks && selectedButton !== null && selectedButton.type === 'options' && (
            <div className="container-chips">
              {slots.find((slot) => slot.index === selectedButton.index)?.coins.map((coin: any, index: number) => (
                <Chipsduplicate key={index} color={Color.White}>
                  {String(coin)}
                </Chipsduplicate>
              ))}
            </div>
          )}

          </div>
            
          
          

        </div>
        <div className="flex">
          <div>
            <button className="w-[100px] text-center border border-solid border-white py-4"
              onClick={() => onClick('1-18',41,'options')}
            >1-18</button>
            {clicks && selectedButton !== null && selectedButton.type === 'options' && (
              <div className="container-chips">
                {slots.find((slot) => slot.index === selectedButton.index)?.coins.map((coin: any, index: number) => (
                  <Chipsduplicate key={index} color={Color.White}>
                    {String(coin)}
                  </Chipsduplicate>
                ))}
              </div>
            )}
          </div>

          <button className="w-[100px] text-center border border-solid border-white py-4"
            // onClick={() => handleButtonEvenOdd(2)}
          >EVEN</button>
        </div>
      </div>
      <div className="flex flex-col w-[200px] justify-center items-center border border-solid border-white">
        <div>
          <button className="w-[200px] py-4"
            onClick={() => onClick('13-24',39,'options')}
          >13-24</button>
          {clicks && selectedButton !== null && selectedButton.type === 'options' && (
            <div className="container-chips">
              {slots.find((slot) => slot.index === selectedButton.index)?.coins.map((coin: any, index: number) => (
                <Chipsduplicate key={index} color={Color.White}>
                  {String(coin)}
                </Chipsduplicate>
              ))}
            </div>
          )}
        </div>
        <div className="flex">
          <div>
            <button className="w-[100px] text-center border border-solid border-white bg-[#2B2A2A] py-4"
              onClick={() => handleButtonClickColor(ColorSlot.Gray)}
            >BLACK</button>
            

          </div>
          <button className="w-[100px] text-center border border-solid border-white bg-[#561589] py-4"
            onClick={() => handleButtonClickColorPurple(ColorSlot.Purple)}
          >PURPLE</button>
        </div>
      </div>
      <div className="flex flex-col w-[200px] justify-center items-center border border-solid border-white">
        <button className="w-[200px] py-4"
          onClick={() => onClick('23-35',40,'options')}
        >25-35</button>
        {clicks && selectedButton !== null && selectedButton.type === 'options' && (
          <div className="container-chips">
            {slots.find((slot) => slot.index === selectedButton.index)?.coins.map((coin: any, index: number) => (
              <Chipsduplicate key={index} color={Color.White}>
                {String(coin)}
              </Chipsduplicate>
            ))}
          </div>
        )}
        <div className="flex">
          <button className="w-[100px] text-center border border-solid border-white py-4"
            // onClick={() => handleButtonEvenOdd(1)}
          >ODD</button>
          <button className="w-[100px] text-center border border-solid border-white py-4"
            onClick={() => onClick('19-35',38,'options')}
          >19-35</button>
          {clicks && selectedButton !== null && selectedButton.type === 'options' && (
            <div className="container-chips">
              {slots.find((slot) => slot.index === selectedButton.index)?.coins.map((coin: any, index: number) => (
                <Chipsduplicate key={index} color={Color.White}>
                  {String(coin)}
                </Chipsduplicate>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Options
