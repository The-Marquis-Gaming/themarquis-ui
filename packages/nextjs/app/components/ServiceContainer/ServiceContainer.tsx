/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import "./ServiceContainer.css";

function ServiceContainer() {
  return (
    <div className="flex service-container">
      <div className="flex flex-col service-content mt-12 gap-40">
        <div>
          <h3 className="text-[40px] font-agencyFb font-bold">
            Increased <br></br>Transaction volume
          </h3>
        </div>
        <div>
          <h3 className="text-[40px] font-agencyFb font-bold ">
            Reusable Betting System
          </h3>
        </div>
      </div>
      <div className="flex flex-col service-content">
        <div className="service-card">
          <div>
            <span className="service-title text-xl font-bold">Randomness</span>
          </div>
          <p className="mt-3">
            Ensure fair play and true randomness with Starknet's zero-knowledge
            proof technology, guaranteeing the integrity of every game.
          </p>
        </div>
        <div className="service-card">
          <div>
            <span className="ps-4 service-title2 text-xl font-bold">
              Liquidity
            </span>
          </div>
          <p className="mt-3">
            Seamlessly connect with the Ethereum ecosystem through cross-chain
            messaging, providing ample liquidity for a smooth gambling
            experience.
          </p>
        </div>
      </div>
      <div className="flex flex-col service-content">
        <div className="service-card2">
          <div>
            <span className="ps-4 service-title3 text-xl font-bold">
              Settlement
            </span>
          </div>
          <p className="mt-3">
            Enjoy fast and secure transaction settlement capabilities, ensuring
            prompt payouts and minimizing wait times.
          </p>
        </div>
        <div className="service-card">
          <div>
            <span className="ps-4 service-title4 text-xl font-bold">
              Synthetic Nature
            </span>
          </div>
          <p className="mt-3">
            Utilize order submissions for gambling moves, taking advantage of
            Starknet's strengths in handling complex, high-volume transactions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ServiceContainer;
