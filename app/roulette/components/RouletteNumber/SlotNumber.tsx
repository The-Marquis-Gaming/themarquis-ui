import React from "react";


export enum ColorSlot {
  Purple = '#561589',
  Gray = '#2B2A2A'
}

interface SlotNumberProps {
  background: string;
  children: number;
  onClick?: (slotNumber: number) => void;
}

const SlotNumber: React.FC<SlotNumberProps> = ({ background, children, onClick }) => {
  const _onClick= ()=>{
    if(onClick){
      onClick(children)
    }
  }
  return (
    <button
      className={`w-[50px] h-[70px] border border-solid border-white`}
      style={{ backgroundColor: background }}
      onClick={_onClick}>
      {children}
    </button>
  )
}

export default SlotNumber
