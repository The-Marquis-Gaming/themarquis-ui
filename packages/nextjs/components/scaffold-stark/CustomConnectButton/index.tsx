"use client";

// @refresh reset
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { useAutoConnect } from "~~/hooks/scaffold-stark";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-stark";
import { useAccount, useConnect } from "@starknet-react/core";
import { Address } from "@starknet-react/chains";
import { useEffect, useMemo, useState } from "react";
import ConnectModal from "./ConnectModal";
import scaffoldConfig from "~~/scaffold.config";
import { NetworkChangeEventHandler } from "get-starknet-core";
import { CHAIN_ID_LOCALSTORAGE_KEY } from "~~/utils/Constants";

/**
 * Custom Connect Button (watch balance + custom design)
 */
export const CustomConnectButton = () => {
  useAutoConnect();
  const { targetNetwork } = useTargetNetwork();
  const { connectors } = useConnect();
  const { status, address: accountAddress } = useAccount();
  const chainId = localStorage.getItem("chainId");
  const [connectedChainId, setConnectedChainId] = useState(
    BigInt(chainId || ""),
  );

  const blockExplorerAddressLink = useMemo(() => {
    return (
      accountAddress &&
      getBlockExplorerAddressLink(targetNetwork, accountAddress)
    );
  }, [accountAddress, targetNetwork]);

  useEffect(() => {
    const handleNetwork: NetworkChangeEventHandler = (
      chainId?: string,
      accounts?: string[],
    ) => {
      if (!!chainId) {
        // console.log("Network changed to:", chainId);
        localStorage.setItem(CHAIN_ID_LOCALSTORAGE_KEY, chainId);
      }
    };

    if (connectors) {
      connectors.map((connector) => {
        connector.on("change", (data) =>
          handleNetwork(data?.chainId?.toString()),
        );
      });
    }

    return () => {
      if (connectors) {
        connectors.map((connector) => {
          connector.off("change", (data) =>
            handleNetwork(data?.chainId?.toString()),
          );
        });
      }
    };
  }, [connectors]);

  // hook to update chainId when chainId in locastorage changes
  useEffect(() => {
    const chainId = localStorage.getItem("chainId");
    if (chainId) {
      setConnectedChainId(BigInt(chainId));
    }
  }, [chainId]);

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
