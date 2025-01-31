import { useAccount } from "@starknet-react/core";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import { ChainWithAttributes } from "~~/utils/scaffold-stark";

export function useTargetNetwork(): { targetNetwork: ChainWithAttributes } {
  const { chainId } = useAccount();
  const targetNetwork = useGlobalState(({ targetNetwork }) => targetNetwork);
  const setTargetNetwork = useGlobalState(({ setTargetNetwork }) => setTargetNetwork);

  // Use the wallet's chainId if connected, otherwise use the first network from config
  const determinedNetwork = chainId 
    ? scaffoldConfig.targetNetworks.find(n => n.id === chainId) 
    : scaffoldConfig.targetNetworks[0];

  if (determinedNetwork && determinedNetwork.id !== targetNetwork.id) {
    setTargetNetwork(determinedNetwork);
  }

  return {
    targetNetwork: {
      ...targetNetwork,
    },
  };
}