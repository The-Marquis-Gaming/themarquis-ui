import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { RPCProvider, Query } from "@dojoengine/core";
import { Account, num } from "starknet";
import { GraphQLClient } from "graphql-request";
import manifest from "../../manifest.json";

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export async function setupNetwork() {
  const provider = new RPCProvider(
    process.env.NEXT_PUBLIC_WORLD_ADDRESS!,
    manifest,
    process.env.NEXT_PUBLIC_NODE_URL!
  );

  return {
    provider,
    world,

    contractComponents: defineContractComponents(world),

    graphQLClient: () =>
      new GraphQLClient(process.env.NEXT_PUBLIC_TORII_URL! + "/graphql"),

    execute: async (
      signer: Account,
      contract: string,
      system: string,
      call_data: num.BigNumberish[]
    ) => {
      return provider.execute(signer as any, contract, system, call_data);
    },

    entity: async (component: string, query: Query) => {
      return provider.entity(component, query);
    },

    entities: async (component: string, partition: number) => {
      return provider.entities(component, partition);
    },
  };
}
