import { useState } from "react";
import Chipsduplicate from "../RouletteChips/Chips/Chipsduplicate";

interface RowsProps {
    slots: any[];
    setData: Function;
    valueChip?: any;
    eraseMode: boolean
  }


function BetOnRows(props:RowsProps) {
    const {slots , setData, valueChip , eraseMode} = props
    const [selectedrows, setSelectedRows] = useState<number | null>(null);

    const handleButtonClickPattern = (start: number, end: number) => {
        updateSlotsPattern(start, end);
      };
  
      const updateSlotsPattern = (start: number, end: number) => {
        setSelectedRows(start);
  
        const updatedSlots = slots.map((slot, index) => {
          if (index >= start && index <= end && (index - start) % 3 === 0) {
            return { ...slot, coins: [...slot.coins, valueChip].slice(-5) };
          }
          return slot;
        });
  
        setData(updatedSlots);
      };

      console.log(slots)
    return (
        <>
            <button className='w-[50px] h-[70px] border border-solid border-white text-center'
            onClick={()=> handleButtonClickPattern(1,34)}
            id="1"
            >1st</button>
            
            <button className='w-[50px] h-[70px] border border-solid border-white'
            onClick={()=> handleButtonClickPattern(2,35)}
            id="2"
            >2nd</button>
            <button className='w-[50px] h-[70px] border border-solid border-white'
            onClick={()=> handleButtonClickPattern(3,36)}
            id="3"
            >3rd</button>
        </>
    )
}

export default BetOnRows
