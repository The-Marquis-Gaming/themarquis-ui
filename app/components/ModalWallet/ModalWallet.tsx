import React from "react";
import { useState } from "react";
import Image from "next/image";
import "./ModalWallet.css";
import { useDojo } from "@/app/DojoContext";
import DegradeButton from "../DegradeButton/DegradeButton";
import { Account } from "starknet";

type ModalProps = {
  onClose: () => void;
  account: Account;
};

export const ModalWallet: React.FC<ModalProps> = ({ onClose, account }) => {
  const {
    setup: {
      systemCalls: { useSelfMint },
    },
  } = useDojo();
  const { mint, loading: mintLoading } = useSelfMint(account);

  const [primaryWalletBtn, setPrimaryWalletBtn] = useState("#293037");
  const [secondaryWalletButton, setSecondaryWalletButton] =
    useState("transparent");

  const primaryColorChanger = () => {
    setPrimaryWalletBtn("#293037");
    setSecondaryWalletButton("#1A1E23");
  };

  const SecondaryColorChanger = () => {
    setPrimaryWalletBtn("#1A1E23");
    setSecondaryWalletButton("#293037");
  };

  return (
    <div className=" w-[456px] h-[680px] modal-container">
      <div className="flex justify-between bg-black p-4">
        <h3 className="text-2xl">Your Marquis Wallet</h3>
        <div className="box-iconclose" onClick={onClose}>
          <Image
            alt="icon"
            src="/images/close.png"
            width={32}
            height={32}
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      </div>
      <div className=" flex flex-col gap-2 px-7 py-8">
        <span className="text-[#718096] text-base pt-2">Balance</span>
        <span className="text-4xl font-bold my-2">32 STRK</span>
        <div className=" flex justify-center bg-[#1A1E23] p-2 border border-solid border-[#39424C] rounded-2xl ">
          <button
            className=" w-[200px] px-6 py-2 text-base rounded-2xl "
            style={{ backgroundColor: primaryWalletBtn }}
            onClick={primaryColorChanger}
          >
            Deposit
          </button>
          <button
            className=" w-[200px] px-6 py-2 text-base rounded-2xl"
            style={{ backgroundColor: secondaryWalletButton }}
            onClick={SecondaryColorChanger}
          >
            Withdraw
          </button>
        </div>
        <div className="flex justify-center gap-8 my-4">
          <div className=" flex flex-col gap-2">
            <span>From</span>
            <p className="text-4xl font-bold ">0</p>
            <span>Balance: 70.42</span>
          </div>
          <div className="flex justify-center items-center">
            <Image
              alt="icon"
              src="/images/image-eth.png"
              width={40}
              height={40}
              style={{ width: "auto", height: "auto" }}
            />
            <span className="text-lg">ETH</span>
            <div className="cursor-pointer">
              <Image
                alt="icon-arrow-down"
                src="/images/arrow_down.png"
                width={20}
                height={20}
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </div>
        </div>
        <div className="border-t-2 border-[#7901D6] m-4 separator">
          <Image
            alt="buton"
            src="/images/btn.png"
            width={24}
            height={24}
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <div className="flex justify-center gap-8 m-5">
          <div className=" flex flex-col gap-2">
            <span>To</span>
            <p className="text-4xl font-bold ">0</p>
            <span>Balance:-</span>
          </div>
          <div className="flex justify-center items-center gap-2">
            <Image
              alt="icon"
              src="/images/starknet.png"
              width={30}
              height={30}
              style={{ width: "auto", height: "auto" }}
            />
            <span className="text-lg">Starknet</span>
          </div>
        </div>
        {!mintLoading ? (
          <DegradeButton onClick={() => mint()}>SELF MINT</DegradeButton>
        ) : (
          <DegradeButton>LOADING...</DegradeButton>
        )}
      </div>
    </div>
  );
};
