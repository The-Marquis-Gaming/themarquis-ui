"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CustomSelect from "~~/components/Select/Select";
import { useAccount } from "@starknet-react/core";
import { Address } from "@starknet-react/chains";
import useScaffoldStrkBalance from "~~/hooks/scaffold-stark/useScaffoldStrkBalance";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { Button } from "@radix-ui/themes";
import { fetchPriceFromCoingecko, notification } from "~~/utils/scaffold-stark";

const Page = () => {
  const [amount, setAmount] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [strk, setStrk] = useState(0);
  const { address } = useAccount();
  const strkBalanceWallet = useScaffoldStrkBalance({
    address: address,
  });
  const { data } = useGetUserInfo();
  const { formatted } = useScaffoldStrkBalance({
    address: data?.account_address,
  });

  const { writeAsync } = useScaffoldWriteContract({
    contractName: "Strk",
    functionName: "transfer",
    args: [data?.account_address, Math.pow(10, 18) * parseFloat(amount)],
  });

  const handleGetSTRKPrice = useCallback(async () => {
    try {
      const strkPrice = await fetchPriceFromCoingecko("STRK");
      setStrk(strkPrice);
    } catch (err: any) {
      notification.error(err);
    }
  }, []);

  const handleDeposite = async () => {
    setLoading(true);
    try {
      const res = await writeAsync();
      setAmount("");
      setLoading(false);
      router.push(
        `/deposit/transaction?transaction_hash=${res}&receiver=${data?.account_address}&amount=${amount}`
      );
    } catch (err) {
      setAmount("");
      setLoading(false);
    }
  };
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleChange = () => {
    router.push("/withdrawal");
  };

  useEffect(() => {
    handleGetSTRKPrice();
  }, [handleGetSTRKPrice]);

  return (
    <div className="h-screen-minus-80">
      <div className="h-full flex flex-col justify-center w-full">
        <div className="max-w-[1000px] w-full mx-auto flex gap-4 items-center">
          <div className="max-w-[300px] h-[250px]">
            <div className="flex flex-col gap-4">
              <button
                className="text-white bg-[#21262B] rounded-[2px] py-3 px-7 flex justify-between items-center w-[200px]"
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
              <div className="w-full">
                <CustomSelect address={address as Address} />
              </div>
            </div>
          </div>
          <div className="w-full h-[250px] flex flex-col gap-4">
            <h1 className="text-2xl h-[48px] font-bold font-valorant mb-0 text-center title-screen">
              DEPOSIT
            </h1>
            <div className="flex gap-4 bg-[#21262B] rounded-[8px] py-6 px-6 w-full">
              <div className="flex flex-col justify-start gap-4 w-full">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="w-full p-3 bg-[#21262B] rounded-md text-white focus:outline-none"
                />
                <div className="text-gray-400 mt-1">
                  ~ ${isNaN((parseFloat(amount) * strk)) ? 0 : parseFloat(amount) * strk}
                </div>
              </div>
              {parseFloat(amount) > parseFloat(strkBalanceWallet.formatted) && (
                <div className="flex items-start gap-1">
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
              )}
            </div>
            <div className="text-right text-gray-400 mt-2">
              Available Balance: {formatted}
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full my-10">
          <Button
            disabled={loading}
            onClick={handleDeposite}
            className="px-10 py-3 mt-4 shadow-button focus:outline-none font-arcade text-shadow-deposit text-2xl"
          >
            {loading ? "Loading..." : "DEPOSIT"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
