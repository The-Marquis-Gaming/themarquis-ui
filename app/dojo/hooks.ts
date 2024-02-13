import { Account } from "starknet";
import { useDojo } from "./useDojo";
import useSWR, { Fetcher } from "swr";

type AccountBalance = {
  erc20balanceModels: {
    edges: {
      node: {
        token: string;
        account: string;
        amount: string;
      };
    }[];
  };
};

function buildBalanceQuery(address: string) {
  let parsedAddress = address.slice(2);
  let parsedTokenAddr = process.env.NEXT_PUBLIC_USDM_ADDRESS!.slice(2);
  // if account less than 32 bytes, add 0s to the left
  parsedAddress = parsedAddress.padStart(64, "0");
  parsedTokenAddr = parsedTokenAddr.padStart(64, "0");
  return `{
      erc20BalanceModels(
        where: {
          account: "0x${parsedAddress}"
          token: "0x${parsedTokenAddr}"
        }
      ) {
        edges {
          node {
            token
            account
            amount
          }
        }
      }
    }`;
}
export const useUSDmBalance = (account: Account) => {
  let isReady = false;
  const {
    setup: { graphQLClient },
  } = useDojo();
  const fetcher: Fetcher<AccountBalance, string> = (query) =>
    graphQLClient().request(query);

  const { data: accountBalance, error } = useSWR(
    buildBalanceQuery(account.address),
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  if (!accountBalance) {
    return { accountBalance: 0, isReady };
  }

  return {
    isReady: true,
    accountBalance:
      accountBalance?.erc20BalanceModels.edges.length > 0
        ? parseInt(accountBalance.erc20BalanceModels.edges[0].node.amount) /
          1000000
        : 0,
  };
};
