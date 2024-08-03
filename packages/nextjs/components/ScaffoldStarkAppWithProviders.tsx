"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { Header } from "~~/components/Header";
import { ProgressBar } from "~~/components/scaffold-stark/ProgressBar";
import { appChains, connectors } from "~~/services/web3/connectors";
import provider from "~~/services/web3/provider";
import Banner from "~~/app/components/Banner";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-stark/useNativeCurrencyPrice";
import { Footer } from "./Footer";

const ScaffoldStarkApp = ({ children }: { children: React.ReactNode }) => {
  useNativeCurrencyPrice();
  const { resolvedTheme } = useTheme();

  const isDarkMode = resolvedTheme === "dark";
  return (
    <>
      <div className="flex relative flex-col min-h-screen bg-[#0F151A]">
        <Header />
        {/* <Banner /> */}
        <main className="flex flex-col flex-1">{children}</main>
        <Footer></Footer>
      </div>
      <Toaster />
    </>
  );
};

export const ScaffoldStarkAppWithProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <StarknetConfig
      chains={appChains}
      provider={provider}
      connectors={connectors}
      explorer={starkscan}
    >
      <ProgressBar />
      <ScaffoldStarkApp>{children}</ScaffoldStarkApp>
    </StarknetConfig>
  );
};
