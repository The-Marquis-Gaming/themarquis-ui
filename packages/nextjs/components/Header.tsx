"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useOutsideClick } from "~~/hooks/scaffold-stark";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
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

  const toggleMenu = () => {
    setIsDrawerOpen((prevIsOpenState) => !prevIsOpenState);
  };

  const closeMenu = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="absolute top-0 w-full lg:static min-h-0 flex-shrink-0 flex justify-between items-center z-20 px-4 sm:px-6 font-monserrat">
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
        <Image alt="logo hex" width={372} height={80} src="/logo-hex.svg" />
      </div>
      <div className="flex-none lg:flex items-center gap-4">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <button
            tabIndex={0}
            className={`btn btn-ghost bg${
              isDrawerOpen ? "hover:bg-black" : "hover:bg-black"
            }`}
            onClick={toggleMenu}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          {isDrawerOpen && (
            <div className="fixed inset-0 bg-black text-white p-6 flex flex-col justify-start items-end z-50">
              <button
                onClick={closeMenu}
                className="h-8 w-8 cursor-pointer mb-4 hover:bg-black"
              >
                <XMarkIcon
                  className="h-8 w-8 cursor-pointer mb-4 hover:bg-black"
                  onClick={closeMenu}
                />
              </button>
              <ul className="flex flex-col gap-6 w-full">
                <li className="flex gap-4 mb-4">
                  <Image
                    src="/profile-icon.svg"
                    alt="login-icon"
                    width={20}
                    height={20}
                  ></Image>
                  <Link href="/profile" onClick={closeMenu}>
                    Profile
                  </Link>
                </li>
                <li className="flex gap-4">
                  <Image
                    src="/login-icon.svg"
                    alt="login-icon"
                    width={20}
                    height={20}
                  ></Image>
                  <Link href="/signup" onClick={closeMenu}>
                    Login / Sign up
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
        <Link href="/signup" className="hidden lg:block ml-4">
          LOGIN / SIGN UP
        </Link>
        <CustomConnectButton />
      </div>
    </div>
  );
};
