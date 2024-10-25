// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {Users, UsersData} from "../codegen/index.sol";
import {System} from "@latticexyz/world/src/System.sol";
import {GameStateSystem} from "./GameStateSystem.sol";

contract UsersSystem is System {

  //get score
  function getData() public view returns (UsersData memory) {
    return Users.get(msg.sender);
  }

}
