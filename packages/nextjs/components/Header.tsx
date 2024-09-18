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
import { makePrivateEmail } from "~~/utils/ConvertData";
import { useOutsideClick } from "~~/hooks/scaffold-stark";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import useLogout from "~~/utils/api/hooks/useLogout";
import GooglePlay from "@/public/landingpage/googlePlay.svg";
import Appstore from "@/public/landingpage/appStoreBlack.svg";

export const Header = () => {
  const router = useRouter();
  const pathName = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLSpanElement>(null);
  const queryClient = useQueryClient();

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const { data } = useGetUserInfo();

  const handleLogoutSuccess = () => {
    queryClient.setQueryData(["userEmail"], null);
    queryClient.removeQueries({ queryKey: ["userInfo"] });
    queryClient.invalidateQueries({
      refetchType: "active",
    });
    queryClient.setQueryData(["userInfo"], null);
    router.push("/");
    closeMenu();
  };

  const handleLogoutFailed = (error: any) => {
    console.log("Logout failed", error);
  };

  const { mutate: logout } = useLogout(handleLogoutSuccess, handleLogoutFailed);

  const handleLogout = () => {
    logout();
  };

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
    <div className="w-full py-5 px-2">
      <div className="flex items-center justify-between z-20 font-monserrat max-w-[1700px] mx-auto md:px-0 px-3">
        <div className="hidden lg:block flex-none">
          <Link href="/">
            <div className="relative w-full max-w-[277px]">
              <Image
                alt="logo"
                width={277}
                height={80}
                className="cursor-pointer"
                src="/logo-marquis.svg"
              />
            </div>
          </Link>
        </div>
        {pathName === "/" && (
          <div className="flex items-center gap-3">
            <Image src={Appstore} alt="download" height={50} width={150} />
            <Image src={GooglePlay} alt="download" height={50} width={150} />
          </div>
        )}
        <div className="flex items-center justify-end gap-10">
          {pathName === "/" && (
            <div>
              <p className="font-medium text-xl text-white cursor-pointer">
                Explore Games
              </p>
            </div>
          )}
          <div>
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
                <div
                  className="fixed inset-0 bg-black text-white p-6 flex flex-col justify-start items-end"
                  style={{ zIndex: 100 }}
                >
                  <button
                    onClick={closeMenu}
                    className="h-8 w-8 cursor-pointer mb-4 hover:bg-black"
                  >
                    <XMarkIcon
                      className="h-8 w-8 cursor-pointer mb-4 hover:bg-black circle-icon"
                      onClick={closeMenu}
                    />
                  </button>
                  <ul className="flex flex-col gap-6 w-full">
                    {data && (
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
                    )}
                    <li className="flex gap-4 ">
                      {!data ? (
                        <div className="flex items-center gap-4">
                          <Image
                            src="/login-icon.svg"
                            alt="login-icon"
                            width={20}
                            height={20}
                          ></Image>
                          <Link
                            href="/login"
                            className="normal-case text-xl font-medium"
                            onClick={closeMenu}
                          >
                            Login
                          </Link>
                        </div>
                      ) : (
                        <div>
                          <button
                            onClick={handleLogout}
                            className="text-white flex items-center gap-4 py-3 w-full rounded-none"
                          >
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
              <Link
                href="/login"
                className="hidden normal-case lg:block ml-4 text-xl font-medium"
              >
                Login
              </Link>
            )}
          </div>
          <CustomConnectButton />
        </div>
      </div>
    </div>
  );
};
