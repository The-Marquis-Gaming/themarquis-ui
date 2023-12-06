"use client";
import { useState } from "react";
import DegradeButton from "../DegradeButton/DegradeButton";
import Image from "next/image";
import { ModalWallet } from "../ModalWallet/ModalWallet";
import "./HeaderWallet.css";
import { useDojo } from "@/app/DojoContext";
import { useUSDmBalance } from "@/app/dojo/hooks";

const ButtonToggle = () => {
  const [openModal, setOpenModal] = useState(false);

  const {
    setup: {
      masterAccount,
      network: { graphQLClient },
    },
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
              className="flex gap-2 btn-conect-wallet text-white text-xs hover:text-gray-200 py-2 px-4 w-[76px] border border-solid border-[#5a5a5a] items-center"
              onClick={toggleModal}
            >
              <Image
                alt="icon"
                src="/images/starknet.png"
                width={22}
                height={22}
                style={{ width: "auto", height: "auto" }}
              />
              {accountBalance}
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
