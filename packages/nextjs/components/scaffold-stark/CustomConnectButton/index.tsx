"use client";

// @refresh reset
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-stark";
import { useAccount, useNetwork } from "@starknet-react/core";
import { Address } from "@starknet-react/chains";
import { useState } from "react";
import ConnectModal from "./ConnectModal";
import { useNetworkColor } from "~~/hooks/scaffold-stark";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";
import ConnectWalletIcon from "@/public/landingpage/connectWalletIcon.svg";
import Image from "next/image";

/**
 * Custom Connect Button (watch balance + custom design)
 */
export const CustomConnectButton = () => {
  const networkColor = useNetworkColor();
  const { targetNetwork } = useTargetNetwork();
  const { address, status, chainId, ...props } = useAccount();
  const { chain } = useNetwork();
  const [modalOpen, setModalOpen] = useState(false);

  const blockExplorerAddressLink = address
    ? getBlockExplorerAddressLink(targetNetwork, address)
    : undefined;

  const handleWalletConnect = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return status == "disconnected" ? (
    <>
      <div
        className="hidden connect-btn  md:flex h-[50px] gap-3"
        onClick={handleWalletConnect}
      >
        <Image src={ConnectWalletIcon} alt="icon" />
        <button type="button" className="text-[20px]">
          Connect Wallet
        </button>
      </div>
      <ConnectModal isOpen={modalOpen} onClose={handleModalClose} />
    </>
  ) : chainId !== targetNetwork.id ? (
    <WrongNetworkDropdown />
  ) : (
    <>
      {/* <div className="flex flex-col items-center mr-1">
        <Balance address={address as Address} className="min-h-0 h-auto" />
        <span className="text-xs" style={{ color: networkColor }}>
          {chain.name}
        </span>
      </div> */}
      <AddressInfoDropdown
        address={address as Address}
        displayName={""}
        ensAvatar={""}
        blockExplorerAddressLink={blockExplorerAddressLink}
      />
      <AddressQRCodeModal address={address as Address} modalId="qrcode-modal" />
    </>
  );
};
