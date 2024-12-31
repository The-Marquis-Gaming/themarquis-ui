import { Connector, useConnect } from "@starknet-react/core";
import { useEffect, useRef, useState } from "react";
import Wallet from "~~/components/scaffold-stark/CustomConnectButton/Wallet";
import { useLocalStorage } from "usehooks-ts";
import { burnerAccounts } from "~~/utils/devnetAccounts";
import { BurnerConnector } from "~~/services/web3/stark-burner/BurnerConnector";
import { useTheme } from "next-themes";
import { BlockieAvatar } from "../BlockieAvatar";
import GenericModal from "./GenericModal";
import {
  LAST_CONNECTED_TIME_LOCALSTORAGE_KEY,
  CHAIN_ID_LOCALSTORAGE_KEY,
} from "~~/utils/Constants";
import Image from "next/image";

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

const ConnectModal = () => {
  const modalRef = useRef<HTMLInputElement>(null);
  const [isBurnerWallet, setIsBurnerWallet] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [shuffledConnectors, setShuffledConnectors] = useState<any[]>([]);
  const [animate, setAnimate] = useState(false);
  const { connectors, connect, connectAsync, error, status, ...props } =
    useConnect();
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
  const [, setLastConnectionTime] = useLocalStorage<number>(
    LAST_CONNECTED_TIME_LOCALSTORAGE_KEY,
    0,
  );

  const [, setConnectedChainId] = useLocalStorage<bigint>(
    CHAIN_ID_LOCALSTORAGE_KEY,
    0n,
  );

  const handleCloseModal = () => {
    if (modalRef.current) {
      modalRef.current.checked = false;
    }
  };

  async function handleConnectWallet(
    e: React.MouseEvent<HTMLButtonElement>,
    connector: Connector,
  ): Promise<void> {
    if (connector.id === "burner-wallet") {
      setIsBurnerWallet(true);
      return;
    }
    await connectAsync({ connector });
    setLastConnector({ id: connector.id });
    setLastConnectionTime(Date.now());

    // Fetch the connected chain ID and save it
    connector?.chainId()?.then((chainId: string | number | bigint) => {
      // console.log("Connector chain id", chainId);
      setConnectedChainId(BigInt(chainId as string)); // Save chain ID in localStorage
      localStorage.setItem(CHAIN_ID_LOCALSTORAGE_KEY, chainId.toString());
    });

    handleCloseModal();
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
      setLastConnectionTime(Date.now());
      handleCloseModal();
    }
  }

  useEffect(() => {
    setShuffledConnectors(shuffleArray(connectors));
  }, [connectors]);

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
    <div>
      <label
        htmlFor="connect-modal"
        className="rounded-[18px] hidden connect-btn items-center font-lasserit md:flex h-[50px] gap-3 max-w-[280px] mx-auto"
      >
        <Image
          src={"/landingpage/connectWalletIcon.svg"}
          width={30}
          height={25}
          alt="icon"
        />
        <span className="text-[18px]">Connect Wallet</span>
      </label>

      <input
        ref={modalRef}
        type="checkbox"
        id="connect-modal"
        className="modal-toggle"
      />
      <GenericModal
        modalId="connect-modal"
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
              {!isBurnerWallet ? (
                shuffledConnectors.map((connector, index) => (
                  <Wallet
                    key={connector.id || index}
                    connector={connector}
                    loader={loader}
                    handleConnectWallet={handleConnectWallet}
                  />
                ))
              ) : (
                <div className="flex flex-col pb-[20px] justify-end gap-3">
                  <div className="h-[300px] overflow-y-auto flex w-full flex-col gap-2">
                    {burnerAccounts.map((burnerAcc, ix) => (
                      <div
                        key={burnerAcc.publicKey}
                        className="w-full flex flex-col"
                      >
                        <button
                          className={`hover:bg-gradient-modal border rounded-md text-neutral py-[8px] pl-[10px] pr-16 flex items-center gap-4 ${
                            isDarkMode ? "border-[#385183]" : ""
                          }`}
                          onClick={(e) => handleConnectBurner(e, ix)}
                        >
                          <BlockieAvatar
                            address={burnerAcc.accountAddress}
                            size={35}
                          />
                          {`${burnerAcc.accountAddress.slice(
                            0,
                            6,
                          )}...${burnerAcc.accountAddress.slice(-4)}`}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                    <Image
                      src="/eth.svg"
                      alt="metamask"
                      width={15}
                      height={15}
                    />
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
    </div>
  );
};

export default ConnectModal;
