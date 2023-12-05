import React, { CSSProperties } from "react";
import Image from "next/image";

interface MiniatureChipsProps {
  mousePosition: { x: number; y: number };
  chipColor: string;
}

const MiniatureChips = ({ mousePosition, chipColor }: MiniatureChipsProps) => {
  const { x, y } = mousePosition;

  const miniatureStyle: CSSProperties = {
    position: "fixed",
    top: `${y + 10}px`,
    left: `${x + 10}px`,
    zIndex: 1000,
  };

  const chipStyle: CSSProperties = {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
  };

  return (
    <div style={miniatureStyle}>
      <div style={{ ...chipStyle }}>
        <Image src={chipColor} alt="Chip" width={20} height={20} />
      </div>
    </div>
  );
};

export default MiniatureChips;
