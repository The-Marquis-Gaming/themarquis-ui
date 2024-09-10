import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { Balance } from "../scaffold-stark";
import { useAccount } from "@starknet-react/core";
import { Address } from "@starknet-react/chains";
import useLogout from "~~/utils/api/hooks/useLogout";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";

interface AccountModalProps {
  onClose: () => void;
  position: { top: number; left: number };
}

const ModalLogin: React.FC<AccountModalProps> = ({ onClose, position }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { address } = useAccount();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useGetUserInfo();

  const handleLogoutSuccess = () => {
    queryClient.setQueryData(["userEmail"], null);
    queryClient.removeQueries({ queryKey: ["userInfo"] });
    queryClient.invalidateQueries({
      refetchType: "active",
    });
    queryClient.setQueryData(["userInfo"], null);
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
      className="fixed z-50"
      style={{
        top: position.top,
        left: position.left,
      }}
      ref={modalRef}
    >
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-none z-[2] p-0 pt-2 mt-2 gap-1 bg-modal-wallet w-[250px]"
      >
        <li className="flex flex-col items-start gap-2">
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold">Marquis</span>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center justify-between w-full">
              <Image
                src="/marquis-point.svg"
                alt="Marquis point Icon"
                width={64}
                height={54}
              />
              <span>{data && `${data?.user?.points} Pts.`}</span>
            </div>
          </div>
        </li>
        <li className="flex flex-col items-start gap-2">
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold">Account Balance</span>
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
          <div className="flex items-center justify-between w-full">
            <div className="w-full flex items-center justify-between">
              <Image
                src="/logo-starknet.svg"
                alt="STRK Icon"
                width={24}
                height={24}
              />
              <Balance
                address={address as Address}
                className="min-h-0 h-auto"
              />
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="w-full flex items-center justify-between">
              <Image src="/usdc.svg" alt="USDC Icon" width={24} height={24} />
              {/* <Balance
                address={address as Address}
                className="min-h-0 h-auto"
              /> */}
              <p className="text-xs m-0">Coming soon</p>
            </div>
          </div>
        </li>
        <li className="flex flex-col items-start mt-2">
          <button
            className="text-black flex justify-between py-3 w-full rounded-none"
            onClick={handleLogout}
          >
            <span>Logout</span>
            <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
          </button>
          <div
            className="text-black flex justify-between py-3 w-full bg-[#00ECFF] rounded-none hover:bg-white"
            // href="/login"
          >
            <span>Copy Referral Code</span>
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
        </li>
      </ul>
    </div>
  );
};

export default ModalLogin;
