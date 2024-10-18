import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CustomConnectButton } from "~~/components/scaffold-stark/CustomConnectButton";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";
import { useOutsideClick } from "~~/hooks/scaffold-stark";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import useLogout from "~~/utils/api/hooks/useLogout";
import GooglePlay from "@/public/landingpage/googlePlay.svg";
import Appstore from "@/public/landingpage/appStoreBlack.svg";
import MarquisWalletModal from "./Modal/MarquisWalletModal";
import InvitationModal from "./Modal/InvitationModal";
import useScaffoldStrkBalance from "~~/hooks/scaffold-stark/useScaffoldStrkBalance";
import useScaffoldEthBalance from "~~/hooks/scaffold-stark/useScaffoldEthBalance";
import { copyToClipboardAction } from "~~/utils/ToolActions";
import DesktopOnlyModal from "./Modal/DesktopOnlyModal";
import { notification } from "~~/utils/scaffold-stark";

export const Header = () => {
  const { data } = useGetUserInfo();
  const router = useRouter();
  const pathName = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDesktopOnlyOpen, setIsDesktopOnlyOpen] = useState(false);
  const [isMarquisOpen, setIsMarquisOpen] = useState(false);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [isMarquisMobileOpen, setIsMarquisMobileOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const strkBalanceWallet = useScaffoldStrkBalance({
    address: data?.account_address,
  });
  const ethBalanceWallet = useScaffoldEthBalance({
    address: data?.account_address,
  });

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const handleLogoutSuccess = () => {
    queryClient.setQueryData(["userEmail"], null);
    queryClient.removeQueries({ queryKey: ["userInfo"] });
    queryClient.invalidateQueries({
      refetchType: "active",
    });
    queryClient.setQueryData(["userInfo"], null);
    localStorage.removeItem("loginCountdown");
    localStorage.removeItem("signupCountdown");
    router.push("/");
    closeMenu();
    notification.success("Logout Success");
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
    setIsMarquisMobileOpen(false);
  };

  const renderImageApp = () => {
    const pathsToRender = ["/", "/privacy-policy", "/brandkit"];

    if (pathsToRender.includes(pathName)) {
      return (
        <div className="lg:flex hidden items-center gap-3">
          <Image
            src={Appstore}
            alt="download"
            height={100}
            width={165}
            className="max-h-[52px]"
          />
          <Image
            src={GooglePlay}
            alt="download"
            height={100}
            width={165}
            className="max-h-[52px]"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={`${pathName === "/invitation" ? "hidden" : "max-w-[1700px] mx-auto block w-full md:py-[32px] md:px-8 px-[20px] py-[12px]"} `}
    >
      <div className="flex items-center justify-between z-20 font-monserrat max-w-[1700px] mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/">
            <div className="relative w-full md:max-w-[277px] max-w-[122px]">
              <Image
                alt="logo"
                width={277}
                height={80}
                className="cursor-pointer"
                src="/logo-marquis.svg"
              />
            </div>
          </Link>
          {renderImageApp()}
        </div>

        <div className="flex items-center justify-end gap-[50px]">
          <div>
            <div className="lg:hidden dropdown" ref={burgerMenuRef}>
              <button
                tabIndex={0}
                className={`bg${
                  isDrawerOpen ? "hover:bg-black" : "hover:bg-black"
                }`}
                onClick={toggleMenu}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              {isDrawerOpen && (
                <div
                  className="fixed w-full inset-0 bg-black text-white p-[26px] flex flex-col justify-start items-end animate-menu-mobile"
                  style={{ zIndex: 100 }}
                >
                  <button className="cursor-pointer mb-5">
                    <Image
                      src={"/mobile/close-icon.svg"}
                      alt="icon"
                      width={20}
                      height={20}
                      className="cursor-pointer"
                      onClick={closeMenu}
                    />
                  </button>
                  <ul className="flex flex-col gap-[30px] w-full">
                    <li>
                      <div
                        className="flex gap-1 items-center py-3"
                        style={{
                          borderBottom: `${!isDownloadOpen ? "1px solid #666" : ""}`,
                        }}
                        onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                      >
                        <p className="text-[14px]">Download App</p>
                        <Image
                          src={"/mobile/dropdown-icon.svg"}
                          className={`${isDownloadOpen ? "rotate-180" : ""}`}
                          alt="icon"
                          width={20}
                          height={20}
                        />
                      </div>
                      {isDownloadOpen && (
                        <div className="flex flex-col gap-4">
                          <Image
                            src={"/mobile/appstore.svg"}
                            alt="download"
                            height={52}
                            width={1000}
                            className="max-h-[52px]"
                          />
                          <Image
                            src={"/mobile/googleplay.svg"}
                            alt="download"
                            height={52}
                            width={1000}
                            className="max-h-[52px]"
                          />
                        </div>
                      )}
                    </li>

                    <li style={{ borderBottom: "1px solid #666" }}>
                      {!data ? (
                        <div className="py-3">
                          <Link
                            href="/login"
                            className="text-[14px]"
                            onClick={closeMenu}
                          >
                            Login / Signup
                          </Link>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 py-3">
                              <div
                                className="flex items-center gap-1"
                                onClick={() => {
                                  setIsMarquisMobileOpen((prev) => !prev);
                                }}
                              >
                                <Image
                                  src="/marquis-icon.svg"
                                  alt="logo"
                                  width={16}
                                  height={16}
                                />
                                <p className="text-[14px]">Marquis Wallet</p>
                                <Image
                                  src={"/mobile/dropdown-icon.svg"}
                                  alt="icon"
                                  width={20}
                                  height={20}
                                  className={`${isMarquisMobileOpen ? "hidden" : ""}`}
                                />
                              </div>
                            </div>
                            {isMarquisMobileOpen && data && (
                              <div className="flex items-center gap-1">
                                <Image
                                  src="/marquis-point.svg"
                                  height={16}
                                  width={16}
                                  alt="icon"
                                />
                                <p className="text-[12px]">
                                  {data?.user?.points} Pts.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                    {isMarquisMobileOpen && (
                      <div>
                        <div>
                          <div className="text-[20px] font-semibold cursor-pointer">
                            <p className="text-center text-[16px]">
                              {data?.user?.email}
                            </p>
                          </div>
                          <div
                            onClick={() => {
                              setIsDesktopOnlyOpen(true);
                              closeMenu();
                            }}
                          >
                            <a className="mt-[26px] w-[118px] h-[30px] mx-auto cursor-pointer text-[14px] text-[#000] font-medium bg-[#00ECFF] rounded-[5px] flex justify-center items-center gap-[7px]">
                              <Image
                                src={"/withdraw-dropdown.svg"}
                                alt="icon"
                                width={14}
                                height={14}
                              />
                              <p>Withdraw</p>
                            </a>
                          </div>
                        </div>
                        <div>
                          <div className="text-white font-bold mt-[30px] text-[14px] flex items-center justify-center w-full h-[35px] bg-[#21262B] rounded-[5px]">
                            Balance
                          </div>
                          <div className="flex flex-col gap-3 mt-[20px]">
                            <div className="flex justify-between items-center">
                              <Image
                                src={"/logo-starknet.svg"}
                                alt="icon"
                                width={22}
                                height={22}
                              />
                              <p className="text-[14px] uppercase text-right">
                                {parseFloat(
                                  strkBalanceWallet.formatted,
                                ).toFixed(2)}{" "}
                                STRK
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <Image
                                src={"/logo-eth.svg"}
                                alt="icon"
                                width={22}
                                height={22}
                              />
                              <p className="text-[14px] uppercase text-right">
                                {parseFloat(ethBalanceWallet.formatted).toFixed(
                                  8,
                                )}{" "}
                                ETH
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <Image
                                src={"/usdc.svg"}
                                alt="icon"
                                width={22}
                                height={22}
                              />
                              <p className="text-[14px] uppercase text-right text-[#7A7A7A]">
                                0.00 USDC
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="mt-[30px] flex flex-col gap-4">
                            <div
                              onClick={() =>
                                copyToClipboardAction(data?.referral_code ?? "")
                              }
                              className="cursor-pointer py-[18px] px-3 rounded-[8px] bg-[#21262B] flex items-center gap-3"
                            >
                              <Image
                                src={"/copy-right.svg"}
                                alt="icon"
                                width={14}
                                height={14}
                              />
                              <p className="text-[14px]">Copy Referral Code</p>
                            </div>
                            <div
                              onClick={handleLogout}
                              className="cursor-pointer py-[18px] px-3 rounded-[8px] bg-[#21262B] flex items-center gap-3"
                            >
                              <Image
                                src={"/logout-icon.svg"}
                                alt="icon"
                                width={14}
                                height={14}
                              />
                              <p className="text-[14px]">Log out</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </ul>
                </div>
              )}
            </div>
            {data && data?.user?.email ? (
              <div className="relative">
                <MarquisWalletModal
                  isOpen={isMarquisOpen}
                  onClose={() => setIsMarquisOpen(false)}
                  isInvitationOpen={isInvitationOpen}
                  setIsInvitationOpen={setIsInvitationOpen}
                />
                <div
                  className="hidden lg:flex ml-4 header-btn gap-3 h-[50px]"
                  onClick={() => setIsMarquisOpen(true)}
                >
                  <Image
                    src="/marquis-icon.svg"
                    alt="logo"
                    width={22}
                    height={22}
                  />
                  <p className="login-text">Marquis Wallet</p>
                </div>
              </div>
            ) : (
              <div
                className="hidden lg:flex ml-4 header-btn gap-3 h-[50px]"
                onClick={() => router.push("/login")}
              >
                <Image
                  src="/marquis-icon.svg"
                  alt="logo"
                  width={22}
                  height={22}
                />
                <p className="login-text">Login/Signup</p>
              </div>
            )}
          </div>
          <div className="lg:block hidden relative">
            <CustomConnectButton />
          </div>
        </div>
      </div>
      <InvitationModal
        isOpen={isInvitationOpen}
        onClose={() => setIsInvitationOpen(false)}
      />
      <DesktopOnlyModal
        isOpen={isDesktopOnlyOpen}
        onClose={() => setIsDesktopOnlyOpen(false)}
      />
    </div>
  );
};
