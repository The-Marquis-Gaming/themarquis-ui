// BlockchainWallet.tsx
"use client";

import Image from "next/image";
import { Connector, useConnect } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { burnerAccounts } from "~~/utils/devnetAccounts";
import { BurnerConnector } from "~~/services/web3/stark-burner/BurnerConnector";
import { useTheme } from "next-themes";
import ConnectWalletIcon from "@/public/landingpage/connectWalletIcon.svg";
import deposit_walletIcon from "@/public/deposit_walletIcon.svg";
import back_walletIcon from "@/public/back_walletIcon.svg";
import GenericModal from "./GenericModal";

const loader = ({ src }: { src: string }) => {
  return src;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedConnector: Connector | null;
};

const balances = [
  { symbol: "STRK", amount: "100.76", icon: "/logo-starknet.svg" },
  { symbol: "ETH", amount: "0.05", icon: "/logo-eth.svg" },
  { symbol: "USDC", amount: "0.00", icon: "/usdc.svg" },
];

const BlockchainWallet = ({ isOpen, onClose, selectedConnector }: Props) => {
  const { connect } = useConnect();
  const [animate, setAnimate] = useState(false);
  const [lastConnector, setLastConnector] = useLocalStorage<{
    id: string;
    ix?: number;
  }>(
    "lastUsedConnector",
    { id: "" },
    {
      initializeWithValue: false,
    }
  );

  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const closeModal = () => {
    setAnimate(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  function handleConnect() {
    if (selectedConnector) {
      connect({ connector: selectedConnector });
      setLastConnector({ id: selectedConnector.id });
      closeModal();
    }
  }

  useEffect(() => {
    setAnimate(isOpen);
  }, [isOpen]);

  if (!selectedConnector) return null;

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={closeModal}
      animate={animate}
      className="w-[342px] h-full mx-auto md:max-h-[30rem] backdrop-blur"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Image
              loader={loader}
              src={
                selectedConnector.icon?.dark ||
                selectedConnector.icon?.light ||
                ""
              }
              alt={selectedConnector.name}
              width={22}
              height={22}
            />
            <p className="font-bold text-[14px]">
              {/* {selectedConnector.name} */}
              Wallet
            </p>
          </div>
          <button
            onClick={closeModal}
            className=" hover:text-gray-400 transition-colors"
          >
            X
          </button>
        </div>

        <div className="space-y-6">
          {/* <p className="text-gray-300">
            Connect with your {selectedConnector.name} wallet to continue
          </p> */}
          <div className="w-full  flex flex-col items-center">
            <h2 className="text-[20px] font-semibold cursor-pointer mb-5">
              address
            </h2>
            <button className="w-[118px] bg-cyan-400 hover:bg-cyan-500 text-black font-medium py-2 rounded-md mb-4 transition-colors flex items-center justify-center gap-2">
              <Image src={deposit_walletIcon} alt="icon" />
              <span>Deposit</span>
            </button>
          </div>

          <div className="p-3 bg-[#21262B] rounded-xl ">
            <div className="rounded-lg   ">
              <div className="bg-[#2E353C] rounded-lg p-3 mb-4 hover:bg-[#2A3036] transition-colors ">
                <div className="flex items-center justify-center text-white mb-2 text-[16px] font-Arial font-bold">
                  Balance
                </div>

                {balances.map((balance, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-2 last:mb-0"
                  >
                    <div>
                      {balance.icon.startsWith("/") ? (
                        <Image
                          src={balance.icon}
                          alt={balance.symbol}
                          width={24}
                          height={24}
                        />
                      ) : (
                        <span className="text-xl">{balance.icon}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-gray-100">{balance.amount} </span>
                      <span className="text-gray-400">{balance.symbol}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full bg-[#2E353C] hover:bg-[#2E353C] text-white font-medium py-2 rounded-md mb-4 transition-colors">
                <span className="flex ml-2  gap-2">
                  <Image src={back_walletIcon} alt={"icon"} />
                  Disconnect
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </GenericModal>
  );
};

export default BlockchainWallet;
