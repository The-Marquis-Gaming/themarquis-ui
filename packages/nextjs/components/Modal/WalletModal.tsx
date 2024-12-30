"use client";

import Image from "next/image";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import useScaffoldStrkBalance from "~~/hooks/scaffold-stark/useScaffoldStrkBalance";
import useScaffoldEthBalance from "~~/hooks/scaffold-stark/useScaffoldEthBalance";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { notification } from "~~/utils/scaffold-stark";
import { useTheme } from "next-themes";
import { CHAIN_ID_LOCALSTORAGE_KEY } from "~~/utils/Constants";

interface ModalWalletProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletSettingSide = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div
      onClick={onLogout}
      className="cursor-pointer rounded-lg p-3 bg-[#2E353C] flex items-center gap-3"
    >
      <Image src={"/logout-icon.svg"} alt="icon" width={14} height={14} />
      <p>Disconnect</p>
    </div>
  );
};

export default function WalletModal({ isOpen, onClose }: ModalWalletProps) {
  const { address } = useAccount();
  const { connector } = useConnect();
  const { disconnect } = useDisconnect();
  const [animateModal, setAnimateModal] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  // connector has two : dark and light icon
  const icon = useMemo(() => {
    if (!connector) return;
    return typeof connector.icon === "object"
      ? resolvedTheme === "dark"
        ? (connector.icon.dark as string)
        : (connector.icon.light as string)
      : (connector.icon as string);
  }, [connector, resolvedTheme]);

  const strkBalanceWallet = useScaffoldStrkBalance({
    address: address,
  });
  const ethBalanceWallet = useScaffoldEthBalance({
    address: address,
  });

  const handleDisconnectWallet = () => {
    disconnect();
    onClose();
    localStorage.removeItem("lastUsedConnector");
    localStorage.removeItem("chainId");
  };

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
          className={`font-arial w-[325px] rounded-[12px] p-4 bg-[#171C20] transition-all duration-300 transform ${
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
                {icon && <Image src={icon} width={22} height={22} alt="icon" />}
                <p className="text-[14px] font-bold">Wallet</p>
              </div>
              <Image
                onClick={onClose}
                className="cursor-pointer"
                src={"/exit-icon.svg"}
                alt="icon"
                width={24}
                height={24}
              />
            </div>
            <div>
              <div className="text-[20px] font-semibold  flex items-center justify-center mb-5 mt-[28px]">
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
                className="bg-[#00ECFF] cursor-pointer w-[118px] h-[31px] mx-auto rounded-[2px] flex items-center justify-center gap-1 mb-[28px]"
              >
                <Image
                  src={"/marquis-icon.svg"}
                  alt="icon"
                  width={14}
                  height={14}
                />
                <p className="text-[#000] text-[14px]">Deposit</p>
              </div>
              <div className="p-3 rounded-lg bg-[#21262B] flex flex-col gap-2">
                <div className="flex flex-col gap-4 rounded-lg p-3 bg-[#2E353C]">
                  <p className="text-center font-bold">Balance</p>
                  <div className="flex justify-between items-center">
                    <Image
                      src={"/logo-starknet.svg"}
                      alt="icon"
                      width={22}
                      height={22}
                    />
                    <p className="text-[14px] font-bold uppercase text-right">
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
                    <p className="text-[14px] font-bold uppercase text-right">
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
                    <p className="text-[14px] font-bold uppercase text-right text-[#7A7A7A]">
                      0.00 USDC
                    </p>
                  </div>
                </div>
                <WalletSettingSide onLogout={handleDisconnectWallet} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
