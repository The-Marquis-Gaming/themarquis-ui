"use client";

import Image from "next/image";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import useScaffoldStrkBalance from "~~/hooks/scaffold-stark/useScaffoldStrkBalance";
import useScaffoldEthBalance from "~~/hooks/scaffold-stark/useScaffoldEthBalance";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { notification } from "~~/utils/scaffold-stark";

interface ModalWalletProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletSettingSide = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div className="flex flex-col gap-4 mt-[44px]">
      <div
        onClick={onLogout}
        className="cursor-pointer py-[18px] px-3 rounded-[8px] bg-[#21262B] flex items-center gap-3"
      >
        <Image src={"/logout-icon.svg"} alt="icon" width={14} height={14} />
        <p>Log out</p>
      </div>
    </div>
  );
};

export default function WalletModal({ isOpen, onClose }: ModalWalletProps) {
  const { address } = useAccount();
  const { connector } = useConnect();
  const { disconnect } = useDisconnect();
  const [animateModal, setAnimateModal] = useState<boolean>(false);
  const [isOpenSetting, setIsOpenSetting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const strkBalanceWallet = useScaffoldStrkBalance({
    address: address,
  });
  const ethBalanceWallet = useScaffoldEthBalance({
    address: address,
  });

  const handleDisconnectWallet = () => {
    disconnect();
    onClose();
    setIsOpenSetting(false);
    localStorage.removeItem("lastUsedConnector");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
        setIsOpenSetting(false);
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

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text).then(
        () => {
          notification.success("Coppied successfully");
        },
        (err) => {
          console.error("Failed to copy: ", err);
        },
      );
    }
  };

  return (
    <>
      {/* <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-500 ${
          animateModal ? "opacity-100" : "opacity-0"
        }`}
        style={{ zIndex: 1000 }}
      ></div> */}
      <div
        className="absolute right-0 top-[80px]"
        // className="h-fit fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ zIndex: 1000 }}
      >
        <div
          ref={modalRef}
          className={`font-arial w-[355px] h-[520px] rounded-[30px] px-[30px] py-[36px] bg-[#171C20] transition-all duration-300 transform ${
            animateModal
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-90 translate-y-10 opacity-0"
          }`}
          style={{
            border: "1px solid #5C5C5C",
          }}
        >
          <div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {connector?.icon.light && (
                  <Image
                    src={connector?.icon.light!}
                    width={22}
                    height={22}
                    alt="icon"
                  />
                )}
                <p className="text-[14px] font-bold">Wallet</p>
              </div>
              <Image
                onClick={() => setIsOpenSetting((prev) => !prev)}
                className="cursor-pointer"
                src={"/setting.svg"}
                alt="icon"
                width={12}
                height={12}
              />
            </div>
            {isOpenSetting ? (
              <WalletSettingSide onLogout={handleDisconnectWallet} />
            ) : (
              <div>
                <div className="text-[20px] font-semibold  flex items-center justify-center mt-[57px]">
                  <p
                    className="cursor-pointer"
                    onClick={() => copyToClipboard(address ? address : "")}
                  >
                    {address?.slice(0, 6) + "..." + address?.slice(-4)}
                  </p>
                </div>
                <div
                  onClick={() => {
                    router.push("/deposit");
                    onClose();
                  }}
                  className="bg-[#00ECFF] cursor-pointer w-[118px] h-[31px] mx-auto rounded-[2px] mt-[17px]  flex items-center justify-center gap-1"
                >
                  <Image
                    src={"/withdraw-dropdown.svg"}
                    alt="icon"
                    width={14}
                    height={14}
                  />
                  <p className="text-[#000] text-[14px] font-medium">Deposit</p>
                </div>
                <div className="text-white font-bold mt-[41px] text-[14px] flex items-center justify-center w-full h-[35px] bg-[#21262B] rounded-[8px]">
                  Balance
                </div>
                <div className="flex flex-col gap-[23px] mt-[35px]">
                  <div className="flex justify-between items-center">
                    <Image
                      src={"/logo-starknet.svg"}
                      alt="icon"
                      width={22}
                      height={22}
                    />
                    <p className="text-[14px] uppercase text-right">
                      {parseFloat(strkBalanceWallet.formatted).toFixed(2)} STRK
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <Image
                      src={"/logo-eth.svg"}
                      alt="icon"
                      width={22}
                      height={22}
                    />
                    <p className="text-[14px] uppercase text-right">
                      {parseFloat(ethBalanceWallet.formatted).toFixed(8)} ETH
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <Image
                      src={"/usdc.svg"}
                      alt="icon"
                      width={22}
                      height={22}
                    />
                    <p className="text-[14px] uppercase text-right text-[#7A7A7A]">
                      0.00 USDC
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
