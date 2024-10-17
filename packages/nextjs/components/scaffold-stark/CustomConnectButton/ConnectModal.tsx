import Image from "next/image";
import GenericModal from "./GenericModal";
import { Connector, useConnect } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import Wallet from "~~/components/scaffold-stark/CustomConnectButton/Wallet";
import { useLocalStorage } from "usehooks-ts";
import { burnerAccounts } from "~~/utils/devnetAccounts";
import { BurnerConnector } from "~~/services/web3/stark-burner/BurnerConnector";
import { useTheme } from "next-themes";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const loader = ({ src }: { src: string }) => {
  return src;
};

const shuffleArray = (array: any) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const ConnectModal = ({ isOpen, onClose }: Props) => {
  const { connectors, connect } = useConnect();
  const [animate, setAnimate] = useState(false);
  const [isBurnerWallet, setIsBurnerWallet] = useState(false);
  const [shuffledConnectors, setShuffledConnectors] = useState<any[]>([]);
  const [lastConnector, setLastConnector] = useLocalStorage<{
    id: string;
    ix?: number;
  }>(
    "lastUsedConnector",
    { id: "" },
    {
      initializeWithValue: false,
    },
  );

  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnimate(false);
    setTimeout(() => {
      onClose();
    }, 400);
    setIsBurnerWallet(false);
  };

  function handleConnectWallet(
    e: React.MouseEvent<HTMLButtonElement>,
    connector: Connector,
  ): void {
    if (connector.id === "burner-wallet") {
      setIsBurnerWallet(true);
      return;
    }

    connect({ connector });
    setLastConnector({ id: connector.id });
    closeModal(e);
  }

  function handleConnectBurner(
    e: React.MouseEvent<HTMLButtonElement>,
    ix: number,
  ) {
    const connector = connectors.find(
      (it) => it.id === "burner-wallet",
    ) as BurnerConnector;
    if (connector) {
      connector.burnerAccount = burnerAccounts[ix];
      connect({ connector });
      setLastConnector({ id: connector.id, ix });
      closeModal(e);
    }
  }

  useEffect(() => {
    if (isOpen) {
      setShuffledConnectors(shuffleArray(connectors));
    }
    setAnimate(isOpen);
  }, [connectors, isOpen]);

  useEffect(() => {
    if (lastConnector?.id) {
      const connector = connectors.find(
        (connector) => connector.id === lastConnector.id,
      );
      if (connector) {
        if (
          lastConnector.id === "burner-wallet" &&
          lastConnector.ix !== undefined
        ) {
          // Reconnect burner wallet
          (connector as BurnerConnector).burnerAccount =
            burnerAccounts[lastConnector.ix];
        }
        connect({ connector });
      }
    }
  }, [lastConnector, connectors, connect]);

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={closeModal}
      animate={animate}
      className={`${isBurnerWallet ? "w-full" : "w-[580px] h-full"} mx-auto md:max-h-[30rem] backdrop-blur`}
    >
      <div className="py-[40px] px-[52px] flex flex-col gap-[60px]">
        <div className="w-full font-monserrat">
          <h2 className="text-center text-[32px] font-valorant">
            {isBurnerWallet ? "Choose account" : "Connect Wallet"}
          </h2>
        </div>
        <div className="flex flex-col flex-1 lg:grid">
          <div className="flex flex-col gap-3 w-full font-monserrat">
            {shuffledConnectors.map((connector, index) => (
              <Wallet
                key={connector.id || index}
                connector={connector}
                loader={loader}
                handleConnectWallet={handleConnectWallet}
              />
            ))}
            {/* Metamask section */}
            <div className="relative bg-[#21262B] rounded-[8px] w-full  px-[35px] py-[23px] pr-[15px]  flex items-center">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-[60px]">
                  <Image
                    src="/metamask.svg"
                    alt="metamask"
                    width={37}
                    height={37}
                  />
                  <p className="text-[#6D7682] text-[20px]">Metamask</p>
                </div>
                <div className="flex gap-3 bg-[#363D43]  rounded-[4px] h-[40px] w-[156px] items-center justify-center">
                  <Image src="/eth.svg" alt="eth" width={15} height={15} />
                  <span className="text-[#6D7682] text-[20px]">Ethereum</span>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-transparent-black rounded-[8px] z-10">
                <div className="absolute top-0 right-0 bg-[#363D43] p-2 rounded-tr-[8px]">
                  <Image src="/lock.svg" alt="lock" width={10} height={10} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GenericModal>
  );
};

export default ConnectModal;
