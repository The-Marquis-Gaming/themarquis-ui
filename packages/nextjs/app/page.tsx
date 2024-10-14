"use client";
import React, { useEffect } from "react";
import "./styles/styles.css";
import { Footer } from "~~/components/Footer";
import LandingPage from "~~/components/Landingpage";
import { useAccount } from "@starknet-react/core";
import { notification } from "~~/utils/scaffold-stark";

export default function Home() {
  const { connector } = useAccount();
  useEffect(() => {
    // @ts-ignore
    if (window.starknet && window.starknet.isConnected) {
      if (
        // @ts-ignore
        connector?._wallet?.chainId == "SN_MAIN" ||
        // @ts-ignore
        connector?._wallet?.chainId == "SN_GOERLI"
      ) {
        notification.wrongNetwork("Please connect to Starknet Sepolia network");
      }
    }
    // @ts-ignore
  }, [connector?._wallet?.chainId]);
  return (
    <div className="lasserit-font">
      <LandingPage />
      <Footer />
    </div>
  );
}
