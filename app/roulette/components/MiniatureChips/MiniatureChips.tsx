import React, { CSSProperties } from "react";

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
    backgroundImage: `url(${chipColor})`,
    backgroundSize: "cover",
    borderRadius: "50%",
  };

  return (
    <div style={miniatureStyle}>
      <div style={chipStyle}></div>
    </div>
  );
};

export default MiniatureChips;
