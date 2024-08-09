"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useOutsideClick } from "~~/hooks/scaffold-stark";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { CustomConnectButton } from "~~/components/scaffold-stark/CustomConnectButton";
import { useAccount, useProvider } from "@starknet-react/core";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";
import { devnet } from "@starknet-react/chains";

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
    <div className="absolute top-0 w-full lg:static min-h-0 flex-shrink-0 flex justify-between items-center z-20 px-4 sm:px-6">
      <div className="hidden lg:block flex-none">
        <Link href="/" passHref>
          <div className="relative w-60 h-20">
            <Image
              alt="logo"
              className="cursor-pointer"
              fill
              src="/logo-marquis.svg"
            />
          </div>
        </Link>
      </div>

      <div className="flex-grow flex justify-center">
        <Image
          alt="logo hex"
          width={372}
          height={80}
          src="/logo-hex.svg"
        />
      </div>
      <div className="flex-none lg:flex items-center gap-4">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`btn btn-ghost ${
              isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"
            }`}
            onClick={() => {
              setIsDrawerOpen((prevIsOpenState) => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-6 w-6" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="absolute right-0 dropdown-content mt-3 shadow rounded-box w-52 bg-black p-6"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <li className="flex gap-4">
                <Image src="/login-icon.svg" alt="login-icon" width={20} height={20}></Image>
                <Link href="/signup">LOGIN / SIGN UP</Link>
              </li>
            </ul>
          )}
        </div>
        <Link href="/signup" className="hidden lg:block ml-4">
          LOGIN / SIGN UP
        </Link>
        <CustomConnectButton/>
      </div>
    </div>
  );
};
