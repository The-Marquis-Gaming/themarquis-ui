import { useState } from "react";


interface RowsProps {
    slots: any[];
    setData: Function;
    valueChip?: any;
    eraseMode: boolean
  }


function BetOnRows(props:RowsProps) {
    const {slots , setData, valueChip , eraseMode} = props
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

    const handleButtonClickPattern = (start: number, end: number) => {
        updateSlotsPattern(start, end);
      };
  
      const updateSlotsPattern = (start: number, end: number) => {
        setSelectedNumber(start);
  
        const updatedSlots = slots.map((slot, index) => {
          if (index >= start && index <= end && (index - start) % 3 === 0) {
            return { ...slot, coins: [...slot.coins, valueChip].slice(-5) };
          }
          return slot;
        });
  
        setData(updatedSlots);
      };
    return (
        <>
            <button className='w-[50px] h-[70px] border border-solid border-white text-center'
            onClick={()=> handleButtonClickPattern(1,34)}
            >1st</button>
            <button className='w-[50px] h-[70px] border border-solid border-white'
            onClick={()=> handleButtonClickPattern(2,35)}
            >2st</button>
            <button className='w-[50px] h-[70px] border border-solid border-white'
            onClick={()=> handleButtonClickPattern(3,36)}
            >3st</button>
        </>
    )
}

export default BetOnRows
