import { Address } from "@starknet-react/chains";
import { useDeployedContractInfo } from "./useDeployedContractInfo";
import { useReadContract } from "@starknet-react/core";
import { BlockNumber } from "starknet";
import { Abi } from "abi-wan-kanabi";
import { formatUnits } from "ethers";
import { useMemo } from "react";

type UseScaffoldEthBalanceProps = {
  address?: Address | string;
};

const useScaffoldEthBalance = ({ address }: UseScaffoldEthBalanceProps) => {
  const { data: deployedContract } = useDeployedContractInfo("Eth");

  // Memoize args to avoid unnecessary updates
  const args = useMemo(() => (address ? [address] : []), [address]);

  const { data, ...props } = useReadContract({
    functionName: "balance_of",
    address: deployedContract?.address,
    abi: deployedContract?.abi as Abi as any[],
    watch: false, // Disable watch as we control updates through `enabled`
    enabled: Boolean(address), // Only enable if address is defined
    args,
    blockIdentifier: "pending" as BlockNumber,
  });

  return {
    value: data as unknown as bigint,
    decimals: 18,
    symbol: "ETH",
    formatted: data ? formatUnits(data as unknown as bigint) : "0",
    ...props,
  };
};

export default useScaffoldEthBalance;
