"use client";

import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";
import { ContractName } from "~~/utils/scaffold-stark/contract";
import { Contract, Abi } from "starknet";
import { useProvider, useAccount } from "@starknet-react/core";
import { useMemo } from "react";

export const useScaffoldContract = <TContractName extends ContractName>({
  contractName,
}: {
  contractName: TContractName;
}) => {
  const { data: deployedContractData, isLoading: deployedContractLoading } =
    useDeployedContractInfo(contractName);
  const { provider: publicClient } = useProvider();
  const { account } = useAccount();

  const contract = useMemo(() => {
    if (!deployedContractData) return undefined;

    const contractInstance = new Contract(
      deployedContractData.abi as Abi,
      deployedContractData.address,
      publicClient
    );

    if (account) {
      contractInstance.connect(account);
    }
    
    // Add response parsing options
    const originalCall = contractInstance.call.bind(contractInstance);
    contractInstance.call = async (method: string, callData: any) => {
      try {
        const response = await originalCall(method, callData);
        return response;
      } catch (error) {
        console.error(`Error calling ${method}:`, error);
        throw error;
      }
    };

    return contractInstance;
  }, [deployedContractData, publicClient, account]);

  return {
    data: contract,
    isLoading: deployedContractLoading,
  };
};