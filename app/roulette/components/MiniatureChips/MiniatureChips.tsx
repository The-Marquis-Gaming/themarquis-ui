import React from "react";

interface MiniatureChipsProps {
  mousePosition: { x: number; y: number };
  color: string;
}

const MiniatureChips = ({ mousePosition, color }: MiniatureChipsProps) => {
    const { x, y } = mousePosition;
    //console.log('Mouse Position:', x, y);

  return (
    <div
      style={{
        position: "fixed",
        top: mousePosition.y + 10,
        left: mousePosition.x + 10,
        zIndex: 1000,
      }}
    >
      {/* Contenido de la ficha miniatura */}
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundImage: `url(${color})`,
          backgroundSize: "cover",
          borderRadius: "50%",
        }}
      ></div>
    </div>
  );
};

export default MiniatureChips;
