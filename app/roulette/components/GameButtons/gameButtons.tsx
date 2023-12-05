import React from "react";
import "./gameButtons.css";

interface GameButtonsProps {
  onClear: () => void;
  isEraseMode: boolean;
  onEraseClick: () => void;
}

function GameButtons({ onClear, isEraseMode, onEraseClick }: GameButtonsProps) {
  return (
    <div className="game-buttons-container flex gap-10">
      <button className="py-4 px-20 border border-solid border-[#A962FF] bg-[#111] rounded-[15px]">
        REPEAT
      </button>
      <button
        className={`py-4 px-20 border border-solid border-[#A962FF] bg-[#111] rounded-[15px] button-eraser ${
          isEraseMode ? "erase-mode" : ""
        }`}
        onClick={onEraseClick}
      >
        ERASE
      </button>
      <button
        className="py-4 px-20 border border-solid border-[#A962FF] bg-[#111] rounded-[15px]"
        onClick={onClear}
      >
        CLEAR
      </button>
    </div>
  );
}

export default GameButtons;
