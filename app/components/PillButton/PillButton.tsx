"use client";
import React from "react";
import "./PillButton.css";

interface ReadButtonProps {
  documentUrl: string;
  children: string;
}

const ReadButton: React.FC<ReadButtonProps> = ({ documentUrl, children }) => {
  const openDocument = () => {
    window.open(documentUrl, "_blank");
  };

  return (
    <button
      onClick={openDocument}
      className="bg-black text-white text-xs border border-white rounded-3xl pill_button__large"
    >
      {children}
    </button>
  );
};

export default ReadButton;
