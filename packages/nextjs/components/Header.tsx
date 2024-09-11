import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CustomConnectButton } from "~~/components/scaffold-stark/CustomConnectButton";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";
import ModalLogin from "~~/components/ModalLogin/ModalLogin";
import { makePrivateEmail } from "~~/utils/convertData";
import { useOutsideClick } from "~~/hooks/scaffold-stark";

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLSpanElement>(null);

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), [])
  );

  const { data } = useGetUserInfo();

  const toggleMenu = () => {
    setIsDrawerOpen((prevIsOpenState) => !prevIsOpenState);
  };

  const closeMenu = () => {
    setIsDrawerOpen(false);
  };

  const toggleModal = () => {
    if (emailRef.current) {
      const rect = emailRef.current.getBoundingClientRect();
      setModalPosition({ top: rect.bottom, left: rect.left });
    }
    setModalOpen(!modalOpen);
  };

  return (
    <div className="w-full bg-header py-5 xs:px-12 xs:px-12">
      <div className="flex items-center justify-center z-20 font-monserrat max-w-[1700px] mx-auto md:px-0 px-3">
        <div className="hidden lg:block flex-none">
          <Link href="/">
            <div className="relative w-80 h-20">
              <Image
                alt="logo"
                className="cursor-pointer"
                fill
                src="/logo-marquis.svg"
              />
            </div>
          </Link>
        </div>
        <div className="mx-auto flex justify-center">
          <Image
            className="xs:max-w-[372px] max-w-[200px]"
            alt="logo hex"
            width={372}
            height={80}
            src="/logo-hex.svg"
          />
        </div>
        <div className="flex items-center justify-end gap-10">
          <div className="lg:hidden dropdown" ref={burgerMenuRef}>
            <button
              tabIndex={0}
              className={`absolute right-0 top-[-25px] btn p-0 btn-ghost bg${
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
                    {!data ? (
                      <div>
                        <Image
                          src="/login-icon.svg"
                          alt="login-icon"
                          width={20}
                          height={20}
                        ></Image>
                        <Link href="/signup" onClick={closeMenu}>
                          Login / Sign up
                        </Link>
                      </div>
                    ) : (
                      <div>
                        <button className="text-white flex items-center gap-4 py-3 w-full rounded-none">
                          <ArrowLeftEndOnRectangleIcon
                            className="h-5 w-5"
                            color="#00ECFF"
                          />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>
          {data && data?.user?.email ? (
            <>
              <span
                ref={emailRef}
                className="hidden lg:block text-[16px] uppercase cursor-pointer"
                onClick={toggleModal}
              >
                {makePrivateEmail(data?.user?.email)}
              </span>
              {modalOpen && modalPosition && (
                <ModalLogin
                  onClose={() => setModalOpen(false)}
                  position={modalPosition}
                />
              )}
            </>
          ) : (
            <Link href="/signup" className="hidden lg:block ml-4">
              LOGIN / SIGN UP
            </Link>
          )}
          <CustomConnectButton />
        </div>
      </div>
    </div>
  );
};
