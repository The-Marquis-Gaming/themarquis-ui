import React, { Children } from "react";

interface ActionButtonProps {
  children: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children }) => {
  return (
    <button className="w-[162px] h-12 bg-neutral-900 rounded-[15px] border border-neutral-900 hover:border-purple-500 ml-5">
      {children}
    </button>
  );
};

export default ActionButton;
