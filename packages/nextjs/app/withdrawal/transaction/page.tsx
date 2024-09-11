"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { makeStringPrivate } from "~~/utils/convertData";

const Page: React.FC = () => {
  const [depositStatus, setDepositStatus] = useState<
    "waiting" | "done" | "error"
  >("done");

  const searchParams = useSearchParams();

  const getStatusStyle = () => {
    switch (depositStatus) {
      case "waiting":
        return "border-2 border-[#00ECFF] bg-transparent";
      case "done":
        return "bg-[#00ECFF]";
      case "error":
        return "bg-red-600";
      default:
        return "";
    }
  };

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text).then(
        () => {
          window.alert("Coppied success");
        },
        (err) => {
          console.error("Failed to copy: ", err);
        }
      );
    } else {
      return;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen-minus-80 text-white font-monserrat">
      <div className="p-8 w-full max-w-[850px]">
        <h1 className="text-2xl font-bold text-center mb-10 font-valorant">
          TRANSACTION PROCESSING
        </h1>

        <div className="flex justify-center mb-16">
          <div className="flex justify-between w-full p-4 bg-gray-800 rounded-md">
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-2 ${getStatusStyle()}`}
              ></div>
              <span>Withdraw</span>
            </div>
            <div className="text-white">
              {depositStatus.charAt(0).toUpperCase() + depositStatus.slice(1)}
            </div>
          </div>
        </div>

        <div className="mb-10 w-full">
          <div className="flex justify-between items-center py-4">
            <span className="text-gray-400">Transaction Hash</span>
            <div className="flex items-center gap-2">
              <span className="text-[#00ECFF]">
                {makeStringPrivate(
                  searchParams.get("transaction_hash")?.toString() ??
                    "Undefined"
                )}
              </span>
              <Image
                className="cursor-pointer"
                onClick={() =>
                  copyToClipboard(searchParams.get("transaction_hash") ?? "")
                }
                src="/icon-clip.svg"
                alt="link"
                width={16}
                height={16}
              />
            </div>
          </div>
          <div className="flex justify-between items-center py-4">
            <span className="text-gray-400">Receiver</span>
            <div className="flex items-center gap-2">
              <span className="bg-[#00ECFF] text-black px-4 py-1 rounded-full">
                Marquis
              </span>
              <span className="text-white">
                {makeStringPrivate(
                  searchParams.get("receiver")?.toString() ?? ""
                )}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center py-4">
            <span className="text-gray-400">Amount</span>
            <div className="flex items-center gap-2">
              <Image
                src="/logo-starknet.svg"
                alt="STRK"
                width={18}
                height={18}
              />
              <span>{searchParams.get("amount")} STRK</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/" passHref>
            <button className="px-10 py-3 mt-4 shadow-button text-white rounded-full font-arcade text-shadow-deposit text-2xl">
              BACK TO APP
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
