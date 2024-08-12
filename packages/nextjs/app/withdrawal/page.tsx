"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CustomSelect from "~~/components/Select/Select";

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
    router.push("/withdrawal/transaction");
  };

  const handleChange = () => {
    console.log(`Depositing ${amount} ${selectedToken}`);
    router.push("/deposit");
  };

  return (
    <div className="flex justify-center items-center min-h-screen text-white font-monserrat">
      <div className="p-8 w-2/3">
        <div className="flex gap-60 mb-6">
          <button
            className="text-white bg-[#21262B] rounded-[2px] py-3 px-7 flex gap-2 items-center"
            onClick={handleChange}
          >
            Deposit
            <Image
              src="/vector-return.svg"
              alt="return"
              width={20}
              height={15}
            ></Image>
          </button>
          <h1 className="text-2xl font-bold font-valorant">WITHDRAWAL</h1>
        </div>
        <div className="flex gap-10">
          <div className="relative">
            <CustomSelect></CustomSelect>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-10 bg-[#21262B] rounded-[8px] py-6 px-6 w-full">
              <div className="flex flex-col justify-start gap-4">
                <input
                  type="type"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="w-full p-3 bg-[#21262B] rounded-md text-white focus:outline-none"
                />
                <div className="text-gray-400 mt-1">
                  ~ ${parseFloat(amount || "0").toFixed(2)}
                </div>
              </div>
              <div className="flex items-start">
                <button className="text-black text-sm pt-2 bg-[#00ECFF] py-2 px-4 rounded-[6px]">
                  Max
                </button>
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
            className="px-10 py-3 mt-4 shadow-button focus:outline-none font-arcade text-shadow-deposit text-2xl"
          >
            WITHDRAW
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;