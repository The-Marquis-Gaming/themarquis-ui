// pages/deposit.tsx
"use client"; // Asegura que el componente se ejecute en el lado del cliente

import { useState } from "react";

const Page = () => {
  const [selectedToken, setSelectedToken] = useState("STRK");
  const [amount, setAmount] = useState("");

  const handleTokenChange = (token: string) => {
    setSelectedToken(token);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleDeposit = () => {
    console.log(`Depositing ${amount} ${selectedToken}`);
    // Aquí iría la lógica para manejar la acción de depósito
  };

  return (
    <div className="flex justify-center items-center min-h-screen text-white">
      <div className="p-8 rounded-md shadow-md  w-3/4 max-w-lg">
        <div className="flex justify-between mb-6">
          <button className="text-gray-400">Withdraw</button>
          <h1 className="text-2xl font-bold">DEPOSIT</h1>
        </div>
        <div className="flex justify-between">
          <div className="relative">
            <select
              value={selectedToken}
              onChange={(e) => handleTokenChange(e.target.value)}
              className="w-full px-6 py-3 bg-gray-700 rounded-md focus:outline-none border border-[#00ECFF]"
            >
              <option value="STRK">STRK</option>
              <option value="USDC" disabled>USDC</option>
            </select>
          </div>
          <div className="flex flex-col gap-4">
          <div className=" bg-gray-700 rounded-[8px] py-6 px-8">
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="w-full p-3 bg-gray-700 rounded-md text-right text-white focus:outline-none"
            />
            <div className="text-right text-gray-400 mt-1">~ ${parseFloat(amount || "0").toFixed(2)}</div>
          </div>
          <div className="text-right text-gray-400 mt-2">Available Balance: 0.00</div>
          </div>
        </div>
        <div className="flex justify-center my-10">
          <button
            onClick={handleDeposit}
            className="px-10 py-3 mt-4 shadow-button focus:outline-none"
          >
            DEPOSIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
