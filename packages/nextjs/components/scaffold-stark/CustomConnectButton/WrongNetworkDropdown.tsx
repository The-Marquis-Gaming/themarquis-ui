// import { NetworkOptions } from "./NetworkOptions";
// import {
//   ArrowLeftEndOnRectangleIcon,
//   ChevronDownIcon,
// } from "@heroicons/react/24/outline";
import { useDisconnect } from "@starknet-react/core";

export const WrongNetworkDropdown = () => {
  const { disconnect } = useDisconnect();

  const handleDisconnectWallet = () => {
    disconnect();
    localStorage.removeItem("lastUsedConnector");
  };

  return (
    <div className="network-wallet relative">
      <div className="btn wrong-network-btn btn-error header-btn hover-hidden transition-opacity duration-1000 ease-in-out opacity-100">
        Wrong Network
      </div>
      <div
        className="disconnect-wallet-btn header-btn flex items-center justify-center hover-visible transition-opacity duration-1000 ease-in-out opacity-0 "
        onClick={handleDisconnectWallet}
      >
        Disconnect
      </div>
    </div>
  );
};
