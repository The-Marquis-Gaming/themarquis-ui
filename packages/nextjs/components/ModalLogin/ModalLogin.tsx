import React, { useEffect, useRef } from "react";
import Image from "next/image";
import useLogout from "~~/utils/api/hooks/useLogout";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";
import useScaffoldStrkBalance from "~~/hooks/scaffold-stark/useScaffoldStrkBalance";
import { notification } from "~~/utils/scaffold-stark/notification";
import Link from "next/link";
import useScaffoldEthBalance from "~~/hooks/scaffold-stark/useScaffoldEthBalance";

interface AccountModalProps {
  onClose: () => void;
  position: { top: number; left: number };
}

const ModalLogin: React.FC<AccountModalProps> = ({ onClose, position }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useGetUserInfo();

  const { formatted: strk } = useScaffoldStrkBalance({
    address: data?.account_address,
  });
  const { formatted: eth } = useScaffoldEthBalance({
    address: data?.account_address,
  });

  const handleLogoutSuccess = () => {
    queryClient.setQueryData(["userEmail"], null);
    queryClient.removeQueries({ queryKey: ["userInfo"] });
    queryClient.invalidateQueries({
      refetchType: "active",
    });
    queryClient.setQueryData(["userInfo"], null);
    localStorage.removeItem("loginCountdown");
    localStorage.removeItem("signupCountdown");
    onClose();
    router.push("/");
  };

  const handleLogoutFailed = (error: any) => {
    console.log("Logout failed", error);
  };

  const { mutate: logout } = useLogout(handleLogoutSuccess, handleLogoutFailed);

  const handleLogout = () => {
    logout();
  };
  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text).then(
        () => {
          notification.success("Coppied successfully");
        },
        (err) => {
          console.error("Failed to copy: ", err);
        },
      );
    } else {
      return;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className="absolute"
      style={{
        top: position.top,
        left: position.left,
        zIndex: 100,
      }}
      ref={modalRef}
    >
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-none p-0 pt-2 mt-2 gap-1 bg-modal-wallet w-[250px]"
      >
        <li className="flex flex-col items-start gap-2">
          <div className="flex items-center justify-between w-full">
            <span>Marquis</span>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center justify-between w-full">
              <Image
                src="/marquis-point.svg"
                alt="Marquis point Icon"
                width={44}
                height={44}
                className="w-[30px] h-[30px]"
              />
              <span>{data && `${data?.user?.points} Pts.`}</span>
            </div>
          </div>
        </li>
        <li className="flex flex-col items-start gap-2">
          <div className="flex items-center justify-between w-full py-0">
            <span>Marquis Balance</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="7"
              viewBox="0 0 13 7"
              fill="none"
            >
              <path
                d="M7.18314 6.31686L11.7929 1.70711C12.4229 1.07714 11.9767 0 11.0858 0H1.53702C0.629399 0 0.191179 1.11177 0.8547 1.73105L5.79372 6.3408C6.18766 6.70849 6.8021 6.6979 7.18314 6.31686Z"
                fill="#00ECFF"
              />
            </svg>
          </div>
          <div className="flex items-center justify-between w-full py-0">
            <div className="w-full flex items-center justify-between">
              <Image
                src="/logo-starknet.svg"
                alt="STRK Icon"
                width={24}
                height={24}
              />
              <p>{parseFloat(strk).toFixed(2)} STRK</p>
            </div>
          </div>
          <div className="flex items-center justify-between w-full py-0">
            <div className="w-full flex items-center justify-between">
              <Image
                src="/logo-eth.svg"
                alt="STRK Icon"
                width={24}
                height={24}
              />
              <p>{parseFloat(eth).toFixed(8)} ETH</p>
            </div>
          </div>
          {/* <div className="flex items-center justify-between w-full">
            <div className="w-full flex items-center justify-between">
              <Image src="/usdc.svg" alt="USDC Icon" width={24} height={24} />
              <Balance
                address={address as Address}
                className="min-h-0 h-auto"
              />
              <p className="m-0">Coming Soon</p>
            </div>
          </div> */}
        </li>
        <li className="flex flex-col items-start mt-2">
          <span>Actions</span>
          <Link
            href={"/withdrawal"}
            className="flex w-full font-normal"
            onClick={onClose}
          >
            <div className="w-[25px]">
              <Image
                src={"/withdraw-icon.svg"}
                width={14}
                height={14}
                alt="icon"
              />
            </div>
            <span>Withdraw</span>
          </Link>
          <div className="text-white font-normal flex py-3 w-full ">
            <div className="w-[25px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
                />
              </svg>
            </div>
            <span onClick={() => copyToClipboard(data?.referral_code ?? "")}>
              Copy Referral Code
            </span>
          </div>
          <button
            className="text-black flex justify-center font-semibold py-3 w-full rounded-none bg-[#00ECFF] hover:bg-white"
            onClick={handleLogout}
          >
            <span>Log Out</span>
            <Image src={"/logout-icon.svg"} width={15} height={15} alt="icon" />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ModalLogin;
