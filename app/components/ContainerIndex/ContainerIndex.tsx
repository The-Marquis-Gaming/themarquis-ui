import React from "react";
import "./ContainerIndex.css";
import DegradeButton from "../DegradeButton/DegradeButton";
import PillButton from "../PillButton/PillButton";

const ContainerIndex = () => {
  return (
    <div className="flex justify-center">
      <div className="background-contain">
        <div className="flex justify-between px-10">
          <div className=" flex justify-center flex-col">
            <h1 className="text-[96px] font-agencyFb max-w-[700px] spacing-title">
              Experiencie the Future of Online Betting
            </h1>
            <p className="text-[24px]">
              A Revolutionary On-Chain Gambling System Powered by Starknet
            </p>
            <div className="py-10">
              <DegradeButton size="large">CONNECT WALLET</DegradeButton>
              <PillButton documentUrl="">READ DOCS</PillButton>
            </div>
            <div className="h-130">
              <img src="/images/logo.png" alt="" />
            </div>
          </div>
          <div className="max-h-634">
            <img src="/images/cards.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainerIndex;
