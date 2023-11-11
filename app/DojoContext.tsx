"use client";

import { BurnerProvider, useBurner } from "@dojoengine/create-burner";
import { ReactNode, createContext, useContext, useMemo } from "react";
import { Account, RpcProvider, provider } from "starknet";
import { SetupResult } from "./dojo/setup";

interface DojoContextType extends SetupResult {
  masterAccount: Account;
}

const DojoContext = createContext<DojoContextType | null>(null);

type DojoProviderProps = {
  children: ReactNode;
  value: SetupResult;
};

export const DojoProvider = ({ children, value }: DojoProviderProps) => {
  const currentValue = useContext(DojoContext);
  if (currentValue) throw new Error("DojoProvider can only be used once");

  const rpcProvider = useMemo(
    () =>
      new RpcProvider({
        nodeUrl:
          process.env.REACT_APP_PUBLIC_NODE_URL || "http://localhost:5050",
      }),
    []
  );

  const masterAddress = process.env.NEXT_PUBLIC_MASTER_ADDRESS as string;
  const privateKey = process.env.NEXT_PUBLIC_MASTER_PRIVATE_KEY as string;
  const accountClassHash = process.env.NEXT_PUBLIC_ACCOUNT_CLASS_HASH as string;
  const masterAccount = useMemo(
    () => new Account(rpcProvider, masterAddress, privateKey),
    [rpcProvider, masterAddress, privateKey]
  );
  console.log("debug master account");
  console.log(masterAccount);

  return (
    <BurnerProvider
      initOptions={{ masterAccount, accountClassHash, rpcProvider }}
    >
      <DojoContext.Provider value={{ ...value, masterAccount }}>
        {children}
      </DojoContext.Provider>
    </BurnerProvider>
  );
};

export const useDojo = () => {
  const contextValue = useContext(DojoContext);
  if (!contextValue)
    throw new Error("The `useDojo` hook must be used within a `DojoProvider`");
  console.log("debug contextValue");
  console.log(contextValue);
  const {
    create,
    list,
    get,
    account,
    select,
    isDeploying,
    clear,
    copyToClipboard,
    applyFromClipboard,
  } = useBurner();

  return {
    setup: contextValue,
    account: {
      create,
      list,
      get,
      select,
      clear,
      account: account ?? contextValue.masterAccount,
      isDeploying,
      copyToClipboard,
      applyFromClipboard,
    },
  };
};
