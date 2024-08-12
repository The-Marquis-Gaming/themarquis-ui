"use client";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalMobile: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-start z-50 font-monserrat">
      <div className="bg-[#1A1D21] rounded-lg p-8 w-[300px] text-white relative">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4 justify-center items-center">
            <span role="img" aria-label="wave" className="text-2xl text-center">
              👋
            </span>
            <span className="text-sm mb-0">Open The Marquis App</span>
          </div>
          <div className="flex gap-4">
            <button
              className="bg-gray-700 py-2 px-4 rounded-[3px]"
              onClick={onClose}
            >
              Stay
            </button>
            <button
              className="bg-gray-700 py-2 px-4 rounded-[3px]"
              onClick={() => (window.location.href = "/app")}
            >
              Go to app
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalMobile;
