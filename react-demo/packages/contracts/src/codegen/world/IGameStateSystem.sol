// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

/* Autogenerated file. Do not edit manually. */

import { GameState } from "../../common.sol";

/**
 * @title IGameStateSystem
 * @author MUD (https://mud.dev) by Lattice (https://lattice.xyz)
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface IGameStateSystem {
  function getGameState() external view returns (GameState[] memory);

  function getLeaderboardData(uint32 gameCode) external view returns (GameState memory);

  function getDataPlayers(uint32 gameCode) external view returns (address[] memory);

  function updateGameState(uint32 gameCode) external;

  function generateColor(int i) external view returns (string memory);

  function randomCoordinate(int i) external view returns (int);

  function generateOrbSize(int i) external view returns (string memory);

  function generateRandom(int i) external view returns (uint256);
}
