// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

/* Autogenerated file. Do not edit manually. */

import { UsersData } from "../index.sol";

/**
 * @title IUsersSystem
 * @author MUD (https://mud.dev) by Lattice (https://lattice.xyz)
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface IUsersSystem {
  function getData() external view returns (UsersData memory);

  function stGame(string memory name) external;

  function endGame() external;
}
