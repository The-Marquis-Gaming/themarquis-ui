import { useState } from "react";
// import {
//   ArrowLeftEndOnRectangleIcon,
//   ChevronDownIcon,
// } from "@heroicons/react/24/outline";
import { isENS } from "~~/components/scaffold-stark";
import { getTargetNetworks } from "~~/utils/scaffold-stark";
import { Address } from "@starknet-react/chains";
import { useConnect } from "@starknet-react/core";
import { useTheme } from "next-themes";
import Image from "next/image";
import useConditionalStarkProfile from "~~/hooks/useConditionalStarkProfile";
import WalletModal from "~~/components/Modal/WalletModal";

const allowedNetworks = getTargetNetworks();

type AddressInfoDropdownProps = {
  address: Address;
  blockExplorerAddressLink: string | undefined;
  displayName: string;
  ensAvatar?: string;
};

export const AddressInfoDropdown = ({
  address,
  ensAvatar,
  displayName,
  blockExplorerAddressLink,
}: AddressInfoDropdownProps) => {
  const { data: profile } = useConditionalStarkProfile(address);
  // const [showBurnerAccounts, setShowBurnerAccounts] = useState(false);
  // const [selectingNetwork, setSelectingNetwork] = useState(false);
  const {
    connector,
    //  connectors, connect
  } = useConnect();
  const { resolvedTheme } = useTheme();
  // const isDarkMode = resolvedTheme === "dark";
  const [openWalletModal, setOpenWalletModal] = useState(false);

  // function handleConnectBurner(
  //   e: React.MouseEvent<HTMLButtonElement>,
  //   ix: number
  // ) {
  //   const connector = connectors.find(
  //     (it) => it.id == "burner-wallet"
  //   ) as BurnerConnector;
  //   if (connector) {
  //     connector.burnerAccount = burnerAccounts[ix];
  //     connect({ connector });
  //     setLastConnector({ id: connector.id, ix });
  //     setShowBurnerAccounts(false);
  //   }
  // }

  // const [_, setLastConnector] = useLocalStorage<{ id: string; ix?: number }>(
  //   "lastUsedConnector",
  //   { id: "" },
  //   {
  //     initializeWithValue: false,
  //   }
  // );

  return (
    <>
      <div className="header-btn uppercase">
        <div
          className="flex items-center gap-3 h-full w-full justify-center"
          onClick={() => setOpenWalletModal(true)}
        >
          {connector?.icon.light && (
            <Image
              src={connector?.icon.light!}
              width={20}
              height={20}
              alt="icon"
            />
          )}
          <span>
            {isENS(displayName)
              ? displayName
              : profile?.name ||
                address?.slice(0, 6) + "..." + address?.slice(-4)}
          </span>
        </div>
      </div>
      <WalletModal
        isOpen={openWalletModal}
        onClose={() => setOpenWalletModal(false)}
      />
    </>
  );
};
