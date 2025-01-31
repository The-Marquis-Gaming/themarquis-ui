"use client";

import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { useAutoConnect } from "~~/hooks/scaffold-stark";
import { useAccount } from "@starknet-react/core";
import { useMemo } from "react";
import ConnectModal from "./ConnectModal";
import scaffoldConfig from "~~/scaffold.config";
import { Address } from "@starknet-react/chains";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-stark";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";

export const CustomConnectButton = () => {
  useAutoConnect();
  const { targetNetwork } = useTargetNetwork();
  const { status, address: accountAddress, chainId } = useAccount();

  const blockExplorerAddressLink = useMemo(() => {
    return accountAddress && getBlockExplorerAddressLink(targetNetwork, accountAddress);
  }, [accountAddress, targetNetwork]);

  if (status === "disconnected") return <ConnectModal />;

  // Skip wrong network check if using a fork or on devnet
  if (!scaffoldConfig.isFork && chainId && chainId !== targetNetwork.id && targetNetwork.id !== 1n) {
    return <WrongNetworkDropdown />;
  }

  return (
    <>
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