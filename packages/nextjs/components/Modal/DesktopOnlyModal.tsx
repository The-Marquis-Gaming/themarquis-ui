import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface DesktopOnlyProps {
  isOpen: boolean;
  onClose: () => void;
}

const DesktopOnlyModal = ({ isOpen, onClose }: DesktopOnlyProps) => {
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
        className="h-fit fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ zIndex: 1000 }}
      >
        <div
          ref={modalRef}
          className={`w-[300px] rounded-[14px] px-4 pt-4 pb-8 bg-[#171C20] transition-all duration-300 transform ${
            animateModal
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-90 translate-y-10 opacity-0"
          }`}
        >
          <div className="flex items-center justify-end w-full">
            <Image
              src={"/mobile/close-icon.svg"}
              alt="icon"
              width={12}
              height={12}
              onClick={onClose}
            />
          </div>
          <Image
            src={"/mobile/onlydesktop.svg"}
            className="mx-auto mt-3"
            alt="icon"
            width={125}
            height={94}
          />
          <p className="text-[14px] font-bold mt-[22px] mb-[12px] text-center">
            ONLY ON DESKTOP
          </p>
          <p className="text-[12px] text-[#CBCBCB] text-center max-w-[274px]">
            Withdraw and Deposit features are only available on Desktop
          </p>
        </div>
      </div>
    </>
  );
};

export default DesktopOnlyModal;
