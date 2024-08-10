import React from 'react';
import Image from 'next/image';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative max-w-sm w-full">
        {children}
        <button className="absolute top-4 right-10" onClick={onClose}>
          <Image src="/close-icon.svg" alt="close-icon" width={40} height={40}></Image>
        </button>
      </div>
    </div>
  );
};

export default Modal;
