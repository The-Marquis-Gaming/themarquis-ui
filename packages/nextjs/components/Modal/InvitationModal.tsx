import { useEffect, useRef, useState } from "react";
import Invitation from "../invitation";

interface ModalWalletProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvitationModal = ({ isOpen, onClose }: ModalWalletProps) => {
  const [animateModal, setAnimateModal] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      setAnimateModal(true);
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      setAnimateModal(false);
      setTimeout(() => {
        document.removeEventListener("mousedown", handleClickOutside);
      }, 300);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-500 ${
          animateModal ? "opacity-100" : "opacity-0"
        }`}
        style={{ zIndex: 1000 }}
      ></div>
      <div
        className={`fixed inset-0 flex items-center justify-center`}
        style={{ zIndex: 1000 }}
      >
        <div
          ref={modalRef}
          className={`transition-all duration-300 transform ${
            animateModal
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-90 translate-y-10 opacity-0"
          }`}
        >
          <Invitation />
        </div>
      </div>
    </>
  );
};

export default InvitationModal;
