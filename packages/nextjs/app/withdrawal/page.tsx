"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CustomSelect from "~~/components/Select/Select";
import { useAccount } from "@starknet-react/core";
import useScaffoldStrkBalance from "~~/hooks/scaffold-stark/useScaffoldStrkBalance";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";
import { Address } from "@starknet-react/chains";
import useWithDrwaw from "~~/utils/api/hooks/useWithdraw";
import { fetchPriceFromCoingecko, notification } from "~~/utils/scaffold-stark";

const Page = () => {
  const [amount, setAmount] = useState("");
  const [strk, setStrk] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data } = useGetUserInfo();
  const { address } = useAccount();
  const strkBalancAccount = useScaffoldStrkBalance({
    address: data?.account_address,
  });

  const handleWithDrawSuccess = (data: any) => {
    setLoading(false);
    setAmount("");
    router.push(
      `/withdrawal/transaction?transaction_hash=${data.transaction_hash}&receiver=${address}&amount=${amount}`
    );
  };

  const handleWithDrawFailure = (error: any) => {
    setLoading(false);
    setAmount("");
  };

  const { mutate: withdraw } = useWithDrwaw(
    handleWithDrawSuccess,
    handleWithDrawFailure
  );

  const handleWithDraw = () => {
    setLoading(true);
    withdraw({
      account_address: address ?? "",
      amount: `${Math.pow(10, 18) * parseFloat(amount)}`,
      token_address:
        process.env.NEXT_PUBLIC_TOKEN_ADDRESS_STR ??
        "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    });
  };

  const handleGetSTRKPrice = useCallback(async () => {
    try {
      const strkPrice = await fetchPriceFromCoingecko("STRK");
      setStrk(strkPrice);
    } catch (err: any) {
      notification.error(err);
    }
  }, []);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleChange = () => {
    router.push("/deposit");
  };

  useEffect(() => {
    handleGetSTRKPrice();
  }, [handleGetSTRKPrice]);

  useEffect(() => {
    if(parseFloat(amount) > parseFloat(strkBalancAccount.formatted)){
      notification.warning(`Avaiable Balance : ${strkBalancAccount.formatted}`)
      setAmount(strkBalancAccount.formatted)
    }
  }, [amount, strkBalancAccount.formatted])

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
                Deposit
                <Image
                  src="/vector-return.svg"
                  alt="return"
                  width={20}
                  height={15}
                />
              </button>
              <div className=" w-full">
                <CustomSelect address={address as Address} />
              </div>
            </div>
          </div>
          <div className="w-full h-[250px] flex flex-col gap-4">
            <h1 className="text-2xl h-[48px] font-bold font-valorant mb-0 text-center title-screen">
              WITHDRAWAL
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
                  ~ $
                  {isNaN(parseFloat(amount) * strk)
                    ? 0
                    : parseFloat(amount) * strk}
                </div>
              </div>
              <div className="flex items-start">
                <button
                  onClick={() => setAmount(strkBalancAccount.formatted)}
                  className="text-black text-sm pt-2 bg-[#00ECFF] py-2 px-4 rounded-[6px]"
                >
                  Max
                </button>
              </div>
            </div>
            <div className="text-right text-gray-400 mt-2">
              Available Balance: {strkBalancAccount.formatted}
            </div>
          </div>
        </div>
        <div className="flex justify-center my-10 w-full">
          <button
            className="px-10 py-3 mt-4 shadow-button focus:outline-none font-arcade text-shadow-deposit text-2xl"
            onClick={handleWithDraw}
            disabled={loading}
          >
            {loading ? "Loading..." : "WITHDRAW"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
