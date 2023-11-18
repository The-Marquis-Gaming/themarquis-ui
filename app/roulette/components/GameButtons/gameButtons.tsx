import React, { useEffect } from "react";
import Image from "next/image";
import "./gameButtons.css";
import { useDojo } from "../../../DojoContext";

interface GameButton {
  clear: () => void;
  eraseMode: boolean;
  handleEraseClick: () => void;
}

function GameButtons(props: GameButton) {
  const {
    setup: {
      systemCalls: { mint },
      components,
      entityUpdates,
      network: { contractComponents, graphClient },
    },
    account: { create, list, select, account, isDeploying },
  } = useDojo();

  const { clear, eraseMode, handleEraseClick } = props;
  const handleCreateAndMint = () => {
    create();
  };

  useEffect(() => {
    if (account) {
      mint(account);
    }
  }, [account]);

  return (
    <div className="flex gap-10">
      <button
        onClick={handleCreateAndMint}
        className="py-4 px-20 border border-solid border-[#A962FF] bg-[#111] rounded-[15px]"
      >
        CREATE & MINT
      </button>

      <button
        className={`py-4 px-20 border border-solid border-[#A962FF] bg-[#111] rounded-[15px] button-eraser ${
          eraseMode ? "erase-mode" : ""
        }`}
        onClick={handleEraseClick}
      >
        <Image
          src="/images/eraser.png"
          alt="eraser"
          width={29}
          height={29}
        ></Image>
        ERASE
      </button>
      <button
        className="py-4 px-20 border border-solid border-[#A962FF] bg-[#111] rounded-[15px]"
        onClick={clear}
      >
        CLEAR
      </button>
    </div>
  );
}

export default GameButtons;
