"use client";
import React, { useState } from "react";
import Image from "next/image";
import Modal from "../../components/Modal/Modal";
import Invitation from "~~/components/invitation";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";
import { makePrivateEmail } from "~~/utils/ConvertData";
import useScaffoldStrkBalance from "~~/hooks/scaffold-stark/useScaffoldStrkBalance";
import { notification } from "~~/utils/scaffold-stark/notification";

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data } = useGetUserInfo();
  const { formatted } = useScaffoldStrkBalance({
    address: data?.account_address,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

  return (
    <div className="px-7 pt-24 bg-[#0F151A] rounded-lg h-full flex justify-center flex-col max-w-[1700px] mx-auto w-full">
      <div className="text-white mb-4 text-lg font-semibold font-monserrat">
        {makePrivateEmail(data?.user?.email)}
      </div>
      <div className="flex flex-col border border-[#21262B] rounded-[10px]">
        <div className="bg-[#1E1E1E] p-4 mb-4 rounded-lg">
          <span className="text-white">Marquis Points</span>
        </div>
        <div className="flex justify-between p-3">
          <Image
            src="/marquis-point.svg"
            alt="icon"
            width={60}
            height={60}
            className="sm:h-[60px] sm:w-[60px] w-[30px] h-[30px]"
          />
          <div className="text-gray-400 pr-4 font-monserrat">
            {data?.user?.points} Pts.
          </div>
        </div>
      </div>

      <div className="my-8 rounded-[10px] border border-[#21262B]">
        <div className="flex justify-between items-center bg-[#1E1E1E] p-4">
          <span className="text-white">Account Balance</span>
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
        <div className="flex flex-col gap-4 px-4 my-4">
          <div className="flex items-center mb-2 justify-between">
            <Image
              src="/logo-starknet.svg"
              alt="STRK"
              width={26}
              height={26}
              className="w-6 h-6 mr-2"
            />
            <span className="text-gray-400 font-monserrat">
              {formatted} STRK
            </span>
          </div>
          <div className="flex items-center justify-between">
            <Image
              src="/usdc.svg"
              alt="USDC"
              width={20}
              height={20}
              className="w-6 h-6 mr-2"
            />
            {/* <span className="text-gray-400 font-monserrat">100.76 USDC</span> */}
            <span className="text-gray-400 font-monserrat">Coming Soon</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div
          className="flex gap-4 items-center text-[#00E0FF] cursor-pointer"
          onClick={openModal}
        >
          <Image
            src="/invitation-icon.svg"
            alt="icon"
            width={20}
            height={20}
          ></Image>
          <span className="text-gray">Invite Friend</span>
        </div>
        <div
          className="flex gap-4 items-center text-[#00E0FF] cursor-pointer"
          onClick={() => copyToClipboard(data?.referral_code ?? "")}
        >
          <Image src="/copy-icon.svg" alt="icon" width={20} height={20}></Image>
          <span className="text-gray">Copy Referral Code</span>
        </div>
        <div className="flex gap-4 items-center text-[#00E0FF] cursor-pointer">
          <Image src="/logout.svg" alt="icon" width={20} height={20}></Image>
          <span className="text-gray">Log Out</span>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div>
          <Invitation></Invitation>
        </div>
      </Modal>
    </div>
  );
};

export default Page;
