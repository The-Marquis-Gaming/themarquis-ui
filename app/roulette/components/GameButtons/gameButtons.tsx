import React from "react";
import Image from "next/image";
import "./gameButtons.css";
import { useDojo } from "../../../DojoContext";

function GameButtons() {
  const {
    setup: {
      systemCalls: { mint },
      components,
      entityUpdates,
      network: { contractComponents, graphClient },
    },
    account: { create, list, select, account, isDeploying, clear },
  } = useDojo();

  return (
    <div className="flex gap-10">
      <button onClick={create} className="py-4 px-20 border border-solid border-[#A962FF] bg-[#111] rounded-[15px]">
        CREATE
      </button>
      <button className="py-4 px-20 border border-solid border-[#A962FF] bg-[#111] rounded-[15px] button-eraser">
        <Image
          src="/images/eraser.png"
          alt="eraser"
          width={29}
          height={29}
        ></Image>
        ERASE
      </button>
      <button
        onClick={() => mint(account)}
        className="py-4 px-20 border border-solid border-[#A962FF] bg-[#111] rounded-[15px]"
      >
        MINT
      </button>
    </div>
  );
}

export default GameButtons;
