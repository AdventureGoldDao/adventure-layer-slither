// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {Users, UsersData} from "../codegen/index.sol";
import {System} from "@latticexyz/world/src/System.sol";

contract UsersSystem is System {

  function getData() public view returns (UsersData memory c) {
    return Users.get(msg.sender);
  }

  function setUsername(bytes32 name) public {
    Users.setUsername(msg.sender,name);
  }

}
