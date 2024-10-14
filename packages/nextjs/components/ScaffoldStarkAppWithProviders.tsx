"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { Header } from "~~/components/Header";
import { ProgressBar } from "~~/components/scaffold-stark/ProgressBar";
import { appChains, connectors } from "~~/services/web3/connectors";
import provider from "~~/services/web3/provider";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-stark/useNativeCurrencyPrice";
import ModalMobile from "./ModalMobile/ModalMobile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ScaffoldStarkApp = ({ children }: { children: React.ReactNode }) => {
  useNativeCurrencyPrice();
  const { resolvedTheme } = useTheme();

  const isDarkMode = resolvedTheme === "dark";

  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 700) {
        setIsMobile(true);
        setIsModalOpen(true);
      } else {
        setIsMobile(false);
        setIsModalOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex relative flex-col min-h-screen bg-[#0F151A]">
        <Header />
        <main className="flex flex-col flex-1 relative z-50">{children}</main>
      </div>
      <Toaster />
      {/* {isMobile && (
        <ModalMobile isOpen={isModalOpen} onClose={closeModal}></ModalMobile>
      )} */}
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
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <StarknetConfig
        chains={appChains}
        provider={provider}
        connectors={connectors}
        explorer={starkscan}
      >
        <ProgressBar />
        <ScaffoldStarkApp>{children}</ScaffoldStarkApp>
      </StarknetConfig>
    </QueryClientProvider>
  );
};

export default ScaffoldStarkAppWithProviders;
