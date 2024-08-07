"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
  const [selectedToken, setSelectedToken] = useState("STRK");
  const [amount, setAmount] = useState("");
  const router = useRouter();

  const handleTokenChange = (token: string) => {
    setSelectedToken(token);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleDeposit = () => {
    console.log(`Depositing ${amount} ${selectedToken}`);
    router.push("/deposit/transaction");
  };

  const handleChange = () => {
    router.push("/withdrawal");
  };

  return (
    <div className="flex justify-center items-center min-h-screen text-white font-monserrat">
      <div className="p-8 w-2/3">
        <div className="flex gap-60 mb-6">
          <button
            className="text-white bg-[#21262B] rounded-[2px] py-3 px-7 flex gap-2 items-center"
            onClick={handleChange}
          >
            Withdraw
            <Image
              src="/vector-return.svg"
              alt="return"
              width={20}
              height={15}
            ></Image>
          </button>
          <h1 className="text-2xl font-bold font-valorant">DEPOSIT</h1>
        </div>
        <div className="flex gap-10">
          <div className="relative">
            <select
              value={selectedToken}
              onChange={(e) => handleTokenChange(e.target.value)}
              className="w-[200px] px-6 py-3 bg-[#21262B] rounded-md focus:outline-none border border-[#00ECFF]"
            >
              <option value="STRK">STRK</option>
              <option value="USDC" disabled>
                USDC
              </option>
            </select>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-10 bg-[#21262B] rounded-[8px] py-6 px-6 w-full">
              <div className="flex flex-col justify-start gap-4">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="w-full p-3 bg-[#21262B] rounded-md text-white focus:outline-none"
                />
                <div className="text-gray-400 mt-1">
                  ~ ${parseFloat(amount || "0").toFixed(2)}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Image
                  src="/alert.svg"
                  alt="alert"
                  width={40}
                  height={40}
                ></Image>
                <span className="text-[#FF1818] text-sm pt-2">
                  Insufficient Balance
                </span>
              </div>
            </div>
            <div className="text-right text-gray-400 mt-2">
              Available Balance: 0.00
            </div>
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
