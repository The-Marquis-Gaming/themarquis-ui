import { Account } from "starknet";
import { Entity, getComponentValue } from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { getEvents, setComponentsFromEvents } from "@dojoengine/utils";
import { getContractByName } from "@dojoengine/core";
import { Slot } from "@/app/roulette/internals/Board/domain";
import { ContractComponents } from "./generated/contractComponents";
import type { IWorld } from "./generated/generated";
import { useState } from "react";
export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { client }: { client: IWorld },
  contractComponents: ContractComponents,
  { ERC20Balance, Move, Game }: ClientComponents
) {
  // const spawn = async (signer: Account) => {
  //   const entityId = signer.address.toString() as Entity;

  //   const positionId = uuid();
  //   Position.addOverride(positionId, {
  //     entity: entityId,
  //     value: { vec: { x: 10, y: 10 } },
  //   });

  //   const movesId = uuid();
  //   Moves.addOverride(movesId, {
  //     entity: entityId,
  //     value: { remaining: 10 },
  //   });

  //   try {
  //     const tx = await execute(signer, "actions", "spawn", []);
  //     setComponentsFromEvents(
  //       contractComponents,
  //       getEvents(
  //         await signer.waitForTransaction(tx.transaction_hash, {
  //           retryInterval: 100,
  //         })
  //       )
  //     );
  //   } catch (e) {
  //     console.log(e);
  //     Position.removeOverride(positionId);
  //     Moves.removeOverride(movesId);
  //   } finally {
  //     Position.removeOverride(positionId);
  //     Moves.removeOverride(movesId);
  //   }
  // };

  const selfMint = async (signer: Account) => {
    console.log("Self minting");
    console.log(signer, "erc_systems", "mint_", [
      signer.address,
      100 * 10 ** 6,
      0,
    ]);
    try {
      const { transaction_hash } = await client.actions.selfMint({
        account: signer,
      });

      // setComponentsFromEvents(
      //   contractComponents,
      //   getEvents(
      //     await account.waitForTransaction(transaction_hash, {
      //       retryInterval: 100,
      //     })
      //   )
      // );
    } catch (e) {
      console.log(e);
      // Position.removeOverride(positionId);
      // Moves.removeOverride(movesId);
    } finally {
      // Position.removeOverride(positionId);
      // M
    }
  };

  const useSelfMint = (signer: Account) => {
    const [loading, setLoading] = useState(false);

    const mint = async () => {
      setLoading(true);
      await selfMint(signer);
      setLoading(false);
    };

    return {
      mint,
      loading,
    };
  };

  const bet = async (signer: Account, choices: Slot[]) => {
    try {
      const { transaction_hash } = await client.actions.bet({
        account: signer,
        choices,
      });

      // setComponentsFromEvents(
      //   contractComponents,
      //   getEvents(
      //     await account.waitForTransaction(transaction_hash, {
      //       retryInterval: 100,
      //     })
      //   )
      // );
    } catch (e) {
      console.log(e);
      // Position.removeOverride(positionId);
      // Moves.removeOverride(movesId);
    } finally {
      // Position.removeOverride(positionId);
      // Moves.removeOverride(movesId);
    }
  };

  // const move = async (signer: Account, direction: Direction) => {
  //   const entityId = signer.address.toString() as Entity;

  //   const positionId = uuid();
  //   Position.addOverride(positionId, {
  //     entity: entityId,
  //     value: updatePositionWithDirection(
  //       direction,
  //       // currently recs does not support nested values so we use any here
  //       getComponentValue(Position, entityId) as any
  //     ),
  //   });

  //   const movesId = uuid();
  //   Moves.addOverride(movesId, {
  //     entity: entityId,
  //     value: {
  //       remaining: (getComponentValue(Moves, entityId)?.remaining || 0) - 1,
  //     },
  //   });

  //   try {
  //     const tx = await execute(signer, "actions", "move", [direction]);
  //     setComponentsFromEvents(
  //       contractComponents,
  //       getEvents(
  //         await signer.waitForTransaction(tx.transaction_hash, {
  //           retryInterval: 100,
  //         })
  //       )
  //     );
  //   } catch (e) {
  //     console.log(e);
  //     Position.removeOverride(positionId);
  //     Moves.removeOverride(movesId);
  //   } finally {
  //     Position.removeOverride(positionId);
  //     Moves.removeOverride(movesId);
  //   }
  // };

  return {
    bet,
    useSelfMint,
    selfMint,
  };
}
