import React, { useState } from "react";
import MiniatureChips from "../../MiniatureChips/MiniatureChips";
import './Chips.css'

export enum Color {
  White = "/images-game/5.png",
  Blue = "/images-game/10.png",
  Yellow = "/images-game/50.png",
  Green = "/images-game/100.png",
}

interface ChipsProps {
  color: Color;
  onClick?: () => void;
  children: string;
  mousePosition: { x: number; y: number };
}

function Chips(props: ChipsProps) {
  const { color, onClick = () => {}, children, mousePosition } = props;
  const [showMiniature, setShowMiniature] = useState(false);

  const handleMouseDown = () => {
    setShowMiniature(true);
  };

  const handleMouseUp = () => {
    setShowMiniature(false);
  };

  return (
    <>
      <button
        className="chip w-[188px] h-[188px] hover:scale-105 transition duration-300 ease-in-out "
        style={{ backgroundImage: `url(${color})` }}
        onClick={onClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <span className="content-chip text-3xl">{children}</span>
      </button>
      {showMiniature && (
        <MiniatureChips mousePosition={mousePosition} chipColor={color} />
      )}
    </>
  );
}

export default Chips;
