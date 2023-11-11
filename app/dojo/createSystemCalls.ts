import { SetupNetworkResult } from "./setupNetwork";
import { Account } from "starknet";
import { Entity, getComponentValue } from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { getEvents, setComponentsFromEvents } from "@dojoengine/utils";
import { getContractByName } from "@dojoengine/core";
import { Slot } from "../roulette/internals/Board/board";
export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls({
  execute,
  contractComponents,
  provider,
}: SetupNetworkResult) {
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

  const mint = async (signer: Account) => {
    // mint
    try {
      const tx = await execute(signer, "erc_systems", "mint_", [
        signer.address,
        10000000,
        0,
      ]);
      const events = getEvents(
        await signer.waitForTransaction(tx.transaction_hash, {
          retryInterval: 100,
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  const bet = async (signer: Account, choices: Slot[]) => {
    let nonZeroChoices: any = [];
    let nonZeroChoicesBetAmount: any = [];

    const aggregates = choices.forEach((choices, index) => {
      if (choices.coins.length > 0) {
        let aggregateOfCoins = 0;
        choices.coins.forEach((coin) => {
          aggregateOfCoins += coin;
        });
        nonZeroChoices.push(index + 2); // 0 is none and 1 is 0 so we add 2
        nonZeroChoicesBetAmount.push(aggregateOfCoins);
      }
    });

    // aggregate the amounts
    const totalBetAmount = nonZeroChoicesBetAmount.reduce(
      (a: any, b: any) => a + b,
      0
    );

    // approve
    try {
      const tx = await execute(signer, "erc_systems", "approve", [
        getContractByName(provider.manifest, "actions"),
        totalBetAmount,
        0,
      ]);

      const events = getEvents(
        await signer.waitForTransaction(tx.transaction_hash, {
          retryInterval: 100,
        })
      );
    } catch (e) {
      console.log(e);
    }

    // bet
    try {
      const tx = await execute(signer, "actions", "move", [
        process.env.NEXT_PUBLIC_GAME_ID,
        nonZeroChoices.length,
        ...nonZeroChoices,
        nonZeroChoicesBetAmount.length,
        ...nonZeroChoicesBetAmount,
      ]);

      const events = getEvents(
        await signer.waitForTransaction(tx.transaction_hash, {
          retryInterval: 100,
        })
      );
    } catch (e) {
      console.log(e);
    }

    return totalBetAmount;
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
    mint,
    bet,
  };
}
