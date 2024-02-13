import React, { useState, ReactNode } from "react";
import Chipsduplicate from "../RouletteChips/Chips/Chipsduplicate";
import './TransparentBoard.css'
interface TransparentBoardProps {
  boxes: any[];
  valueChip?: any;
  eraseMode?: boolean;
  index: number;
  setData: Function;
  width: string;
  height:string;
  bottom: string;
  left: string;
}

function TransparentBoard({
  boxes,
  valueChip,
  eraseMode,
  index,
  setData,
  width,
  height,
  bottom,
  left
}: TransparentBoardProps) {
  const [click, setClick] = useState(false);

  const handleCount = (valueChip: any, index: number) => {
    if (!valueChip) {
      return;
    }
    let updatedCoins = [...boxes[index]?.coin];

    if (eraseMode) {
      updatedCoins = [];
    } else {
      updatedCoins = [...updatedCoins, valueChip].slice(-1);
      setClick(true);
    }

    boxes[index].coin = updatedCoins;
    setData([...boxes]);

  };
  return (
    <div className={`flex justify-center items-center container-chips
          ${eraseMode ? "erase-mode" : ""}`}
          style={{ width: width, bottom: bottom, left: left }}
    >
      <button className={`w-[15px] h-[15px] margin-box
        ${eraseMode ? "erase-mode" : ""}
        `}
        style={{ width: width, height: height}}
        onClick={() => handleCount(valueChip, index)}
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
