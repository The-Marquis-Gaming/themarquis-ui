import React from "react";
import Link from "next/link";

import {
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";
import { devnet } from "@starknet-react/chains";
import { Faucet } from "~~/components/scaffold-stark/Faucet";
import { getBlockExplorerLink } from "~~/utils/scaffold-stark";

/**
 * Site footer
 */
export const Footer = () => {
  const nativeCurrencyPrice = useGlobalState(
    (state) => state.nativeCurrencyPrice,
  );
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === devnet.id;

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0 bg-[#0F151A] flex justify-center mt-8">
      <span>
        THE MARQUIS. © 2024. All rights reserved. By using out website you
        consent to all cookies in accordance with out Terms and Privcy Policy
      </span>
    </div>
  );
};
