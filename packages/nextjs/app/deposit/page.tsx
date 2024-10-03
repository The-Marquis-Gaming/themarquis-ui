"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "@starknet-react/core";
import useScaffoldStrkBalance from "~~/hooks/scaffold-stark/useScaffoldStrkBalance";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { Button } from "@radix-ui/themes";
import * as Tooltip from "@radix-ui/react-tooltip";
import { fetchPriceFromCoingecko, notification } from "~~/utils/scaffold-stark";
import ConnectModal from "~~/components/scaffold-stark/CustomConnectButton/ConnectModal";
import SelecTokenModal from "~~/components/Modal/SelectTokenModal";
import useScaffoldEthBalance from "~~/hooks/scaffold-stark/useScaffoldEthBalance";
import SelectTokenButton from "~~/components/SelectTokenButton";

const Page = () => {
  const [activeToken, setActiveToken] = useState<string>("Strk");
  const [isModalOpenToken, setIsModalOpenToken] = useState<boolean>(false);
  const [amount, setAmount] = useState("");
  const [modalOpenConnect, setModalOpenConnect] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [priceToken, setPriceToken] = useState(0);
  const { address } = useAccount();
  const connector = useConnect();

  const strkBalanceWallet = useScaffoldStrkBalance({
    address: address,
  });
  const ethBalanceWallet = useScaffoldEthBalance({
    address: address,
  });
  const { data } = useGetUserInfo();

  const strkBalanceMarquis = useScaffoldStrkBalance({
    address: data?.account_address,
  });
  const ethBalanceMarquis = useScaffoldEthBalance({
    address: data?.account_address,
  });

  const { writeAsync } = useScaffoldWriteContract({
    contractName: activeToken === "Strk" ? "Strk" : "Eth",
    functionName: "transfer",
    args: [data?.account_address, Math.pow(10, 18) * parseFloat(amount)],
  });

  const handleGetTokenPrice = useCallback(async () => {
    try {
      const price = await fetchPriceFromCoingecko(
        activeToken === "Strk" ? "STRK" : "ETH"
      );
      setPriceToken(price);
    } catch (err: any) {
      notification.error(err);
    }
  }, [activeToken]);

  const handleDeposite = async () => {
    setLoading(true);
    if (!address) {
      setModalOpenConnect(true);
      setLoading(false);
      return;
    }
    if (parseFloat(amount) == 0) {
      notification.warning("Cannot perform transaction");
      setLoading(false);
      return;
    }
    try {
      const res = await writeAsync();
      if (!res) {
        setLoading(false);
        return;
      } else {
        setAmount("");
        setLoading(false);
        router.push(
          `/deposit/transaction?transaction_hash=${res}&receiver=${data?.account_address}&amount=${amount}&token=${activeToken}`
        );
      }
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

  const handleTokenChange = (newToken: string) => {
    setActiveToken(newToken);
  };

  const handleChange = () => {
    router.push("/withdrawal");
  };

  useEffect(() => {
    handleGetTokenPrice();
  }, [handleGetTokenPrice]);

  return (
    <div className="h-screen-minus-80">
      <div className="bg-[#171C20] max-w-[1100px] mx-auto py-12 px-40 rounded-[15px] border border-[#3A4259]">
        <div className="relative mb-14">
          <button
            className="absolute top-0 left-0 text-white bg-[#21262B] rounded-[4px] py-3 px-8 text-[20px] flex justify-between items-center gap-3"
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
          <h1 className="  text-center text-2xl h-[48px] pt-2 font-bold font-valorant  title-screen">
            DEPOSIT
          </h1>
        </div>
        <div className="relative">
          {/* Wallet  */}
          <div className="w-full bg-[#21262B] rounded-[12px] p-5 mb-[24px]">
            <p className="text-[#717A8C] mb-1">You deposit</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div onClick={() => setIsModalOpenToken(true)}>
                  <SelectTokenButton activeToken={activeToken} isSelect />
                </div>
                {parseFloat(amount) >
                  parseFloat(
                    activeToken === "Strk"
                      ? strkBalanceWallet.formatted
                      : ethBalanceWallet.formatted
                  ) && (
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
              <div className="flex items-center">
                <Image
                  src={
                    activeToken === "Strk"
                      ? "/logo-starknet.svg"
                      : "/logo-eth.svg"
                  }
                  width={20}
                  height={20}
                  alt="token"
                />
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="text-right text-[24px] px-3 w-[100px]  text-[#717A8C] bg-[#21262B] rounded-md  focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                {connector?.connector?.icon.light && (
                  <Image
                    src={connector?.connector?.icon.light!}
                    width={20}
                    height={20}
                    alt="icon"
                  />
                )}
                <p className="text-[#717A8C] font-bold">Wallet Balance: </p>
                <p className="text-[#717A8C]">
                  <span>
                    {activeToken === "Strk"
                      ? `${parseFloat(strkBalanceWallet.formatted).toFixed(4)} STRK`
                      : `${parseFloat(ethBalanceWallet.formatted).toFixed(8)} ETH`}
                  </span>{" "}
                  <span>
                    <button className="bg-[#00ECFF] text-black rounded-md px-2"
                    onClick={() => {
                      setAmount(activeToken === "Strk" ? strkBalanceWallet.formatted : ethBalanceWallet.formatted)
                    }}
                    >
                      (Max)
                    </button>
                  </span>
                </p>
              </div>
              <p className="text-[#717A8C]  px-3">
                ~ $
                {isNaN(parseFloat(amount) * priceToken)
                  ? 0
                  : parseFloat(amount) * priceToken}
              </p>
            </div>
          </div>
          <div className=" absolute top-[40%] left-[47%] transform border-8 border-[#252B36] bg-[#2D3542] rounded-[48px] w-[64px] h-[64px] flex items-center justify-center">
            <Image
              src={"/transactor-icon.svg"}
              width={30}
              height={30}
              alt="icon"
            />
          </div>
          {/* Marquis  */}
          <div className="w-full bg-[#21262B] rounded-[12px] p-5">
            <p className="text-[#717A8C] mb-1">You receive</p>
            <div className="flex justify-between items-center">
              <div className="flex items-baseline gap-4">
                <SelectTokenButton activeToken={activeToken} isSelect={false} />
                <Tooltip.Provider delayDuration={200} skipDelayDuration={500}>
                  <Tooltip.Root>
                    <Tooltip.Trigger>
                      <Image
                        src={"/mark_question.svg"}
                        alt="question"
                        height={20}
                        width={20}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Content className="text-[#676F8E] text-xs bg-white rounded-md p-2">
                      Available Balance to use in Marquis
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
              <div className="flex items-center">
                <Image
                  src={
                    activeToken === "Strk"
                      ? "/logo-starknet.svg"
                      : "/logo-eth.svg"
                  }
                  width={20}
                  height={20}
                  alt="token"
                />
                <input
                  disabled
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="text-right text-[24px] px-3 w-[100px]  text-[#717A8C] bg-[#21262B] rounded-md  focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Image
                  src={"/marquis-icon.svg"}
                  width={20}
                  height={20}
                  alt="icon"
                />
                <p className="text-[#717A8C] font-bold">Marquis Balance: </p>
                <p className="text-[#717A8C]">
                  <span>
                    {parseFloat(
                      activeToken === "Strk"
                        ? strkBalanceMarquis.formatted
                        : ethBalanceMarquis.formatted
                    ).toFixed(4)}
                  </span>
                  <span className="uppercase"> {activeToken} </span>
                  <span>(Max)</span>
                </p>
              </div>
              <p className="text-[#717A8C]  px-3">
                ~ $
                {isNaN(parseFloat(amount) * priceToken)
                  ? 0
                  : parseFloat(amount) * priceToken}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full my-10">
          <Button
            disabled={loading}
            onClick={handleDeposite}
            className="px-10 py-3 mt-4 rounded-[12px] bg-[#00ECFF] text-[#000]  w-full focus:outline-none text-sm]"
          >
            {loading ? "Loading..." : "Deposit"}
          </Button>
        </div>
      </div>
      <ConnectModal
        isOpen={modalOpenConnect}
        onClose={() => setModalOpenConnect(false)}
      />
      <SelecTokenModal
        isOpen={isModalOpenToken}
        onClose={() => setIsModalOpenToken(false)}
        onSelectToken={handleTokenChange}
        activeToken={activeToken}
      />
    </div>
  );
};

export default Page;
