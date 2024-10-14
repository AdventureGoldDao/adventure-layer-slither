/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */

import {getComponentValue} from "@latticexyz/recs";
import {ClientComponents} from "./createClientComponents";
import {SetupNetworkResult} from "./setupNetwork";
import {singletonEntity} from "@latticexyz/store-sync/recs";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  /*
   * The parameter list informs TypeScript that:
   *
   * - The first parameter is expected to be a
   *   SetupNetworkResult, as defined in setupNetwork.ts
   *
   *   Out of this parameter, we only care about two fields:
   *   - worldContract (which comes from getContract, see
   *     https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L63-L69).
   *
   *   - waitForTransaction (which comes from syncToRecs, see
   *     https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L77-L83).
   *
   * - From the second parameter, which is a ClientComponent,
   *   we only care about Counter. This parameter comes to use
   *   through createClientComponents.ts, but it originates in
   *   syncToRecs
   *   (https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L77-L83).
   */
  { worldContract, waitForTransaction }: SetupNetworkResult,
  { 
    Counter,
    Position,
    Balance,
  }: ClientComponents,
) {
  const getScore = async () => {
    return await worldContract.read.getScore();
  };
  const increment = async () => {
    const tx = await worldContract.write.increment();
    await waitForTransaction(tx);
    return getComponentValue(Counter, singletonEntity);
  };
  const getPlayerBalance = async () => {
    return await worldContract.read.getCurrentBalance()
  };
  const rechargeGameBalance = async () => {
    const tx = await worldContract.write.startGame();
    await waitForTransaction(tx);
    return getComponentValue(Counter, singletonEntity);
  };
  const payForGame = async () => {
    const tx = await worldContract.write.payForGame();
    await waitForTransaction(tx);
    return getComponentValue(Counter, singletonEntity);
  };
  const startGame = async () => {
    const tx = await worldContract.write.startGame();
    await waitForTransaction(tx);
    return getComponentValue(Position, singletonEntity)
  };
  const endGame = async () => {
    const tx = await worldContract.write.endGame();
    await waitForTransaction(tx);
  };

  const move = async (direction: number) => {
    const tx = await worldContract.write.move([direction]);
    await waitForTransaction(tx);
    return getComponentValue(Position, singletonEntity)
  };

  const getPositionData = async () => {
    return await worldContract.read.getPositionData()
  };

  return {
    move,
    getScore,
    increment,
    startGame,
    endGame,
    getPlayerBalance,
    rechargeGameBalance,
    payForGame,
    getPositionData,
  };

}

