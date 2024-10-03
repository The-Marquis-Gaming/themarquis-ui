"use client";

import Image from "next/image";
import MarquisIcon from "@/public/marquis-icon.svg";
import LogoutIcon from "@/public/logout-icon.svg";
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

export default function WalletModal({ isOpen, onClose }: ModalWalletProps) {
  const { address } = useAccount();
  const { connector } = useConnect();
  const { disconnect } = useDisconnect();
  const [animateModal, setAnimateModal] = useState<boolean>(false);
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
    localStorage.removeItem("lastUsedConnector");
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
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-500 ${
          animateModal ? "opacity-100" : "opacity-0"
        }`}
        style={{ zIndex: 1000 }}
      ></div>

      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ zIndex: 1000 }}
      >
        <div
          ref={modalRef}
          className={`w-[470px] rounded-[24px] p-[20px] bg-[#171C20] transition-all duration-300 transform ${
            animateModal
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-90 translate-y-10 opacity-0"
          }`}
        >
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <p className="text-[24px] font-bold m-0">Wallet</p>
              <div className="text-sm font-semibold mt-5 mb-8 flex items-center gap-2">
                <p>{address?.slice(0, 6) + "..." + address?.slice(-4)}</p>
                <Image
                  src="/copy.svg"
                  alt="copy"
                  width={100}
                  height={100}
                  onClick={() => copyToClipboard(address ?? "")}
                  style={{ cursor: "pointer", width: "15px", height: "15px" }}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Image
                  src={"/logo-starknet.svg"}
                  alt="icon"
                  width={20}
                  height={20}
                />
                <Image
                  src={"/logo-eth.svg"}
                  alt="icon"
                  width={20}
                  height={20}
                />
                <Image src={"/usdc.svg"} alt="icon" width={20} height={20} />
              </div>
            </div>
            <div className="col-span-2 flex flex-col items-end">
              <div className="flex items-center gap-5 h-[36px]">
                <div
                  className="flex gap-3 bg-[#31353B] px-3 rounded-[2px] cursor-pointer items-center py-2"
                  onClick={() => {
                    router.push("/deposit");
                    onClose();
                  }}
                >
                  <Image src={MarquisIcon} width={22} height={22} alt="icon" />
                  <p className="text-xs font-medium">Deposit</p>
                </div>
                <div
                  className="flex gap-3 rounded-[2px] bg-[#00ECFF] px-3 cursor-pointer items-center py-2"
                  onClick={handleDisconnectWallet}
                >
                  <p className="text-xs font-medium text-[#000]">Disconnect</p>
                  <Image src={LogoutIcon} width={15} height={15} alt="icon" />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-8 mt-5">
                <p className="text-[#8D8D8D] font-bold text-xs">
                  Connected with {connector?.name}{" "}
                </p>
                {connector?.icon.light && (
                  <Image
                    src={connector?.icon.light!}
                    width={16}
                    height={16}
                    alt="icon"
                  />
                )}
              </div>
              <div className="flex flex-col gap-3">
                <p className="m-0 text-sm uppercase text-right">
                  {parseFloat(strkBalanceWallet.formatted).toFixed(2)} STRK
                </p>
                <p className="m-0 text-sm uppercase text-right">
                  {parseFloat(ethBalanceWallet.formatted).toFixed(8)} ETH
                </p>
                <p className="m-0 text-sm uppercase text-right">0.00 USDC</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
