/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */

import {getComponentValue} from "@latticexyz/recs";
import {ClientComponents} from "./createClientComponents";
import {SetupNetworkResult} from "./setupNetwork";
import {Position} from "../game/GameState";
import { ethers } from 'ethers';
import {parseGwei,parseAbi} from "viem";

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
  { worldContract, waitForTransaction, playerEntity,walletClient }: SetupNetworkResult,
  {
    Users,
    Balance,
    UserAccountMapping,
  }: ClientComponents,
) {
  const stGame = async (name:string) => {
    const tx = await worldContract.write.stGame([name]);
    await waitForTransaction(tx);
    return getComponentValue(Users, playerEntity);
  };
  const endGame = async () => {
    const tx = await worldContract.write.endGame();
    return await waitForTransaction(tx);
  };

  const adventureHeatbeat = async () => {
    const tx = await worldContract.write.adventureHeatbeat();
    return await waitForTransaction(tx);
  };

  const getOrbData = async () => {
    return await worldContract.read.getOrbData();
  };

  const moveSnake = async (list: Position[]) => {
    const tx = await worldContract.write.moveSnake([list])
    await waitForTransaction(tx)
    return await worldContract.read.getUpdatePosition([walletClient.account.address]);
  };

  const getBindAccount = async () => {
    return await worldContract.read.getBindAccount();
    // await waitForTransaction(tx);
    // return getComponentValue(UserAccountMapping, playerEntity)
  };

  // const getLeaderboardData = async (gameCode) => {
  //   return await worldContract.read.getLeaderboardData({
  //     args: [gameCode], // Arguments required for the function
  //     account: publicAddress,  // Wallet address
  //   });
  // };

  const getBindAccountBy = async () => {
    // const tx = await worldContract.write.getBindAccountBy().then((res) => {
    //   console.log('====>', res);
    //   return res
    // });
    // await waitForTransaction(tx);
    return getComponentValue(UserAccountMapping, playerEntity)
  };



  const getUserBindAccount = async (address) => {
    return await worldContract.read.getUserBindAccount([address]).then((res) => {
      // console.log('====>', res);
      return res
    });
  };

  const setBindAccount = async (pk: string) => {
    const tx = await worldContract.write.setBindAccount([pk]);
    await waitForTransaction(tx);
    return getComponentValue(UserAccountMapping, playerEntity);
  };

  const getPrivateBindAddress = async (pk: any) => {
    return await worldContract.read.getPrivateBindAddress([pk]).then((res) => {
      // console.log('====>', res);
      return res
    });
  };

  const setBindAccountNotExist = async (pk: string, pkEncode: any) => {
    const tx = await worldContract.write.setBindAccountNotExist([pk, pkEncode]);
    await waitForTransaction(tx);
    return getPrivateBindAddress(pkEncode);
  };

  return {
    stGame,
    endGame,
    moveSnake,
    getOrbData,
    adventureHeatbeat,
    getBindAccount,
    getBindAccountBy,
    getUserBindAccount,
    getPrivateBindAddress,
    setBindAccount,
    setBindAccountNotExist,
  };

}

