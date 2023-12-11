import React, { useState, ReactNode } from "react";
import Chipsduplicate from "../RouletteChips/Chips/Chipsduplicate";
import './TransparentBoard.css'
interface TransparentBoardProps {
    boxes: any[];
    valueChip?: any;
    eraseMode?: boolean;
    children: ReactNode;
    index: number;
    setData: Function;
    margin:string
}

export enum Margin {
  Big = "24px",
  Small = "8px",
}


function TransparentBoard({
    boxes,
    valueChip,
    eraseMode,
    children,
    index,
    setData,
    margin
}: TransparentBoardProps) {
    const [click, setClick] = useState(false);

    const handleCount = (valueChip: any, index: number) => {
         if (!valueChip) {
         return;
        }                
        console.log(valueChip)
        let updatedCoins = [...boxes[index]?.coin];
       // console.log(updatedCoins)

          if (eraseMode) {
            updatedCoins = [];
          } else {
            updatedCoins = [...updatedCoins, valueChip].slice(-1);
            setClick(true);
          }

          boxes[index].coin = updatedCoins;
          setData([...boxes]);
        
      };
      //console.log(boxes)
    return (
        <div className={`flex justify-center items-center container-chips 
        ${eraseMode ? "erase-mode" : ""}`}>
            <button className={`w-[15px] h-[15px] margin-box ${
              eraseMode ? "erase-mode" : ""
            }
            `}
            style={{ marginBlock: margin}}
            onClick={()=>handleCount(valueChip,index)}
            >
            
            </button>
            {click && valueChip && (
                <div className={`coin ${eraseMode ? "erase-mode" : ""}`}>
                  {boxes[index]?.coin.map((coin: any, indexCoin: number) => (
                    <Chipsduplicate key={indexCoin}>
                      {String(coin)}
                    </Chipsduplicate>
                  ))}
                </div>
                
              )}
        </div>
    )
}

export default TransparentBoard
