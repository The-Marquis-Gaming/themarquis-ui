"use client";
import { useState } from "react";
import DegradeButton from "../DegradeButton/DegradeButton";
import Image from "next/image";
import { ModalWallet } from "../ModalWallet/ModalWallet";
import "./HeaderWallet.css";
import { useDojo } from "@/app/DojoContext";

const ButtonToggle = () => {
  const [showButton, setShowButton] = useState(true);
  const [showElements, setShowElements] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  const {
    setup: {
      systemCalls: { bet },
      components,
      entityUpdates,
      network: { contractComponents, graphClient },
    },
    account: { create, list, select, account, isDeploying, clear },
  } = useDojo();

  const toggleElements = () => {
    setShowButton(false);
    setShowElements(!showElements);
    create()
  };

  const toggleModal = () => {
    setModalAbierto(!modalAbierto);
  };

  const closeModal = () => {
    setModalAbierto(false);
  };

  console.log(account)
  console.log(isDeploying)
  console.log(process.env)

  return (
    <div>
      {showButton && (
        <div onClick={toggleElements}>
          <DegradeButton>Conect Wallet</DegradeButton>
        </div>
      )}
      {showElements && (
        <div className="flex gap-4">
          <button
            className="flex gap-2 btn-conect-wallet text-white text-xs hover:text-gray-200 py-2 px-4 w-[76px] border border-solid border-[#5a5a5a] items-center"
            onClick={toggleModal}
          >
            <Image
              alt="icon"
              src="/images/starknet.png"
              width={22}
              height={22}
            ></Image>
            32
          </button>
          <div className="border border-solid border-white flex gap-2 px-3 py-2 rounded-3xl text-xs items-center w-[130px]">
            {isDeploying ? (
              <>
                <Image
                  alt="icon"
                  src="/images/loader.png"
                  width={22}
                  height={22}
                ></Image>
                <span>loading ...</span>
              </>
            ) : (
              <>
                <Image
                  alt="icon"
                  src="/images/balance-wallet.png"
                  width={22}
                  height={22}
                ></Image>
                <span>{account.address.slice(0, 11)}</span>
              </>
            )}
          </div>
        </div>
      )}
      <div className={`modal ${modalAbierto ? "abierto" : ""}`}>
        <ModalWallet onClose={closeModal}></ModalWallet>
      </div>
    </div>
  );
};

export default ButtonToggle;
