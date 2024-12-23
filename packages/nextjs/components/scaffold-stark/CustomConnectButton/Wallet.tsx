import React, { useEffect, useMemo, useState } from "react";
import { Connector } from "@starknet-react/core";
import Image from "next/image";
import { useTheme } from "next-themes";

const Wallet = ({
  handleConnectWallet,
  connector,
  loader,
}: {
  connector: Connector;
  loader: ({ src }: { src: string }) => string;
  handleConnectWallet: (
    e: React.MouseEvent<HTMLButtonElement>,
    connector: Connector,
  ) => void;
}) => {
  const [clicked, setClicked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  // connector has two : dark and light icon
  const icon = useMemo(() => {
    return typeof connector.icon === "object"
      ? resolvedTheme === "dark"
        ? (connector.icon.dark as string)
        : (connector.icon.light as string)
      : (connector.icon as string);
  }, [connector, resolvedTheme]);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <button
      className={`flex justify-between items-center px-[35px] py-[23px] pr-[15px]  rounded-[8px] transition-all cursor-pointer bg-[#21262B] ${isDarkMode ? "" : " hover:border-none"} ${clicked ? "bg-ligth" : ""}`}
      onClick={(e) => {
        setClicked(true);
        handleConnectWallet(e, connector);
      }}
    >
      <div className="flex items-center gap-[60px]">
        <div className="rounded-[5px]">
          <Image
            alt={connector.name}
            loader={loader}
            src={icon}
            width={100}
            height={100}
            className="max-w-[37px] max-h-[37px]"
          />
        </div>
        <p className="text-[20px]">{connector.name}</p>
      </div>
      <div className="flex gap-3 bg-[#363D43]  rounded-[4px] h-[40px] w-[156px] items-center justify-center">
        <Image
          src="/logo-starknet.svg"
          alt="logo"
          width={23}
          height={23}
        ></Image>
        <span className="text-[20px]">Starknet</span>
      </div>
    </button>
  ) : null;
};

export default Wallet;
