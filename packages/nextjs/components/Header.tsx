"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "~~/hooks/scaffold-stark";
import { CustomConnectButton } from "~~/components/scaffold-stark/CustomConnectButton";
import { FaucetButton } from "~~/components/scaffold-stark/FaucetButton";
import { useTheme } from "next-themes";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";
import { devnet } from "@starknet-react/chains";
import { SwitchTheme } from "./SwitchTheme";
import { useAccount, useProvider } from "@starknet-react/core";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);
  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive
                  ? "!bg-gradient-nav !text-white active:bg-gradient-nav shadow-md "
                  : ""
              } py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col hover:bg-gradient-nav hover:text-white`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === devnet.id;

  const { provider } = useProvider();
  const { address, status } = useAccount();
  const [isDeployed, setIsDeployed] = useState(false);

  useEffect(() => {
    if (status === "connected" && address) {
      provider
        .getContractVersion(address)
        .then((v) => {
          if (v) setIsDeployed(true);
        })
        .catch((e) => {
          console.log(e);
          setIsDeployed(false);
        });
    }
  }, [status, address, provider]);

  return (
    <div className="absolute top-0 w-full lg:static min-h-0 flex-shrink-0 flex justify-between z-20 px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2 justify-between">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${
              isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"
            }`}
            onClick={() => {
              setIsDrawerOpen((prevIsOpenState) => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              {/* <HeaderMenuLinks /> */}
            </ul>
          )}
        </div>
        <Link
          href="/"
          passHref
          className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0"
        >
          <div className="flex relative w-60 h-20">
            <Image
              alt="logo"
              className="cursor-pointer"
              fill
              src="/logo-marquis.svg"
            />
          </div>
        </Link>
      </div>
      <div className="relative">
        <Image
          alt="logo hex"
          className=""
          width={372}
          height={80}
          src="/logo-hex.svg"
        ></Image>
      </div>
      <div className="flex navbar-end flex-grow mr-4 gap-4 items-center">
        <Link href="/signup">LOGIN / SIGN UP</Link>
        <CustomConnectButton />
      </div>
    </div>
  );
};
