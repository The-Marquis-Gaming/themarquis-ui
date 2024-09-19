import { useRef, useState } from "react";
import {
  ArrowLeftEndOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useLocalStorage } from "usehooks-ts";
import { BlockieAvatar, isENS } from "~~/components/scaffold-stark";
import { BurnerConnector } from "~~/services/web3/stark-burner/BurnerConnector";
import { getTargetNetworks } from "~~/utils/scaffold-stark";
import { burnerAccounts } from "~~/utils/devnetAccounts";
import { Address } from "@starknet-react/chains";
import { useDisconnect, useNetwork, useConnect } from "@starknet-react/core";
import { getStarknetPFPIfExists } from "~~/utils/profile";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Balance } from "../Balance";
import Link from "next/link";
import useConditionalStarkProfile from "~~/hooks/useConditionalStarkProfile";
import { useOutsideClick } from "~~/hooks/scaffold-stark";

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
  const { disconnect } = useDisconnect();
  const [addressCopied, setAddressCopied] = useState(false);
  const { data: profile } = useConditionalStarkProfile(address);
  const { chain } = useNetwork();
  const [showBurnerAccounts, setShowBurnerAccounts] = useState(false);
  const [selectingNetwork, setSelectingNetwork] = useState(false);
  const { connectors, connect } = useConnect();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const dropdownRef = useRef<HTMLDetailsElement>(null);

  const handleDisconnectWallet = () => {
    disconnect();
    localStorage.removeItem("lastUsedConnector");
  };

  const closeDropdown = () => {
    setSelectingNetwork(false);
    dropdownRef.current?.removeAttribute("open");
  };
  useOutsideClick(dropdownRef, closeDropdown);

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
      setShowBurnerAccounts(false);
    }
  }

  const [_, setLastConnector] = useLocalStorage<{ id: string; ix?: number }>(
    "lastUsedConnector",
    { id: "" },
    {
      initializeWithValue: false,
    },
  );

  return (
    <>
      <details ref={dropdownRef} className="dropdown dropdown-end leading-3">
        <summary
          tabIndex={0}
          className="btn bg-transparent btn-sm pl-0 pr-2 dropdown-toggle gap-0 !h-auto font-monserrat"
        >
          {getStarknetPFPIfExists(profile?.profilePicture) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile?.profilePicture}
              alt="Profile Picture"
              className="rounded-full h-8 w-8"
              width={30}
              height={30}
            />
          ) : (
            <BlockieAvatar address={address} size={30} ensImage={ensAvatar} />
          )}
          <span className="ml-4 mr-1">
            {isENS(displayName)
              ? displayName
              : profile?.name ||
                address?.slice(0, 6) + "..." + address?.slice(-4)}
          </span>
          <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
        </summary>
        <ul
          tabIndex={0}
          className={`dropdown-content menu rounded-none z-50 p-0 pt-2 mt-2 gap-1 bg-modal-wallet w-[200px] font-normal`}
          style={{ zIndex: 100 }}
        >
          <li className="flex flex-col items-start gap-1">
            <div className="flex items-center justify-between w-full">
              <span>Wallet Balance</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="7"
                viewBox="0 0 13 7"
                fill="none"
              >
                <path
                  d="M7.18314 6.31686L11.7929 1.70711C12.4229 1.07714 11.9767 0 11.0858 0H1.53702C0.629399 0 0.191179 1.11177 0.8547 1.73105L5.79372 6.3408C6.18766 6.70849 6.8021 6.6979 7.18314 6.31686Z"
                  fill="#00ECFF"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="w-full flex items-center justify-between">
                <Image
                  src="/logo-starknet.svg"
                  alt="STRK Icon"
                  width={24}
                  height={24}
                />
                <Balance
                  address={address as Address}
                  className="min-h-0 h-auto"
                />
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="w-full flex items-center justify-between">
                <Image
                  src="/logo-eth.svg"
                  alt="ETH Icon"
                  width={24}
                  height={24}
                />
                <Balance
                  address={address as Address}
                  token="ETH"
                  className="min-h-0 h-auto"
                />
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="w-full flex items-center justify-between">
                <Image src="/usdc.svg" alt="USDC Icon" width={24} height={24} />
                {/* <Balance
                  address={address as Address}
                  className="min-h-0 h-auto"
                /> */}
                <p className="m-0">Coming Soon</p>
              </div>
            </div>
          </li>

          <li className="flex flex-col items-start gap-2 mt-2">
            <div className="flex items-center justify-between w-full">
              <span>Actions</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="7"
                viewBox="0 0 13 7"
                fill="none"
              >
                <path
                  d="M7.18314 6.31686L11.7929 1.70711C12.4229 1.07714 11.9767 0 11.0858 0H1.53702C0.629399 0 0.191179 1.11177 0.8547 1.73105L5.79372 6.3408C6.18766 6.70849 6.8021 6.6979 7.18314 6.31686Z"
                  fill="#00ECFF"
                />
              </svg>
            </div>
            <Link
              className="btn-sm flex items-center gap-2 w-full pl-4"
              href="/deposit"
              onClick={closeDropdown}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
              >
                <path
                  d="M5.81792 8.08772C5.73637 8.17588 5.62112 8.22609 5.50026 8.22609C5.37939 8.22609 5.26415 8.17588 5.1826 8.08772L2.88694 5.60571C2.72653 5.43228 2.73872 5.16315 2.91416 5.00458C3.08961 4.84602 3.36187 4.85804 3.52228 5.03147L5.06982 6.70466V0.425487C5.06982 0.190499 5.26254 0 5.50026 0C5.73797 0 5.93069 0.190499 5.93069 0.425487V6.70466L7.47825 5.03147C7.63866 4.85804 7.91092 4.84602 8.08636 5.00458C8.26181 5.16315 8.27398 5.43228 8.11357 5.60571L5.81792 8.08772Z"
                  fill="white"
                />
                <path
                  d="M0.846154 7.21219C0.846154 6.97976 0.65674 6.79132 0.423077 6.79132C0.18942 6.79132 2.95563e-07 6.97976 2.95563e-07 7.21219V7.243C-1.09865e-05 8.01044 -2.2309e-05 8.62901 0.0657295 9.11553C0.133997 9.62063 0.280038 10.0459 0.619582 10.3836C0.959127 10.7215 1.38664 10.8667 1.8944 10.9346C2.38346 11 3.00528 11 3.77674 11H7.22328C7.99474 11 8.61655 11 9.10563 10.9346C9.61338 10.8667 10.0409 10.7215 10.3804 10.3836C10.72 10.0459 10.866 9.62063 10.9343 9.11553C11 8.62901 11 8.01044 11 7.243V7.21219C11 6.97976 10.8106 6.79132 10.5769 6.79132C10.3433 6.79132 10.1538 6.97976 10.1538 7.21219C10.1538 8.01768 10.1529 8.57946 10.0957 9.00336C10.04 9.41513 9.93825 9.63314 9.7821 9.78847C9.62596 9.9438 9.40681 10.045 8.99287 10.1004C8.56674 10.1574 8.00202 10.1583 7.19231 10.1583H3.80769C2.99797 10.1583 2.43324 10.1574 2.00714 10.1004C1.59322 10.045 1.37402 9.9438 1.2179 9.78847C1.06178 9.63314 0.95999 9.41513 0.904341 9.00336C0.847051 8.57946 0.846154 8.01768 0.846154 7.21219Z"
                  fill="white"
                />
              </svg>
              <span>Deposit</span>
            </Link>
          </li>

          <li className="mt-4">
            <button
              className="text-black flex justify-center font-semibold py-3 w-full rounded-none bg-[#00ECFF] hover:bg-white"
              onClick={handleDisconnectWallet}
            >
              <span>Disconnect</span>
              <Image
                src={"/logout-icon.svg"}
                width={15}
                height={15}
                alt="icon"
              />
            </button>
          </li>
        </ul>
      </details>
    </>
  );
};
