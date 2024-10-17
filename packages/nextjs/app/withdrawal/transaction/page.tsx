"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { makeStringPrivate } from "~~/utils/ConvertData";
import { notification } from "~~/utils/scaffold-stark/notification";
import { useConnect, useWaitForTransaction } from "@starknet-react/core";

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const { connector } = useConnect();
  const { data: transactionInfor } = useWaitForTransaction({
    hash: searchParams.get("transaction_hash") || "",
  });

  const getStatusStyle = () => {
    switch (transactionInfor?.statusReceipt) {
      case "success":
        return "bg-[#00ECFF]";
      case "error":
        return "bg-red-600";
      case "rejected":
        return "bg-red-600";
      case "reverted":
        return "bg-red-600";
      default:
        return "";
    }
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

  const handleClickHash = () => {
    copyToClipboard(searchParams.get("transaction_hash")?.toString() ?? "");
    window.open(
      `${process.env.NEXT_PUBLIC_SEPOLIA_STARKNET_SCAN_URL}${searchParams.get("transaction_hash")}`,
      "_blank",
    );
  };

  if (!transactionInfor)
    return (
      <div className="flex justify-center items-center h-screen-minus-80 w-full">
        loading...
      </div>
    );

  return (
    <div className="flex flex-col justify-center items-center mt-[100px] text-white font-monserrat">
      <div className="p-8 w-full max-w-[850px]">
        <h1 className="text-2xl font-bold text-center mb-10 font-valorant uppercase">
          Transaction{" "}
          {transactionInfor?.statusReceipt === "success"
            ? "Completed"
            : "Error"}
        </h1>

        <div className="flex justify-center mb-12">
          <div className="flex justify-between w-full px-[30px] py-[26px] bg-[#21262B] rounded-[10px]">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${getStatusStyle()}`}
              ></div>
              <span className="text-[20px]">Withdraw</span>
            </div>
            <div className="text-white text-[20px]">
              {transactionInfor?.statusReceipt === "success"
                ? "Completed"
                : "Error"}
            </div>
          </div>
        </div>

        <div className="mb-10 w-full">
          <div className="flex justify-between items-center py-3">
            <span className="text-[20px] text-white">Transaction Hash</span>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleClickHash}
            >
              <span className="text-[#00ECFF] cursor-pointer text-[20px]">
                {makeStringPrivate(
                  searchParams.get("transaction_hash")?.toString() ??
                    "Undefined",
                )}
              </span>
              <Image
                className="cursor-pointer"
                src="/icon-clip.svg"
                alt="link"
                width={16}
                height={16}
              />
            </div>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-[20px] text-white">Receiver</span>
            {transactionInfor?.statusReceipt === "success" ? (
              <div className="flex items-center gap-2">
                {connector?.icon.light && (
                  <Image
                    src={connector?.icon.light!}
                    width={24}
                    height={24}
                    alt="icon"
                  />
                )}
                <span className="text-white text-[20px]">
                  {makeStringPrivate(
                    searchParams.get("receiver")?.toString() ?? "",
                  )}
                </span>
              </div>
            ) : (
              <div>-</div>
            )}
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-[20px] text-white">Amount</span>
            {transactionInfor?.statusReceipt === "success" ? (
              <div className="flex items-center gap-2">
                <Image
                  src={
                    searchParams.get("token")?.toString() === "Strk"
                      ? "/logo-starknet.svg"
                      : "/logo-eth.svg"
                  }
                  alt="icon"
                  width={24}
                  height={24}
                />
                <span className="text-[20px]">
                  {parseFloat(searchParams.get("amount") || "0").toFixed(
                    searchParams.get("token")?.toString() === "Strk" ? 4 : 8,
                  )}{" "}
                  {searchParams.get("token")?.toString() === "Strk"
                    ? "STRK"
                    : "ETH"}
                </span>
              </div>
            ) : (
              <div>-</div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/" passHref className="button-action">
            <button className="px-10 py-3 mt-4 shadow-button w-full text-white rounded-full font-arcade text-shadow-deposit text-2xl">
              BACK TO APP
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
