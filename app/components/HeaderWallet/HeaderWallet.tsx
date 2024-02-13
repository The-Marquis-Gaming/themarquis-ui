"use client";
import { useState } from "react";
import DegradeButton from "../DegradeButton/DegradeButton";
import Image from "next/image";
import { ModalWallet } from "../ModalWallet/ModalWallet";
import "./HeaderWallet.css";
import { useDojo } from "@/app/dojo/useDojo";
import { useUSDmBalance } from "@/app/dojo/hooks";

const ButtonToggle = () => {
  const [openModal, setOpenModal] = useState(false);

  const {
    setup: { masterAccount, graphQLClient },
    account: { create, account, isDeploying },
  } = useDojo();

  const { accountBalance } = useUSDmBalance(account);

  const createWallet = () => {
    create();
  };

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const masterAddress = process.env.NEXT_PUBLIC_MASTER_ADDRESS as string;
  const formatNumberAccount = (number: number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else {
      return (number / 1000).toFixed(1) + "k";
    }
  };

  return (
    <div>
      {account && masterAddress == account.address && !isDeploying ? (
        <div onClick={createWallet}>
          <DegradeButton>Conect Wallet</DegradeButton>
        </div>
      ) : (
        <div className="flex gap-4">
          {!isDeploying && (
            <button
              className="flex gap-2 btn-conect-wallet text-white text-xs hover:text-gray-200 py-2 px-4 min-w-[76px] max-w-[130px] border border-solid border-[#5a5a5a] items-center"
              onClick={toggleModal}
            >
              <Image
                alt="icon"
                src="/images/starknet.png"
                width={22}
                height={22}
                style={{ width: "auto", height: "auto" }}
              />
              {formatNumberAccount(accountBalance)}
            </button>
          )}
          <div className="border border-solid border-white flex gap-2 px-3 py-2 rounded-3xl text-xs items-center w-[130px]">
            {isDeploying ? (
              <>
                <Image
                  alt="icon"
                  src="/images/loader.png"
                  width={22}
                  height={22}
                  style={{ width: "auto", height: "auto" }}
                />
                <span>Loading ...</span>
              </>
            ) : (
              <>
                <Image
                  alt="icon"
                  src="/images/balance-wallet.png"
                  width={22}
                  height={22}
                  style={{ width: "auto", height: "auto" }}
                />
                <span>
                  {account.address.slice(0, 6) +
                    "..." +
                    account.address.slice(-2)}
                </span>
              </>
            )}
          </div>
        </div>
      )}
      <div className={`modal ${openModal ? "open" : ""}`}>
        <ModalWallet onClose={closeModal} account={account} />
      </div>
    </div>
  );
};

export default ButtonToggle;
