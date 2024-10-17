"use client";

import { useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import { notification } from "~~/utils/scaffold-stark";

const NetworkProvider = ({ children }: { children: React.ReactNode }) => {
  const { connector } = useAccount();

  useEffect(() => {
    const checkNetwork = () => {
      // @ts-ignore
      if (window.starknet && window.starknet.isConnected) {
        if (
          // @ts-ignore
          connector?._wallet?.chainId === "SN_MAIN" ||
          // @ts-ignore
          connector?._wallet?.chainId === "SN_GOERLI"
        ) {
          notification.wrongNetwork(
            "Please connect to Starknet Sepolia network",
          );
        }
      }
    };

    checkNetwork();

    // @ts-ignore
  }, [connector?._wallet?.chainId]);

  return <>{children}</>;
};

export default NetworkProvider;
