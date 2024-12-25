"use client";

// @refresh reset
import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { useAutoConnect, useNetworkColor } from "~~/hooks/scaffold-stark";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-stark";
import { useAccount, useNetwork, useProvider } from "@starknet-react/core";
import { Address } from "@starknet-react/chains";
import { useEffect, useMemo, useState } from "react";
import ConnectModal from "./ConnectModal";
import scaffoldConfig from "~~/scaffold.config";
import { constants, Provider } from "starknet";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { CHAIN_ID_LOCALSTORAGE_KEY } from "~~/utils/Constants";

/**
 * Custom Connect Button (watch balance + custom design)
 */
export const CustomConnectButton = () => {
  useAutoConnect();
  const { targetNetwork } = useTargetNetwork();
  const { account, status, address: accountAddress } = useAccount();
  // const [accountChainId, setAccountChainId] = useState<bigint>(0n);
  const provider = new Provider((window as any)?.starknet);
  const [connectedChainId, setConnectedChainId] = useState(
    BigInt(localStorage.getItem("chainId") || ""),
  );

  const blockExplorerAddressLink = useMemo(() => {
    return (
      accountAddress &&
      getBlockExplorerAddressLink(targetNetwork, accountAddress)
    );
  }, [accountAddress, targetNetwork]);

  // useEffect(() => {
  //   if (account && provider && connectedChainId) {
  //     // Update chain ID when network changes
  //     const handleChainChanged = async () => {
  //       const newChainId = await provider.getChainId();
  //       if(BigInt(newChainId) === connectedChainId) return console.log("chainId not changed");
  //       console.log("Chain changed to:", BigInt(newChainId));
  //       localStorage.setItem(CHAIN_ID_LOCALSTORAGE_KEY, newChainId.toString());
  //     }

  //     // handleChainChanged();
  //   }
  // }, [provider, account]);

  useEffect(() => {
    console.log(connectedChainId, targetNetwork.id);
  }, [account]);

  // hook to update chainId when chainId in locastorage changes
  useEffect(() => {
    const chainId = localStorage.getItem("chainId");
    if (chainId) {
      setConnectedChainId(BigInt(chainId));
    }
  }, [localStorage.getItem("chainId")]);

  if (status === "disconnected") return <ConnectModal />;
  // Skip wrong network check if using a fork
  if (!scaffoldConfig.isFork && connectedChainId !== targetNetwork.id) {
    return <WrongNetworkDropdown />;
  }

  return (
    <>
      {/* <div className="flex flex-col items-center max-sm:mt-2">
        <Balance
          address={accountAddress as Address}
          className="min-h-0 h-auto"
        />
        <span className="text-xs ml-1" style={{ color: networkColor }}>
          {chain.name}
        </span>
      </div> */}
      <AddressInfoDropdown
        address={accountAddress as Address}
        displayName={""}
        ensAvatar={""}
        blockExplorerAddressLink={blockExplorerAddressLink}
      />
      <AddressQRCodeModal
        address={accountAddress as Address}
        modalId="qrcode-modal"
      />
    </>
  );
};
