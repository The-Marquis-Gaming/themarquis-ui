import Image from "next/image";
import GenericModal from "./GenericModal";
import { Connector, useConnect } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import Wallet from "~~/components/scaffold-stark/CustomConnectButton/Wallet";
import { useLocalStorage } from "usehooks-ts";
import { burnerAccounts } from "~~/utils/devnetAccounts";
import { BurnerConnector } from "~~/services/web3/stark-burner/BurnerConnector";
import { useTheme } from "next-themes";
import { BlockieAvatar } from "../BlockieAvatar";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const loader = ({ src }: { src: string }) => {
  return src;
};

const ConnectModal = ({ isOpen, onClose }: Props) => {
  const [animate, setAnimate] = useState(false);
  const [isBurnerWallet, setIsBurnerWallet] = useState(false);

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

  useEffect(() => setAnimate(isOpen), [isOpen]);

  const { connectors, connect } = useConnect();

  const [_, setLastConnector] = useLocalStorage<{ id: string; ix?: number }>(
    "lastUsedConnector",
    { id: "" },
    {
      initializeWithValue: false,
    },
  );

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
      (it) => it.id == "burner-wallet",
    ) as BurnerConnector;
    if (connector) {
      connector.burnerAccount = burnerAccounts[ix];
      connect({ connector });
      setLastConnector({ id: connector.id, ix });
      closeModal(e);
    }
  }

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={closeModal}
      animate={animate}
      className={`${isBurnerWallet ? "w-full" : "w-[600px] h-full"} mx-auto md:max-h-[30rem] md:max-w-[25rem] backdrop-blur`}
    >
      <div className="flex p-4 w-full lg:p-0 lg:grid-cols-5 font-monserrat">
        <div className="basis-5/6 lg:col-span-2 lg:py-4 lg:pl-8 flex flex-col justify-center items-center">
          <h2 className="text-center mt-6 mb-1 lg:text-start text-neutral text-[1.125em] font-valorant">
            {isBurnerWallet ? "Choose account" : "Connect a Wallet"}
          </h2>
          <span>Please connect your wallet first</span>
        </div>
        <div className="ml-auto lg:col-span-3 lg:py-4 lg:pr-8 text-base-100 flex justify-center items-center">
          {/* <button
            onClick={(e) => {
              closeModal(e);
              e.stopPropagation();
            }}
            className="w-8 h-8 grid place-content-center rounded-full text-neutral"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m6.4 18.308l-.708-.708l5.6-5.6l-5.6-5.6l.708-.708l5.6 5.6l5.6-5.6l.708.708l-5.6 5.6l5.6 5.6l-.708.708l-5.6-5.6z"
              />
            </svg>
          </button> */}
        </div>
      </div>
      <div className="flex flex-col flex-1 lg:grid">
        <div className="flex flex-col gap-4 w-full px-8 py-10 font-monserrat">
          <span>Starknet Wallet</span>
          {connectors.map((connector, index) => (
            <Wallet
              key={connector.id || index}
              connector={connector}
              loader={loader}
              handleConnectWallet={handleConnectWallet}
            />
          ))}
          <span>Ethereum Wallet</span>
          <div className="relative bg-[#21262B] rounded-[8px] w-full p-2 flex items-center">
            <div className="flex items-center gap-4 flex-1 px-2">
              <Image
                src="/metamask.svg"
                alt="metamask"
                width={30}
                height={30}
              />
              <p className="text-[#6D7682] flex-1">Metamask</p>
              <div className="flex items-center gap-2 bg-[#363D43] p-2 rounded-[4px]">
                <Image src="/eth.svg" alt="eth" width={15} height={15} />
                <span className="text-[#6D7682] text-sm">Ethereum</span>
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
    </GenericModal>
  );
};

export default ConnectModal;
