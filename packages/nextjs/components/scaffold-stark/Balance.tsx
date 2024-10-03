"use client";

import { useState } from "react";
import { Address } from "@starknet-react/chains";
import { useGlobalState } from "~~/services/store/store";
import useScaffoldStrkBalance from "~~/hooks/scaffold-stark/useScaffoldStrkBalance";
import useScaffoldEthBalance from "~~/hooks/scaffold-stark/useScaffoldEthBalance";

type BalanceProps = {
  address?: Address;
  className?: string;
  usdMode?: boolean;
  token?: string;
};

/**
 * Display (ETH & STRK) balance of an ETH address.
 */
export const Balance = ({
  address,
  className = "",
  usdMode,
  token = "STRK",
}: BalanceProps) => {
  const price = useGlobalState((state) => state.nativeCurrencyPrice);
  const {
    formatted: STRK,
    isLoading: isLoadingSTRK,
    isError: isErrorSTRK,
  } = useScaffoldStrkBalance({
    address,
  });
  const {
    formatted: ETH,
    isLoading: isLoadingETH,
    isError: isErrorETH,
  } = useScaffoldEthBalance({
    address,
  });
  const [displayUsdMode, setDisplayUsdMode] = useState(
    price > 0 ? Boolean(usdMode) : false,
  );

  const toggleBalanceMode = () => {
    if (price > 0) {
      setDisplayUsdMode((prevMode) => !prevMode);
    }
  };

  if (
    !address ||
    isLoadingSTRK ||
    isErrorETH ||
    STRK === null ||
    ETH === null
  ) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (isErrorSTRK || isLoadingETH) {
    return (
      <div
        className={`border-2 border-gray-400 rounded-md px-2 flex flex-col items-center max-w-fit cursor-pointer`}
      >
        <div className="text-warning">Error</div>
      </div>
    );
  }

  //const formattedBalance = balance ? Number(balance.formatted) : 0;

  return (
    <button
      className={`p-0 btn btn-sm btn-ghost flex flex-col font-normal items-center hover:bg-transparent ${className}`}
      onClick={toggleBalanceMode}
    >
      <div className="w-full flex items-center justify-center">
        {displayUsdMode ? (
          <>
            <span className="text-[0.8em] font-bold mr-1">$</span>
            <span>
              {(
                parseFloat(token == "STRK" ? STRK : ETH) * price
              ).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </>
        ) : (
          <>
            <span>
              {token === "STRK"
                ? parseFloat(STRK).toFixed(2)
                : parseFloat(ETH).toFixed(8)}
            </span>
            <span className="text-[0.8em] font-bold ml-1">{token}</span>
          </>
        )}
      </div>
    </button>
  );
};
