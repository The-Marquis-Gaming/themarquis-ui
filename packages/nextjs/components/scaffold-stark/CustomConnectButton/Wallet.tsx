import React, { useState } from "react";
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
  const isSvg = connector.icon.light?.startsWith("<svg");
  const [clicked, setClicked] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <button
      className={`flex gap-4 items-center text-neutral px-4 rounded-[4px] transition-all cursor-pointer bg-[#21262B] ${isDarkMode ? "" :" hover:border-none"} pl-3 ${clicked ? "bg-ligth" : ""}`}
      onClick={(e) => {
        setClicked(true);
        handleConnectWallet(e, connector);
      }}
    >
      <div className="h-[2.2rem] w-[2.2rem] rounded-[5px]">
        {isSvg ? (
          <div
            className="h-full w-full object-cover rounded-[5px]"
            dangerouslySetInnerHTML={{
              __html: connector.icon.light ?? "",
            }}
          />
        ) : (
          <Image
            alt={connector.name}
            loader={loader}
            src={connector.icon.light!}
            width={70}
            height={70}
            className="h-full w-full object-cover rounded-[5px]"
          />
        )}
      </div>
      <p className="flex-1 text-start">{connector.name}</p>
      <div className="flex gap-2 bg-[#363D43] p-2 rounded-[4px]">
        <Image src="/logo-starknet.svg" alt="logo" width={23} height={23}></Image>
        <span className="text-sm font-extralight">Starknet</span>
      </div>
    </button>
  );
};

export default Wallet;
