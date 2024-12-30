import { Address } from "@starknet-react/chains";
import { useDeployedContractInfo } from "./useDeployedContractInfo";
import { useReadContract } from "@starknet-react/core";
import { BlockNumber } from "starknet";
import { Abi } from "abi-wan-kanabi";
import { formatUnits } from "ethers";
import { useMemo } from "react";
import { strkTokenAbi } from "~~/utils/Constants";

type UseScaffoldStrkBalanceProps = {
  address?: Address | string;
};

const useScaffoldStrkBalance = ({ address }: UseScaffoldStrkBalanceProps) => {
  const { data: deployedContract } = useDeployedContractInfo("Strk");

  // Memoize args to avoid unnecessary updates
  const args = useMemo(() => (address ? [address] : []), [address]);

  const { data, ...props } = useReadContract({
    functionName: "balance_of",
    address:
      deployedContract?.address ||
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    abi: (deployedContract?.abi || strkTokenAbi) as Abi as any[],
    watch: false, // Disable watch as we control updates through `enabled`
    enabled: Boolean(address), // Only enable if address is defined
    args,
    blockIdentifier: "pending" as BlockNumber,
  });

  return {
    value: data as unknown as bigint,
    decimals: 18,
    symbol: "STRK",
    formatted: data ? formatUnits(data as unknown as bigint) : "0",
    ...props,
  };
};

export default useScaffoldStrkBalance;
