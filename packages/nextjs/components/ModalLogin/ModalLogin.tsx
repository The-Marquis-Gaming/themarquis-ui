import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { Balance } from "../scaffold-stark";
import { useAccount } from "@starknet-react/core";
import { Address } from "@starknet-react/chains";
import useLogout from "~~/utils/api/hooks/useLogout";
import { useQueryClient } from "@tanstack/react-query";

interface AccountModalProps {
  onClose: () => void;
  position: { top: number; left: number };
}

const ModalLogin: React.FC<AccountModalProps> = ({ onClose, position }) => {
  const { address } = useAccount();

  const queryClient = useQueryClient();
  const userId = Number(queryClient.getQueryData(["userId"]));
  console.log(userId);

  const handleLogoutSuccess = (data: any) => {
    queryClient.getQueryData(["userId"]);
    queryClient.invalidateQueries({
      refetchType: "active",
    });
  };

  const handleLogoutFailed = (error: any) => {
    console.log("Logout failed", error);
  };

  const { mutate: logout } = useLogout(handleLogoutSuccess, handleLogoutFailed);

  const handleLogout = () => {
    logout({
      user_id: userId,
    });
  };

  return (
    <div
      className="fixed z-50"
      style={{
        top: position.top,
        left: position.left,
      }}
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
            <div className="flex items-center gap-12">
              <Image
                src="/marquis-point.svg"
                alt="Marquis point Icon"
                width={64}
                height={54}
              />
              <span>8000 Pts.</span>
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
            <div className="flex items-center gap-12">
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
            <div className="flex items-center gap-12">
              <Image src="/usdc.svg" alt="USDC Icon" width={24} height={24} />
              <Balance
                address={address as Address}
                className="min-h-0 h-auto"
              />
            </div>
          </div>
        </li>
        <li className="flex flex-col items-start mt-2">
          <button
            className="text-black flex  justify-between py-3 w-full rounded-none hover:bg-white"
            onClick={handleLogout}
          >
            <span>Logout</span>
            <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
          </button>
          <Link
            className="text-black flex justify-between py-3 w-full bg-[#00ECFF] rounded-none hover:bg-white"
            href="/login"
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
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ModalLogin;
