import { NetworkOptions } from "./NetworkOptions";
import {
  ArrowLeftEndOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useDisconnect } from "@starknet-react/core";

export const WrongNetworkDropdown = () => {
  const { disconnect } = useDisconnect();

  const handleDisconnectWallet = () => {
    disconnect();
    localStorage.removeItem("lastUsedConnector");
  };

  return (
    <div className="dropdown dropdown-end mr-2">
      <label
        tabIndex={0}
        className="btn h-[50px] btn-error btn-sm dropdown-toggle gap-1 login-btn"
      >
        <span className="text-white font-medium text-[16px]">
          Wrong network
        </span>
        <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" color="white" />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 mt-1 shadow-center shadow-accent gap-1"
      >
        {/* <NetworkOptions /> */}
        <li className="bg-[#1D1A1AA9] rounded-[12px]">
          <button
            className="menu-item text-gray-400 btn-sm !rounded-xl flex gap-3 py-3"
            type="button"
            onClick={handleDisconnectWallet}
          >
            <ArrowLeftEndOnRectangleIcon className="h-6 w-4 ml-2 sm:ml-0" />
            <span>Disconnect</span>
          </button>
        </li>
      </ul>
    </div>
  );
};